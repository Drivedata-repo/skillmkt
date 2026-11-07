"use strict";
const localized = (pt, en, es) => ({ pt, en, es });
module.exports = [
  {
    slug: "conferir-planilhas",
    kind: "orders",
    pack: "planilhas-confiaveis",
    code: "01",
    content: localized(
      {
        title: "Sua planilha conta o mesmo pedido duas vezes?",
        description:
          "Confira uma amostra de pedidos, separe duplicatas exatas de conflitos e baixe a referência. Demonstração gratuita com cálculo no navegador.",
        intro:
          "Uma linha repetida pode inflar a receita. Mas duas linhas com a mesma chave e valores diferentes pedem revisão, não exclusão automática.",
        outcome:
          "Uma base conferida, com duplicatas identificadas e conflitos separados para revisão.",
        rule: "A chave é pedido + item. Dentro de cada chave, linhas com quantidade e preço idênticos contam uma vez. Se os valores divergem, todo o grupo fica em revisão e fora do total conferido. Valores são calculados em centavos.",
        boundary:
          "Esta regra vale para a amostra. No seu arquivo, confirme a chave, a granularidade e o tratamento de devoluções. Pedidos com vários itens não são duplicatas só por terem o mesmo número.",
        task: "Confira a planilha [anexe uma cópia autorizada]. Primeiro confirme a granularidade e a chave pedido + item. Mostre duplicatas exatas de quantidade e preço sem apagar a fonte. Separe grupos com valores conflitantes para revisão manual e não escolha um valor arbitrário. Entregue a base conferida, a lista de exceções e os totais antes e depois, calculados em centavos. Explique quais registros ficaram fora do total conferido e como validar a conciliação.",
        steps: [
          "Confirme as colunas e a chave de cada linha.",
          "Confira a lista de duplicatas e decida os conflitos.",
          "Reconcilie a quantidade de linhas e os valores antes de substituir a base.",
        ],
        scenarios: [
          "Duplicata exata",
          "Duplicata e conflito de valor",
          "Base sem duplicatas",
        ],
        reference:
          "Na amostra inicial: 5 linhas, receita bruta de 550,00, uma duplicata exata e total conferido de 450,00. A linha repetida representa 100,00.",
      },
      {
        title: "Is your spreadsheet counting the same order twice?",
        description:
          "Check sample orders, separate exact duplicates from conflicts and download the reference. Free demonstration calculated in your browser.",
        intro:
          "A repeated row can inflate revenue. But two rows with the same key and different values need review, not automatic deletion.",
        outcome:
          "A checked dataset with identified duplicates and conflicts set aside for review.",
        rule: "The key is order + item. Within each key, rows with identical quantities and prices count once. If values differ, the entire group goes to review and is excluded from the checked total. Values are calculated in cents.",
        boundary:
          "This rule applies to the sample. In your file, confirm the key, granularity and handling of returns. Orders with several items are not duplicates merely because they share an order number.",
        task: "Check the spreadsheet [attach an authorized copy]. First confirm its granularity and the order + item key. Show exact duplicates of quantity and price without deleting the source. Set groups with conflicting values aside for manual review; do not choose an arbitrary value. Deliver the checked dataset, exception list and before-and-after totals calculated in cents. Explain which records were excluded from the checked total and how to validate the reconciliation.",
        steps: [
          "Confirm the columns and each row's key.",
          "Review the duplicate list and resolve conflicts.",
          "Reconcile row counts and amounts before replacing the dataset.",
        ],
        scenarios: [
          "Exact duplicate",
          "Duplicate and value conflict",
          "Dataset without duplicates",
        ],
        reference:
          "In the initial sample: 5 rows, gross revenue of 550.00, one exact duplicate and a checked total of 450.00. The repeated row accounts for 100.00.",
      },
      {
        title: "¿Tu hoja cuenta el mismo pedido dos veces?",
        description:
          "Comprueba una muestra de pedidos, separa duplicados exactos de conflictos y descarga la referencia. Demostración gratuita calculada en el navegador.",
        intro:
          "Una fila repetida puede inflar los ingresos. Pero dos filas con la misma clave y valores distintos requieren revisión, no eliminación automática.",
        outcome:
          "Una base comprobada, con duplicados identificados y conflictos separados para revisión.",
        rule: "La clave es pedido + artículo. Dentro de cada clave, las filas con cantidad y precio idénticos cuentan una vez. Si los valores difieren, todo el grupo pasa a revisión y queda fuera del total comprobado. Los valores se calculan en céntimos.",
        boundary:
          "Esta regla se aplica a la muestra. En tu archivo, confirma la clave, la granularidad y el tratamiento de devoluciones. Los pedidos con varios artículos no son duplicados solo por compartir número.",
        task: "Comprueba la hoja [adjunta una copia autorizada]. Primero confirma la granularidad y la clave pedido + artículo. Muestra duplicados exactos de cantidad y precio sin borrar la fuente. Separa los grupos con valores conflictivos para revisión manual y no elijas un valor arbitrario. Entrega la base comprobada, la lista de excepciones y los totales antes y después, calculados en céntimos. Explica qué registros quedaron fuera del total comprobado y cómo validar la conciliación.",
        steps: [
          "Confirma las columnas y la clave de cada fila.",
          "Revisa los duplicados y resuelve los conflictos.",
          "Concilia el número de filas y los importes antes de sustituir la base.",
        ],
        scenarios: [
          "Duplicado exacto",
          "Duplicado y conflicto de valor",
          "Base sin duplicados",
        ],
        reference:
          "En la muestra inicial: 5 filas, ingresos brutos de 550,00, un duplicado exacto y total comprobado de 450,00. La fila repetida representa 100,00.",
      },
    ),
  },
  {
    slug: "conciliar-indicadores-power-bi",
    kind: "reconcile",
    pack: "power-bi-sob-controle",
    code: "02",
    content: localized(
      {
        title: "O indicador do Power BI não bate com a fonte?",
        description:
          "Compare fonte e relatório por período, ajuste a tolerância e veja onde o indicador diverge. Exemplo público gratuito com dados fictícios.",
        intro:
          "Antes de mudar uma medida, localize a diferença. Compare a mesma janela, a mesma regra e a mesma unidade — mês por mês.",
        outcome:
          "Uma conciliação por período, com diferenças e uma fila objetiva de investigação.",
        rule: "Diferença = relatório − fonte. Uma linha exige revisão quando o valor absoluto da diferença supera a tolerância informada. A diferença total é a soma das diferenças; a tolerância só altera a classificação, nunca os valores.",
        boundary:
          "Localizar uma diferença não prova sua causa. Filtros, granularidade, relacionamentos, duplicidades e datas de reconhecimento precisam de evidência no modelo real.",
        task: "Concilie [indicador] entre [fonte autorizada] e [relatório Power BI] no período [intervalo], com tolerância [valor]. Confirme unidade, filtros, granularidade e regra de reconhecimento antes de comparar. Entregue uma tabela por período com fonte, relatório e diferença relatório menos fonte. Separe as divergências acima da tolerância, proponha verificações de filtros, relacionamentos e duplicidades e distinga fatos de hipóteses. Não altere medidas sem demonstrar a causa e preservar uma referência para conferir o resultado.",
        steps: [
          "Alinhe período, unidade e filtros da fonte e do relatório.",
          "Localize os períodos que ultrapassam a tolerância.",
          "Investigue a causa com evidências antes de alterar a medida.",
        ],
        scenarios: [
          "Relatório acima da fonte",
          "Relatório abaixo da fonte",
          "Valores conciliados",
        ],
        reference:
          "Com tolerância zero na amostra inicial: fonte de 4.400,00, relatório de 4.650,00 e diferença de +250,00, concentrada em 2026-02.",
      },
      {
        title: "Does your Power BI metric disagree with its source?",
        description:
          "Compare source and report by period, adjust tolerance and locate metric discrepancies. Free public example with fictional data.",
        intro:
          "Before changing a measure, locate the difference. Compare the same window, rule and unit — month by month.",
        outcome:
          "A reconciliation by period, with differences and a clear investigation queue.",
        rule: "Difference = report − source. A row needs review when the absolute difference exceeds the chosen tolerance. The total difference is the sum of differences; tolerance changes only the classification, never the values.",
        boundary:
          "Locating a difference does not prove its cause. Filters, granularity, relationships, duplicates and recognition dates need evidence from the actual model.",
        task: "Reconcile [metric] between [authorized source] and [Power BI report] for [date range], with tolerance [amount]. Confirm units, filters, granularity and recognition rules before comparing. Deliver a table by period with source, report and report-minus-source differences. Separate discrepancies above tolerance, propose checks of filters, relationships and duplicates, and distinguish facts from hypotheses. Do not change measures without demonstrating the cause and preserving a reference against which to verify the result.",
        steps: [
          "Align the source and report's period, unit and filters.",
          "Locate periods that exceed tolerance.",
          "Investigate the cause using evidence before changing the measure.",
        ],
        scenarios: [
          "Report above source",
          "Report below source",
          "Reconciled values",
        ],
        reference:
          "With zero tolerance in the initial sample: source 4,400.00, report 4,650.00 and difference +250.00, concentrated in 2026-02.",
      },
      {
        title: "¿El indicador de Power BI no coincide con la fuente?",
        description:
          "Compara fuente e informe por período, ajusta la tolerancia y localiza divergencias. Ejemplo público gratuito con datos ficticios.",
        intro:
          "Antes de cambiar una medida, localiza la diferencia. Compara la misma ventana, regla y unidad, mes a mes.",
        outcome:
          "Una conciliación por período, con diferencias y una lista concreta de investigación.",
        rule: "Diferencia = informe − fuente. Una fila requiere revisión cuando el valor absoluto de la diferencia supera la tolerancia elegida. La diferencia total es la suma de las diferencias; la tolerancia solo cambia la clasificación, nunca los valores.",
        boundary:
          "Localizar una diferencia no demuestra su causa. Filtros, granularidad, relaciones, duplicados y fechas de reconocimiento requieren evidencias del modelo real.",
        task: "Concilia [indicador] entre [fuente autorizada] e [informe Power BI] para [intervalo], con tolerancia [importe]. Confirma unidad, filtros, granularidad y regla de reconocimiento antes de comparar. Entrega una tabla por período con fuente, informe y diferencia informe menos fuente. Separa las divergencias por encima de la tolerancia, propone comprobaciones de filtros, relaciones y duplicados y distingue hechos de hipótesis. No cambies medidas sin demostrar la causa y conservar una referencia para comprobar el resultado.",
        steps: [
          "Alinea período, unidad y filtros de la fuente y del informe.",
          "Localiza los períodos que superan la tolerancia.",
          "Investiga la causa con evidencias antes de modificar la medida.",
        ],
        scenarios: [
          "Informe por encima de la fuente",
          "Informe por debajo de la fuente",
          "Valores conciliados",
        ],
        reference:
          "Con tolerancia cero en la muestra inicial: fuente de 4.400,00, informe de 4.650,00 y diferencia de +250,00, concentrada en 2026-02.",
      },
    ),
  },
  {
    slug: "revisar-power-bi-lento",
    kind: "performance",
    pack: "power-bi-sob-controle",
    code: "03",
    content: localized(
      {
        title: "Qual visual merece atenção no Power BI lento?",
        description:
          "Ordene uma amostra de medições por duração, identifique a etapa dominante e prepare uma revisão de desempenho baseada em evidências.",
        intro:
          "Sensação de lentidão não aponta a causa. Uma amostra de medições ajuda a escolher o primeiro visual e o componente a investigar.",
        outcome:
          "Uma ordem de investigação por visual e componente, sem prometer otimização antes de medir.",
        rule: "Duração por visual = consulta DAX + exibição + outras etapas. Ordenamos do maior para o menor e identificamos o componente mais demorado. O limite marca quais visuais investigar. A soma dos visuais não é o tempo total de carregamento da página: execuções podem se sobrepor.",
        boundary:
          "Os tempos são fictícios. Este cálculo não executa DAX, não lê um PBIX e não prova a causa da lentidão. Compare medições repetidas com filtros e condições de cache equivalentes antes e depois de qualquer alteração.",
        task: "Revise o desempenho de [relatório Power BI] usando [medições autorizadas por visual]. Separe duração da consulta DAX, exibição e outras etapas; ordene os visuais e identifique o componente dominante. Registre filtros e condições de cache. Para os maiores tempos, proponha uma investigação do modelo, medidas ou desenho visual conforme a evidência disponível. Não apresente a soma de visuais como tempo de carregamento da página. Só afirme melhora após repetir a medição e confirmar que os resultados numéricos foram preservados.",
        steps: [
          "Colete medições por visual em condições comparáveis.",
          "Priorize o visual e o componente com maior duração.",
          "Repita a medição e confira os indicadores após cada mudança.",
        ],
        scenarios: [
          "Consulta DAX dominante",
          "Exibição dominante",
          "Tempos menores",
        ],
        reference:
          "Na amostra inicial, V02 tem duração de 2.500 ms: 1.900 ms de consulta DAX, 400 ms de exibição e 200 ms de outras etapas. É o primeiro visual na fila de investigação.",
      },
      {
        title: "Which visual needs attention in a slow Power BI report?",
        description:
          "Rank sample measurements by duration, identify the dominant component and prepare an evidence-based performance review.",
        intro:
          "A feeling of slowness does not identify the cause. Sample measurements help choose the first visual and component to investigate.",
        outcome:
          "An investigation order by visual and component, without promising optimization before measuring.",
        rule: "Duration per visual = DAX query + display + other steps. We sort from longest to shortest and identify the slowest component. The threshold marks which visuals to investigate. Summed visual durations are not page load time: executions may overlap.",
        boundary:
          "The timings are fictional. This calculation does not execute DAX, read a PBIX file or prove the cause of slowness. Compare repeated measurements with equivalent filters and cache conditions before and after any change.",
        task: "Review the performance of [Power BI report] using [authorized measurements per visual]. Separate DAX query, display and other durations; rank visuals and identify the dominant component. Record filters and cache conditions. For the longest durations, propose an investigation of the model, measures or visual design according to available evidence. Do not present summed visual durations as page load time. Claim improvement only after repeating measurements and confirming that numerical results have been preserved.",
        steps: [
          "Collect measurements per visual under comparable conditions.",
          "Prioritize the visual and component with the longest duration.",
          "Repeat measurements and check metrics after each change.",
        ],
        scenarios: [
          "DAX query dominates",
          "Display dominates",
          "Shorter durations",
        ],
        reference:
          "In the initial sample, V02 takes 2,500 ms: 1,900 ms for the DAX query, 400 ms for display and 200 ms for other steps. It is first in the investigation queue.",
      },
      {
        title: "¿Qué visual necesita atención en un Power BI lento?",
        description:
          "Ordena una muestra de mediciones por duración, identifica el componente dominante y prepara una revisión de rendimiento con evidencias.",
        intro:
          "La sensación de lentitud no identifica la causa. Una muestra de mediciones ayuda a elegir el primer visual y componente que investigar.",
        outcome:
          "Un orden de investigación por visual y componente, sin prometer optimización antes de medir.",
        rule: "Duración por visual = consulta DAX + visualización + otras etapas. Ordenamos de mayor a menor e identificamos el componente más lento. El umbral marca qué visuales investigar. La suma de duraciones no es el tiempo de carga de la página: las ejecuciones pueden solaparse.",
        boundary:
          "Los tiempos son ficticios. Este cálculo no ejecuta DAX, no lee un PBIX ni demuestra la causa de la lentitud. Compara mediciones repetidas con filtros y condiciones de caché equivalentes antes y después de cualquier cambio.",
        task: "Revisa el rendimiento de [informe Power BI] usando [mediciones autorizadas por visual]. Separa la duración de consulta DAX, visualización y otras etapas; ordena los visuales e identifica el componente dominante. Registra filtros y condiciones de caché. Para las mayores duraciones, propone investigar el modelo, las medidas o el diseño visual según la evidencia disponible. No presentes la suma de duraciones como tiempo de carga de la página. Afirma una mejora solo después de repetir las mediciones y confirmar que se preservaron los resultados numéricos.",
        steps: [
          "Recoge mediciones por visual en condiciones comparables.",
          "Prioriza el visual y el componente con mayor duración.",
          "Repite la medición y comprueba los indicadores tras cada cambio.",
        ],
        scenarios: [
          "Predomina la consulta DAX",
          "Predomina la visualización",
          "Duraciones menores",
        ],
        reference:
          "En la muestra inicial, V02 dura 2.500 ms: 1.900 ms de consulta DAX, 400 ms de visualización y 200 ms de otras etapas. Es el primer visual que investigar.",
      },
    ),
  },
];
