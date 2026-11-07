# Diagnóstico da revisão DAX

A fórmula original soma a receita das linhas visíveis de Sales com SUMX e calcula a margem dividindo o lucro agregado pela receita agregada. O total é uma razão entre agregados, não uma média das margens dos produtos.

## Proposta e diferenças semânticas

SUM(Sales[Revenue]) expressa diretamente a soma da coluna numérica aditiva. As variáveis Receita, Custo e Lucro explicitam a regra e a reutilização da receita. VAR e menor tamanho de fórmula não demonstram ganho de desempenho.

DIVIDE substitui / para retornar BLANK quando a receita é zero ou BLANK, sem resultado alternativo explícito. Essa mudança é intencional: o operador original não garante o mesmo tratamento seguro de divisão por zero. Não se afirma equivalência integral.

## Conferência aritmética local

Os dados de sales.json foram lidos e conferidos em Node.js: receita total 1100, custo total 690, lucro 410. Para receita positiva, ambas as expressões aritméticas têm os resultados esperados abaixo. Não houve execução DAX.

| Contexto de filtro | Receita | Custo | Lucro | Margem esperada |
|---|---:|---:|---:|---:|
| Total | 1100 | 690 | 410 | 410/1100 = 0,372727… |
| Produto A | 1000 | 600 | 400 | 0,4 |
| Produto B | 100 | 90 | 10 | 0,1 |
| Seleção múltipla A e B | 1100 | 690 | 410 | 410/1100 |
| Produto A e receita maior que 500 | 1000 | 600 | 400 | 0,4 |
| Produto B e receita maior que 500 | Sem linhas | Sem linhas | Sem linhas | BLANK esperado |

A média simples das margens seria 0,25 e mudaria o total; não foi adotada. As linhas por produto representam filtros de um visual, não contexto de linha de coluna calculada. Os filtros combinados acima são expectativas derivadas das mesmas duas linhas sintéticas.

Os dados não contêm receita zero nem nulos. Como caso adicional hipotético, receita 0 e custo 10 dão lucro -10 e margem proposta BLANK. Receita e custo zero também devem retornar BLANK. Na ausência de linhas ou com receita agregada BLANK, espera-se BLANK pela definição de DIVIDE. Não se converte ausência em zero. São expectativas da semântica DAX, não resultados de execução no motor. Custos BLANK e outras combinações nulas exigem validação no modelo.

## Limites e testes pendentes

Não foram fornecidos modelo, relações ou calendário. As medidas não removem filtros nem acrescentam lógica temporal. A propagação de filtros por relações, relações inativas, períodos selecionados e datas sem vendas não foi validada. A conferência em Node.js verifica aritmética, sem reproduzir o mecanismo completo de contexto DAX.

Antes de substituir no modelo, comparar original e proposta em linhas, total, filtros múltiplos e combinados, ausência de dados, BLANK, receita zero, relações e calendário. Registrar separadamente a diferença intencional na divisão por zero. Para investigar desempenho, medir consultas equivalentes com os mesmos dados e filtros, repetições e cache frio e quente separados, registrando tempos e resultados.

Esta entrega é uma proposta de legibilidade e divisão segura. Não houve medição de velocidade, execução em motor DAX, validação em modelo ativo ou homologação integral da skill. Os entregáveis foram reabertos em UTF-8 com o módulo fs do Node.js após a gravação.
