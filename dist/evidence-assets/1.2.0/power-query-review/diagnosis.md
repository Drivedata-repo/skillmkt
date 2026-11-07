# Auditoria Power Query — consulta literal

## Resumo executivo
Uma consulta revisada estaticamente: 0 críticos, 2 avisos e 1 informativo. Prioridades: explicitar cultura, remover buffer e declarar tipos. Código corrigido em revised.pq.

## Inventário original
Fonte literal #table, sem conector remoto. Source cria três linhas com colunas sem esquema declarado (any); Buffered aplica Table.Buffer; Converted converte Amount com Number.FromText(_) sem cultura explícita e declara type number. Id não tem tipo específico declarado. Não há filtros, junções ou período. RangeStart/RangeEnd e atualização incremental não se aplicam. Grupos e configuração de carga não estão disponíveis no arquivo.

## Críticos
Nenhum identificado neste escopo estático.

## Avisos
1. **Cultura implícita em Converted:** textos com vírgula podem ser interpretados incorretamente ou gerar erro conforme a cultura do ambiente. Correção: Number.FromText(_, "pt-BR"), preservando null explicitamente com if _ = null then null. Erros futuros de conversão permanecem visíveis, sem substituição silenciosa por null.
2. **Buffer sem justificativa em Buffered:** não há reutilização ou necessidade demonstrada de materialização nesta tabela literal. Table.Buffer foi removido e a transformação referencia diretamente Fonte. Não foi medido ganho de tempo ou memória.

## Informativos
1. **Tipos e nomes:** fonte declara Id = Int64.Type e Amount = nullable text. A transformação declara type nullable number. Etapas renomeadas para Fonte e ValoresConvertidos; nomes de colunas mantidos.

## Comparação esperada
Os três pares Id/Amount foram preservados literalmente na fonte. Apenas a representação dos textos numéricos na saída muda para número.

| Id | Amount na fonte | Amount esperado na saída |
|---|---|---|
| 1 | "10,50" | 10.5 |
| 2 | null | null |
| 3 | "20,00" | 20.0 |

Esperado: 3 linhas, 2 números, 1 null e soma dos não nulos 30.5 (30,5). Nenhuma linha foi filtrada, nenhum identificador foi alterado e null não foi substituído por zero. Não se afirma equivalência com a saída executada do original, cuja cultura era implícita.

## Verificações e limites
Os dois arquivos foram gravados e reabertos em UTF-8 com o módulo fs do Node. Uma conferência independente em JavaScript comparou os pares literais dos arquivos e calculou os valores esperados 10.5, null e 20.0, com soma 30.5. Essa conferência não executa nem valida a semântica do motor M.

A execução no motor M, a atualização e o query folding NÃO foram testados aqui. Esta fonte literal não tem folding remoto a comprovar nem desempenho remoto a comparar. Remover o buffer não demonstra folding restaurado. Não foram introduzidos rede, banco de dados ou credenciais.

Para validar posteriormente no Power Query, executar revised.pq e conferir contagem, tipos, valores, null e soma acima. Esta entrega é código com revisão estática, sem benchmark nem homologação integral da skill.
