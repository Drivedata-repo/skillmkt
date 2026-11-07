param([Parameter(Mandatory=$true)][string]$RunDirectory)
$ErrorActionPreference='Stop'
$runPath=[IO.Path]::GetFullPath($RunDirectory)
$allowed=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../.local/artifact-evals'))+[IO.Path]::DirectorySeparatorChar
if (-not $runPath.StartsWith($allowed,[StringComparison]::OrdinalIgnoreCase)) {throw 'Review must stay inside artifact-evals'}
$run=Get-Content -LiteralPath (Join-Path $runPath 'run.json') -Raw | ConvertFrom-Json
if ($run.caseId -notin 'dax-review','power-query-review') {throw 'Unsupported BI case'}
$reviewPath=Join-Path $runPath 'host-review'
[IO.Directory]::CreateDirectory($reviewPath)|Out-Null
$filename=if($run.caseId -eq 'dax-review'){'revised.dax'}else{'revised.pq'}
$source=Join-Path $runPath $filename
$outputHash=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLower()
if ($outputHash -ne ($run.files | Where-Object filename -eq $filename).sha256) {throw 'Original output changed'}
$code=[IO.File]::ReadAllText($source)
$observations=[ordered]@{caseId=$run.caseId;reviewedAt=[DateTime]::UtcNow.ToString('o');outputSha256=$outputHash;passed=$false;checks=@();fullSkillExecutionVerified=$false}
$excel=$null;$book=$null
function Near($actual,$expected){if($null -eq $actual -or [Math]::Abs([double]$actual-$expected) -gt 0.00000001){throw "Expected $expected, observed $actual"}}
try {
  $excel=New-Object -ComObject Excel.Application
  $excel.Visible=$false;$excel.DisplayAlerts=$false;$excel.AutomationSecurity=3
  $book=$excel.Workbooks.Add()
  $sheet=$book.Worksheets.Item(1)
  $observations.officeVersion=$excel.Version
  if($run.caseId -eq 'power-query-review') {
    if($code -match 'Web\.Contents|File\.Contents|Sql\.Database|Odbc\.|OleDb\.') {throw 'Unexpected external source in synthetic test'}
    $observations.engine='Power Query / Microsoft Mashup in Excel'
    $book.Queries.Add('SkillReview',$code)|Out-Null
    $connection='OLEDB;Provider=Microsoft.Mashup.OleDb.1;Data Source=$Workbook$;Location=SkillReview;Extended Properties=""'
    $table=$sheet.ListObjects.Add(0,$connection,[Type]::Missing,1,$sheet.Range('A1'))
    $table.QueryTable.CommandType=2
    $table.QueryTable.CommandText='SELECT * FROM [SkillReview]'
    $table.QueryTable.BackgroundQuery=$false
    $table.QueryTable.Refresh($false)|Out-Null
    $rows=@()
    for($row=1;$row -le $table.DataBodyRange.Rows.Count;$row++) {
      $rows += [ordered]@{Id=$table.DataBodyRange.Cells.Item($row,1).Value2;Amount=$table.DataBodyRange.Cells.Item($row,2).Value2}
    }
    if($rows.Count -ne 3){throw 'M query did not preserve three rows'}
    Near $rows[0].Id 1; Near $rows[1].Id 2; Near $rows[2].Id 3
    Near $rows[0].Amount 10.5; Near $rows[2].Amount 20
    if($null -ne $rows[1].Amount -and $rows[1].Amount -ne ''){throw 'Null became a value'}
    $sum=0.0
    foreach($row in $rows){if($null -ne $row.Amount){$sum += [double]$row.Amount}}
    Near $sum 30.5
    $observations.rows=$rows;$observations.sum=$sum
    $observations.checks=@('Three original IDs preserved','pt-BR values parsed as 10.5 and 20','Null preserved as an empty Excel cell','Non-null sum 30.5')
    $observations.limitations=@('Literal source only; no remote query folding or refresh service tested')
  } else {
    $observations.engine='DAX / Excel Power Pivot data model'
    $fixture=Get-Content -LiteralPath (Join-Path $runPath 'sales.json') -Raw | ConvertFrom-Json
    $sheet.Name='Fixture'
    $sheet.Range('A1').Value2='Product';$sheet.Range('B1').Value2='Revenue';$sheet.Range('C1').Value2='Cost'
    for($i=0;$i -lt $fixture.rows.Count;$i++) {
      $sheet.Cells.Item($i+2,1).Value2=$fixture.rows[$i].product
      $sheet.Cells.Item($i+2,2).Value2=[double]$fixture.rows[$i].revenue
      $sheet.Cells.Item($i+2,3).Value2=[double]$fixture.rows[$i].cost
    }
    $table=$sheet.ListObjects.Add(1,$sheet.Range('A1:C3'),[Type]::Missing,1);$table.Name='Sales'
    $book.SaveAs((Join-Path $reviewPath 'engine-check.xlsx'),51)
    $book.Connections.Add2('Sales','Fictional evaluation','WORKSHEET;'+$book.FullName,'Sales',7,$true,$false)|Out-Null
    $book.Model.Initialize();$book.Model.Refresh()
    $ado=$book.Model.DataModelConnection.ModelConnection.ADOConnection
    $clean=[regex]::Replace($code,'(?s)/\*.*?\*/','')
    $clean=[regex]::Replace($clean,'(?m)//.*$','')
    $clean=[regex]::Replace($clean,'(?m)--.*$','')
    $measures=[regex]::Matches($clean,'(?ms)^\s*(Revenue Total|MarginPct)\s*=\s*(.*?)(?=^\s*(?:Revenue Total|MarginPct)\s*=|\z)')
    if($measures.Count -ne 2){throw 'Expected the two named DAX measures'}
    $define='DEFINE '+(($measures | ForEach-Object {"MEASURE 'Sales'["+$_.Groups[1].Value+'] = '+$_.Groups[2].Value.Trim()}) -join "`n")
    function QueryRow([string]$tail) {
      $rs=$ado.Execute($define+"`n"+$tail)
      $values=[ordered]@{}
      for($j=0;$j -lt $rs.Fields.Count;$j++) {
        $value=$rs.Fields.Item($j).Value
        if($value -is [DBNull]){$value=$null}
        $values[$rs.Fields.Item($j).Name.Trim('[',']')]=$value
      }
      $rs.Close();return $values
    }
    $base='EVALUATE ROW("Revenue", [Revenue Total], "Cost", SUM(Sales[Cost]), "Margin", [MarginPct])'
    $observations.total=QueryRow $base
    Near $observations.total.Revenue 1100;Near $observations.total.Cost 690;Near $observations.total.Margin (410/1100)
    $observations.filtered=QueryRow 'EVALUATE ROW("A", CALCULATE([MarginPct], Sales[Product]="A"), "B", CALCULATE([MarginPct], Sales[Product]="B"), "Empty", CALCULATE([MarginPct], Sales[Product]="NONE"))'
    Near $observations.filtered.A 0.4;Near $observations.filtered.B 0.1
    if($null -ne $observations.filtered.Empty){throw 'Expected BLANK for empty context'}
    $sheet.Range('B2').Value2=2000;$book.Model.Refresh()
    $observations.changedInput=QueryRow $base
    Near $observations.changedInput.Revenue 2100;Near $observations.changedInput.Margin (1410/2100)
    $sheet.Range('B2').Value2=0;$sheet.Range('B3').Value2=0;$book.Model.Refresh()
    $observations.zeroRevenue=QueryRow $base
    if($null -ne $observations.zeroRevenue.Margin){throw 'Expected BLANK for zero revenue'}
    $observations.checks=@('Actual generated measures executed by the DAX engine','Total revenue 1100, cost 690, weighted margin 410/1100','Filter A 40%; B 10%','Empty filter and zero revenue return BLANK','Changed revenue propagates through the model')
    $observations.limitations=@('Excel Power Pivot on synthetic data; no Power BI service, RLS, DirectQuery, equivalence benchmark or speedup measurement')
  }
  $observations.passed=$true
} finally {
  if($book){$book.Close($false)}
  if($excel){$excel.Quit();[Runtime.InteropServices.Marshal]::FinalReleaseComObject($excel)|Out-Null}
  [GC]::Collect();[GC]::WaitForPendingFinalizers()
  [IO.File]::WriteAllText((Join-Path $reviewPath 'bi-observations.json'),($observations|ConvertTo-Json -Depth 10),[Text.UTF8Encoding]::new($false))
}
$observations|ConvertTo-Json -Depth 10
