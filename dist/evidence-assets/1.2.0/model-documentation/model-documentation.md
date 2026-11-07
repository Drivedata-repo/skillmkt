# Documentação do modelo

AuroraModel | Modelo semântico Power BI

Versão documental 1.0 | 7 de novembro de 2026

Modelo fictício. Documentação estática baseada exclusivamente em model.bim.

Identidade visual neutra, sem marca ou logotipo de cliente. Cores e tipografia adaptadas da referência local.

Cobertura conferida dos objetos presentes no arquivo; comportamento operacional não validado.

# 1. Visão geral e cobertura

| Propriedade | Fato extraído |
| --- | --- |
| Nome | AuroraModel |
| Nível de compatibilidade | 1600 |
| Cultura | pt-BR |
| Entrada | model.bim, arquivo JSON de metadados sintéticos |

## Inventário conferido

| Objeto | Extraído | Documentado |
| --- | --- | --- |
| Tabelas | 2 | 2 |
| Colunas | 6 | 6 |
| Medidas | 3 | 3 |
| Relacionamentos | 1 | 1 |

Origem: /name, /compatibilityLevel, /model/culture, /model/tables e /model/relationships em model.bim. Os caminhos iniciados por / são referências ao JSON.

Seções: visão geral; tabelas e colunas; relacionamento; medidas DAX; padrões, fontes e limites. Não há objetos ilegíveis ou omitidos nas quatro categorias inventariadas.

# 2. Tabelas e colunas

Fatos extraídos: os nomes e tipos abaixo são literais. Descrições, summarizeBy, partições e classificação de cada tabela não estão declarados. O arquivo não comprova uma arquitetura estrela.

## Tabela Sales

Origem: /model/tables/0. Colunas: 4. Medidas: 3.

| Coluna | Tipo declarado | Origem no JSON |
| --- | --- | --- |
| SaleId | int64 | /model/tables/0/columns/0 |
| ProductId | int64 | /model/tables/0/columns/1 |
| Revenue | double | /model/tables/0/columns/2 |
| Cost | double | /model/tables/0/columns/3 |

## Tabela Product

Origem: /model/tables/1. Colunas: 2. Medidas: 0.

| Coluna | Tipo declarado | Origem no JSON |
| --- | --- | --- |
| ProductId | int64 | /model/tables/1/columns/0 |
| ProductName | string | /model/tables/1/columns/1 |

int64, double e string são valores declarados no arquivo. Conteúdo, unicidade, valores nulos e qualidade dos dados não foram verificados.

# 3. Relacionamento

| Propriedade | Valor extraído |
| --- | --- |
| Nome | Sales_Product |
| Extremidade de origem | Sales[ProductId] |
| Extremidade de destino | Product[ProductId] |
| crossFilteringBehavior | oneDirection |
| Origem no JSON | /model/relationships/0 |

## Leitura e limites

O vínculo Sales_Product referencia Sales.ProductId e Product.ProductId, colunas existentes no inventário. O valor literal oneDirection declara filtragem em uma direção.

Cardinalidade, estado ativo e integridade referencial não estão explicitados. Não se afirma uma relação muitos para um nem o sentido operacional da propagação de filtros. A filtragem efetiva não foi testada no Power BI.

# 4. Catálogo de medidas DAX

As três medidas pertencem a Sales. Expressões transcritas sem alteração; as explicações são interpretações estáticas, não resultados de execução.

## TotalRevenue

Tabela: Sales. Origem: /model/tables/0/measures/0. Formato e descrição: não informados.

```dax
SUM(Sales[Revenue])
```

Interpretação estática: A expressão solicita a soma de Sales[Revenue] no contexto de avaliação. Nenhum total foi calculado nesta revisão.

## TotalCost

Tabela: Sales. Origem: /model/tables/0/measures/1. Formato e descrição: não informados.

```dax
SUM(Sales[Cost])
```

Interpretação estática: A expressão solicita a soma de Sales[Cost] no contexto de avaliação. Nenhum custo foi calculado nesta revisão.

## MarginPct

Tabela: Sales. Origem: /model/tables/0/measures/2. Formato e descrição: não informados.

```dax
DIVIDE([TotalRevenue] - [TotalCost], [TotalRevenue])
```

Interpretação estática: A expressão usa DIVIDE para dividir a diferença entre [TotalRevenue] e [TotalCost] por [TotalRevenue]. Pelo texto, depende das duas medidas anteriores. O nome sugere proporção de margem, mas não comprova apresentação percentual ou regra de negócio homologada.

# 5. Padrões, fontes e limites

## Padrões DAX e nomenclatura

Observação do texto: TotalRevenue e TotalCost usam SUM; MarginPct usa DIVIDE e referências a medidas. Os nomes de tabelas, colunas e medidas usam palavras concatenadas com iniciais maiúsculas. Não há convenção formal declarada nem evidência de desempenho.

## Fontes e conteúdo de relatório

model.bim é a fonte documental. O arquivo não informa fontes de dados, conexões, partições, consultas Power Query, modo de armazenamento ou atualização. Não é possível identificar a origem dos dados de Sales ou Product.

Não foram fornecidas definições de páginas, gráficos, visuais personalizados, temas ou marcadores. Sua contagem e seu conteúdo não são verificáveis por esta entrada. Não há definição de funções de segurança (roles) ou RLS no arquivo fornecido; isso não comprova ausência de segurança no ambiente real.

## Verificações realizadas e pendências

Foram conferidos os totais, os seis nomes e tipos de colunas, as três expressões DAX e as extremidades do relacionamento contra o JSON. O DOCX foi salvo e reaberto com python-docx para conferir tabelas e texto; o Markdown usa o mesmo conteúdo documental.

Não ocorreu conexão com Power BI, atualização (refresh), execução de DAX ou validação de RLS. Não houve consulta a serviços externos ou dados reais.

Abertura no Microsoft Word e renderização visual não foram realizadas neste ambiente. Foram aplicadas quebras explícitas de página, linhas de tabela indivisíveis e vínculos entre títulos e conteúdo. A paginação final depende da conferência visual pelo host; não houve homologação integral da skill.
