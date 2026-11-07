let
    Fonte = #table(
        type table [Id = Int64.Type, Amount = nullable text],
        {{1, "10,50"}, {2, null}, {3, "20,00"}}
    ),
    // Cultura explicita para a virgula decimal; null permanece null.
    ValoresConvertidos = Table.TransformColumns(
        Fonte,
        {{"Amount", each if _ = null then null else Number.FromText(_, "pt-BR"), type nullable number}}
    )
in
    ValoresConvertidos
