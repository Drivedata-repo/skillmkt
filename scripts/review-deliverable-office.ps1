param([Parameter(Mandatory=$true)][string]$RunDirectory)
$ErrorActionPreference = 'Stop'
$runPath = [IO.Path]::GetFullPath($RunDirectory)
$allowed = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../.local/artifact-evals')) + [IO.Path]::DirectorySeparatorChar
if (-not $runPath.StartsWith($allowed, [StringComparison]::OrdinalIgnoreCase)) { throw 'Review must stay inside artifact-evals' }
$run = Get-Content -LiteralPath (Join-Path $runPath 'run.json') -Raw | ConvertFrom-Json
$reviewPath = Join-Path $runPath 'host-review'
[IO.Directory]::CreateDirectory($reviewPath) | Out-Null
$observations = [ordered]@{caseId=$run.caseId; reviewedAt=[DateTime]::UtcNow.ToString('o'); method='Microsoft Office COM; isolated copies; macros disabled'; files=@()}
function FormulaValues($book) {
  $values = @()
  foreach ($sheet in $book.Worksheets) {
    foreach ($cell in $sheet.UsedRange.Cells) {
      if ($cell.HasFormula) { $values += [ordered]@{sheet=$sheet.Name;address=$cell.Address($false,$false);formula=$cell.Formula;value=$cell.Value2;text=$cell.Text} }
    }
  }
  return ,$values
}
function Near($actual, $expected) {
  if ($null -eq $actual -or [Math]::Abs([double]$actual - $expected) -gt 0.00000001) { throw "Expected $expected, observed $actual" }
}
foreach ($file in $run.files) {
  $source = Join-Path $runPath $file.filename
  if ((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLower() -ne $file.sha256) { throw 'Original output hash changed' }
  $extension = [IO.Path]::GetExtension($source)
  if ($extension -notin '.xlsx','.docx','.pptx') { continue }
  $copy = Join-Path $reviewPath $file.filename
  if (Test-Path -LiteralPath $copy) { throw 'Preserve the previous review; use a new evaluation directory' }
  Copy-Item -LiteralPath $source -Destination $copy
  $pdf = [IO.Path]::ChangeExtension($copy, '.pdf')
  $item = [ordered]@{filename=$file.filename; originalSha256=$file.sha256; opened=$false; pdf=[IO.Path]::GetFileName($pdf)}
  $application=$null; $document=$null
  try {
    if ($extension -eq '.xlsx') {
      $application = New-Object -ComObject Excel.Application
      $application.Visible = $false
      $application.DisplayAlerts = $false
      $application.AutomationSecurity = 3
      $document = $application.Workbooks.Open($copy,0,$false)
      $item.opened=$true; $item.officeVersion=$application.Version
      $application.CalculateFullRebuild()
      $item.baseline = FormulaValues $document
      if ($run.caseId -eq 'margin-workbook') {
        $sheet=$document.Worksheets.Item('Margens')
        Near $sheet.Range('B4').Value2 1100; Near $sheet.Range('C4').Value2 690
        Near $sheet.Range('D4').Value2 410; Near $sheet.Range('E4').Value2 (410/1100)
      }
      if ($run.caseId -eq 'orders-consolidation') {
        $formulaResults=@($item.baseline | ForEach-Object {$_.value})
        foreach ($expected in 1700,800,2500) { if ($expected -notin $formulaResults) { throw "Missing recalculated total $expected" } }
      }
      $document.Save()
      # PDF is an explicitly derived preview; original layout and formulas remain intact.
      foreach ($sheet in $document.Worksheets) {
        $sheet.PageSetup.PrintArea=$sheet.UsedRange.Address()
        $sheet.PageSetup.Zoom=$false; $sheet.PageSetup.FitToPagesWide=1; $sheet.PageSetup.FitToPagesTall=1
      }
      $document.ExportAsFixedFormat(0,$pdf)
      if ($run.caseId -eq 'margin-workbook') {
        $sheet=$document.Worksheets.Item('Margens')
        $sheet.Range('B2').Value2=2000; $application.CalculateFullRebuild()
        Near $sheet.Range('B4').Value2 2100; Near $sheet.Range('D4').Value2 1410; Near $sheet.Range('E4').Value2 (1410/2100)
        $item.changedInput = FormulaValues $document
        $sheet.Range('B2').Value2=0; $sheet.Range('B3').Value2=0; $application.CalculateFullRebuild()
        Near $sheet.Range('E4').Value2 0
        $item.zeroRevenue = FormulaValues $document
      }
      if ($run.caseId -eq 'orders-consolidation') {
        $document.Worksheets.Item('Pedidos').Range('C2').Value2=1300
        $application.CalculateFullRebuild()
        $item.changedInput=FormulaValues $document
        $values=@($item.changedInput | ForEach-Object {$_.value})
        foreach ($expected in 1800,800,2600) { if ($expected -notin $values) { throw "Input change did not propagate: $expected" } }
      }
      $item.recalculationPassed=$true
      $document.Close($false); $document=$null
    } elseif ($extension -eq '.docx') {
      $application=New-Object -ComObject Word.Application
      $application.Visible=$false; $application.DisplayAlerts=0; $application.AutomationSecurity=3
      $document=$application.Documents.Open($copy,$false,$true,$false)
      $item.opened=$true; $item.officeVersion=$application.Version
      $document.Repaginate()
      $item.pages=$document.ComputeStatistics(2)
      if ($run.caseId -in 'proposal-document','meeting-minutes' -and $item.pages -gt 2) { throw 'Document exceeded two pages' }
      $document.ExportAsFixedFormat($pdf,17)
      $document.Close(0); $document=$null
    } else {
      $application=New-Object -ComObject PowerPoint.Application
      $application.AutomationSecurity=3
      $document=$application.Presentations.Open($copy,$true,$false,$false)
      $item.opened=$true; $item.officeVersion=$application.Version
      $item.slides=$document.Slides.Count
      if ($item.slides -ne 3) { throw 'Expected exactly three slides' }
      $document.SaveAs($pdf,32)
      $document.Close(); $document=$null
    }
    $item.reviewedCopySha256=(Get-FileHash -LiteralPath $copy -Algorithm SHA256).Hash.ToLower()
    $item.pdfSha256=(Get-FileHash -LiteralPath $pdf -Algorithm SHA256).Hash.ToLower()
  } finally {
    if ($null -ne $document) { try { $document.Close() } catch {} }
    if ($null -ne $application) { $application.Quit(); [Runtime.InteropServices.Marshal]::FinalReleaseComObject($application) | Out-Null }
    [GC]::Collect(); [GC]::WaitForPendingFinalizers()
  }
  $observations.files += $item
}
$json=$observations | ConvertTo-Json -Depth 12
[IO.File]::WriteAllText((Join-Path $reviewPath 'office-observations.json'), $json, [Text.UTF8Encoding]::new($false))
$json
