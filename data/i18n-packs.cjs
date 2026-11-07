"use strict";
const L = (pt, en, es) => ({ pt, en, es });
module.exports = {
  common: {
    installTitle: L(
      "Usar as skills do pacote",
      "Use the skills in this pack",
      "Usar las skills del paquete",
    ),
    install: L(
      "Extraia os ZIPs de SKILLS/ e leia o COMO-USAR.md de cada um. Instale apenas as skills necessárias em um assistente compatível, preservando cópias existentes, e confirme ferramentas e permissões. Depois execute as etapas abaixo em ordem, começando pela amostra fictícia. Cada saída precisa ser conferida antes da próxima etapa.",
      "Extract the ZIPs in SKILLS/ and read each COMO-USAR.md. Install only the needed skills in a compatible assistant, preserving existing copies, and confirm tools and permissions. Then follow the steps below in order, starting with the fictional sample. Check each output before continuing to the next step.",
      "Extrae los ZIP de SKILLS/ y lee el COMO-USAR.md de cada uno. Instala solo las skills necesarias en un asistente compatible, conservando copias existentes, y confirma herramientas y permisos. Después sigue las etapas en orden, empezando por la muestra ficticia. Comprueba cada salida antes de continuar.",
    ),
    notice: L(
      "Dados fictícios e resultado matemático de referência, verificados por script local. Não são uma execução de IA nem uma entrega validada no Excel ou Power BI.",
      "Fictional data and a mathematical reference result, verified by a local script. These are not an AI execution or a deliverable validated in Excel or Power BI.",
      "Datos ficticios y resultado matemático de referencia, verificados mediante un script local. No son una ejecución de IA ni una entrega validada en Excel o Power BI.",
    ),
    rights: L(
      "Curadoria e roteiro da DriveData. As skills mantêm autoria, licenças e termos de suas origens; acesso gratuito à demo não concede direitos de redistribuição comercial.",
      "Curation and workflow by DriveData. Skills retain their original authorship, licenses and terms; free demo access grants no commercial redistribution rights.",
      "Selección y recorrido de DriveData. Las skills conservan autoría, licencias y condiciones originales; el acceso gratuito a la demo no concede derechos de redistribución comercial.",
    ),
    originalLanguage: L(
      "Os roteiros e exemplos seguem o idioma escolhido. Os ZIPs das skills permanecem na redação original, com conteúdo em mais de um idioma.",
      "Guides and examples follow the selected language. Skill ZIPs remain in their original wording, with content in more than one language.",
      "Las guías y ejemplos usan el idioma elegido. Los ZIP de las skills conservan su redacción original, con contenido en varios idiomas.",
    ),
    overview: L("Roteiro do pacote", "Pack workflow", "Recorrido del paquete"),
    requirements: L(
      "Prepare o ambiente",
      "Prepare your environment",
      "Prepara el entorno",
    ),
    limits: L(
      "Limites da entrega",
      "Delivery boundaries",
      "Límites de la entrega",
    ),
    steps: L("Etapas de trabalho", "Working steps", "Etapas de trabajo"),
    input: L("Entrada", "Input", "Entrada"),
    output: L("Saída a produzir", "Output to produce", "Salida que producir"),
    prompt: L("Pedido copiável", "Copyable request", "Solicitud copiable"),
    checks: L(
      "Checklist de aceite",
      "Acceptance checklist",
      "Lista de aceptación",
    ),
    verify: L(
      "Verifique a referência",
      "Verify the reference",
      "Verifica la referencia",
    ),
    verifyInstruction: L(
      "Na raiz extraída, execute node verify.cjs. O script lê apenas os arquivos da amostra, calcula a referência e confere reference.json. Não chama IA, não instala ferramentas e não valida o seu arquivo Excel ou Power BI.",
      "From the extracted root, run node verify.cjs. The script only reads sample files, calculates the reference and checks reference.json. It calls no AI, installs no tools and does not validate your Excel or Power BI file.",
      "Desde la raíz extraída, ejecuta node verify.cjs. El script solo lee los archivos de muestra, calcula la referencia y comprueba reference.json. No llama a IA, instala herramientas ni valida tu archivo Excel o Power BI.",
    ),
    verifySuccess: L(
      "Referência conferida. Nenhuma IA ou ferramenta Office/Power BI foi executada.",
      "Reference verified. No AI or Office/Power BI tool was executed.",
      "Referencia verificada. No se ejecutó ninguna IA ni herramienta Office/Power BI.",
    ),
    duplicate: L(
      "Remova somente duplicatas exatas da chave order_id + line_id; se a mesma chave tiver valores diferentes, interrompa e relate conflito.",
      "Remove only exact duplicates of order_id + line_id; if the same key has different values, stop and report a conflict.",
      "Elimina solo duplicados exactos de order_id + line_id; si la misma clave tiene valores diferentes, detente e informa del conflicto.",
    ),
    notFound: L(
      "Pacote não encontrado.",
      "Pack not found.",
      "Paquete no encontrado.",
    ),
    invalid: L(
      "Parâmetros de pacote inválidos.",
      "Invalid pack parameters.",
      "Parámetros de paquete no válidos.",
    ),
    unavailable: L(
      "O pacote está temporariamente indisponível. Tente novamente mais tarde.",
      "The pack is temporarily unavailable. Please try again later.",
      "El paquete no está disponible temporalmente. Inténtalo más tarde.",
    ),
    products: [
      L("Caderno", "Notebook", "Cuaderno"),
      L("Caneta", "Pen", "Bolígrafo"),
      L("Pasta", "Folder", "Carpeta"),
    ],
    categories: [
      L("Serviços", "Services", "Servicios"),
      L("Produtos", "Products", "Productos"),
    ],
  },
  sheets: {
    title: L(
      "Planilhas confiáveis",
      "Reliable spreadsheets",
      "Hojas de cálculo fiables",
    ),
    tagline: L(
      "Da linha duplicada ao total que você consegue conferir.",
      "From duplicate rows to totals you can verify.",
      "De la fila duplicada al total que puedes comprobar.",
    ),
    description: L(
      "Um percurso de três skills para organizar uma base, montar cálculos rastreáveis e documentar o que foi conferido. Comece com pedidos fictícios; depois adapte as regras aos seus próprios arquivos.",
      "A three-skill workflow to organize a dataset, build traceable calculations and document what was checked. Start with fictional orders, then adapt the rules to your own files.",
      "Un recorrido de tres skills para organizar una base, crear cálculos rastreables y documentar lo comprobado. Empieza con pedidos ficticios y adapta después las reglas a tus archivos.",
    ),
    audience: L(
      "Quem prepara planilhas operacionais e precisa explicar de onde vieram os totais.",
      "People preparing operational spreadsheets who need to explain where totals came from.",
      "Personas que preparan hojas operativas y necesitan explicar de dónde salen los totales.",
    ),
    outcome: L(
      "Roteiro para produzir uma base limpa, um XLSX com fórmulas e uma nota de conferência; a execução e o aceite acontecem no seu ambiente.",
      "A guide for producing a clean dataset, an XLSX with formulas and a verification note; execution and acceptance happen in your environment.",
      "Una guía para producir una base limpia, un XLSX con fórmulas y una nota de comprobación; la ejecución y aceptación ocurren en tu entorno.",
    ),
    requirements: [
      L(
        "Assistente que leia as skills e arquivos locais; importar instruções não instala ferramentas.",
        "An assistant that can read skills and local files; importing instructions installs no tools.",
        "Un asistente que pueda leer skills y archivos locales; importar instrucciones no instala herramientas.",
      ),
      L(
        "Excel com Power Query ou ambiente M compatível para executar a transformação.",
        "Excel with Power Query or a compatible M environment to run the transformation.",
        "Excel con Power Query o un entorno M compatible para ejecutar la transformación.",
      ),
      L(
        "Ferramenta compatível com XLSX e motor de recálculo; Word/LibreOffice ou equivalente para conferir o documento final. Node.js é opcional para o verificador da referência.",
        "An XLSX-compatible tool and recalculation engine; Word/LibreOffice or equivalent to inspect the final document. Node.js is optional for the reference verifier.",
        "Una herramienta compatible con XLSX y un motor de recálculo; Word/LibreOffice o equivalente para comprobar el documento final. Node.js es opcional para verificar la referencia.",
      ),
    ],
    limitations: [
      L(
        "O download contém instruções, dados e referência; não contém uma planilha de produção já executada.",
        "The download contains instructions, data and a reference; it does not contain an already executed production spreadsheet.",
        "La descarga contiene instrucciones, datos y referencia; no contiene una hoja de producción ya ejecutada.",
      ),
      L(
        "A regra de duplicidade vale para esta amostra. Dados reais exigem confirmação de chave, moeda, impostos e arredondamento.",
        "The duplicate rule applies to this sample. Real data requires confirmation of keys, currency, taxes and rounding.",
        "La regla de duplicados corresponde a esta muestra. Los datos reales requieren confirmar claves, moneda, impuestos y redondeo.",
      ),
      L(
        "Salvar XLSX não comprova recálculo. Não declare conferência visual se não abriu ou renderizou o resultado.",
        "Saving an XLSX does not prove recalculation. Do not claim visual verification without opening or rendering the result.",
        "Guardar un XLSX no demuestra recálculo. No declares comprobación visual sin abrir o renderizar el resultado.",
      ),
    ],
    steps: [
      {
        title: L(
          "Organizar sem apagar diferenças",
          "Organize without hiding differences",
          "Organizar sin ocultar diferencias",
        ),
        input: L(
          "sample/orders.csv; chave composta order_id + line_id.",
          "sample/orders.csv; composite key order_id + line_id.",
          "sample/orders.csv; clave compuesta order_id + line_id.",
        ),
        output: L(
          "Consulta M proposta, tabela limpa e registro da duplicata removida.",
          "A proposed M query, clean table and a record of the removed duplicate.",
          "Consulta M propuesta, tabla limpia y registro del duplicado eliminado.",
        ),
        prompt: L(
          "Use claude-power-query-best-practices para ler sample/orders.csv. A chave é order_id + line_id. Remova apenas a repetição exata; uma chave com conteúdo divergente deve virar conflito explícito, nunca descarte silencioso. Preserve IDs, tipos e valores. Proponha uma consulta M com etapas nomeadas e confira contagem antes/depois. Não acrescente impostos ou moeda. Informe se a consulta foi apenas escrita ou realmente atualizada em um ambiente compatível.",
          "Use claude-power-query-best-practices to read sample/orders.csv. The key is order_id + line_id. Remove only the exact repetition; a key with conflicting content must become an explicit conflict, never a silent deletion. Preserve IDs, types and values. Propose an M query with named steps and check counts before and after. Add no taxes or currency. State whether the query was only written or actually refreshed in a compatible environment.",
          "Usa claude-power-query-best-practices para leer sample/orders.csv. La clave es order_id + line_id. Elimina solo la repetición exacta; una clave con contenido diferente debe señalarse como conflicto, nunca descartarse silenciosamente. Conserva IDs, tipos y valores. Propón una consulta M con pasos nombrados y comprueba cantidades antes y después. No añadas impuestos ni moneda. Indica si la consulta solo se escribió o se actualizó realmente en un entorno compatible.",
        ),
        checks: [
          L(
            "6 linhas de entrada, 5 linhas únicas e 1 duplicata exata removida.",
            "6 input rows, 5 unique rows and 1 exact duplicate removed.",
            "6 filas de entrada, 5 únicas y 1 duplicado exacto eliminado.",
          ),
          L(
            "Conflitos de chave devem interromper a transformação proposta.",
            "Key conflicts must stop the proposed transformation.",
            "Los conflictos de clave deben detener la transformación propuesta.",
          ),
        ],
      },
      {
        title: L(
          "Calcular com fórmulas conferíveis",
          "Calculate with verifiable formulas",
          "Calcular con fórmulas comprobables",
        ),
        input: L(
          "Tabela limpa da etapa anterior e sample/reference.json.",
          "Clean table from the previous step and sample/reference.json.",
          "Tabla limpia de la etapa anterior y sample/reference.json.",
        ),
        output: L(
          "XLSX a produzir com entradas separadas, total por linha e resumo por pedido.",
          "An XLSX to produce with separate inputs, line totals and an order summary.",
          "XLSX por producir con entradas separadas, total por fila y resumen por pedido.",
        ),
        prompt: L(
          "Use claude-xlsx sobre a tabela limpa da primeira etapa. Crie total por linha como quantity * unit_price e um resumo por order_id, mantendo fórmulas em vez de totais digitados. Compare o total geral com 330 e os pedidos com a referência fornecida. Identifique o motor de recálculo, confira erros de fórmula e teste uma mudança de quantidade em uma cópia. Preserve o original e relate recálculo ou compatibilidade ainda não verificados.",
          "Use claude-xlsx on the clean table from the first step. Create each line total as quantity * unit_price and a summary by order_id, keeping formulas rather than typed totals. Compare the grand total with 330 and orders with the supplied reference. Identify the recalculation engine, check formula errors and test a quantity change in a copy. Preserve the original and report any recalculation or compatibility not yet verified.",
          "Usa claude-xlsx sobre la tabla limpia de la primera etapa. Crea el total por fila como quantity * unit_price y un resumen por order_id, conservando fórmulas en lugar de totales escritos. Compara el total general con 330 y los pedidos con la referencia. Identifica el motor de recálculo, comprueba errores y prueba un cambio de cantidad en una copia. Conserva el original e informa de cualquier recálculo o compatibilidad todavía no verificados.",
        ),
        checks: [
          L(
            "Totais por pedido: 160, 80, 40 e 50; total geral 330.",
            "Order totals: 160, 80, 40 and 50; grand total 330.",
            "Totales por pedido: 160, 80, 40 y 50; total general 330.",
          ),
          L(
            "As fórmulas respondem a uma alteração de entrada após recálculo real.",
            "Formulas respond to an input change after actual recalculation.",
            "Las fórmulas responden a un cambio de entrada tras un recálculo real.",
          ),
        ],
      },
      {
        title: L(
          "Entregar com evidência",
          "Deliver with evidence",
          "Entregar con evidencia",
        ),
        input: L(
          "Planilha produzida, registro de duplicatas e verificações realizadas.",
          "Produced workbook, duplicate log and completed checks.",
          "Hoja producida, registro de duplicados y comprobaciones realizadas.",
        ),
        output: L(
          "Nota de conferência em documento editável, com resultados e pendências separados.",
          "An editable verification note separating results from outstanding checks.",
          "Nota de comprobación editable que separa resultados y pendientes.",
        ),
        prompt: L(
          "Use automacao-documentos-office para preparar uma nota de conferência da planilha produzida. Registre fonte fictícia, regra de chave, duplicata removida e total 330, somente se confirmados no arquivo. Separe arquivo gerado, aberto, renderizado e recalculado. Inclua limitações de compatibilidade e responsável pelo aceite a definir. Use um documento editável, preserve números entre formatos e não escreva que a planilha foi homologada quando houver verificações pendentes.",
          "Use automacao-documentos-office to prepare a verification note for the produced workbook. Record the fictional source, key rule, removed duplicate and total 330 only if confirmed in the file. Separate generated, opened, rendered and recalculated states. Include compatibility limits and an acceptance owner to be defined. Use an editable document, preserve numbers across formats and do not claim the workbook was accepted while checks remain outstanding.",
          "Usa automacao-documentos-office para preparar una nota de comprobación de la hoja producida. Registra fuente ficticia, regla de clave, duplicado eliminado y total 330 solo si están confirmados en el archivo. Separa los estados generado, abierto, renderizado y recalculado. Incluye límites de compatibilidad y responsable de aceptación por definir. Usa un documento editable, conserva números entre formatos y no afirmes homologación si quedan comprobaciones pendientes.",
        ),
        checks: [
          L(
            "Documento e planilha concordam; pendências continuam explícitas.",
            "Document and workbook agree; outstanding checks remain explicit.",
            "Documento y hoja coinciden; los pendientes siguen explícitos.",
          ),
        ],
      },
    ],
    checks: [
      L("Linhas únicas", "Unique rows", "Filas únicas"),
      L(
        "Duplicatas exatas removidas",
        "Exact duplicates removed",
        "Duplicados exactos eliminados",
      ),
      L("Total geral", "Grand total", "Total general"),
    ],
  },
  powerbi: {
    title: L(
      "Power BI sob controle",
      "Power BI under control",
      "Power BI bajo control",
    ),
    tagline: L(
      "Modelo, medidas e documentação na mesma linha de raciocínio.",
      "Model, measures and documentation following the same reasoning.",
      "Modelo, medidas y documentación con el mismo razonamiento.",
    ),
    description: L(
      "Quatro skills para preparar dados, definir medidas, revisar o modelo e registrar sua lógica. A amostra pequena permite conferir receita, custo e margem antes de adaptar o fluxo a um projeto real.",
      "Four skills to prepare data, define measures, review the model and record its logic. The small sample lets you check revenue, cost and margin before adapting the workflow to a real project.",
      "Cuatro skills para preparar datos, definir medidas, revisar el modelo y documentar su lógica. La muestra pequeña permite comprobar ingresos, coste y margen antes de adaptar el flujo a un proyecto real.",
    ),
    audience: L(
      "Analistas e equipes de BI que precisam de um modelo explicável e critérios de conferência.",
      "Analysts and BI teams needing an explainable model and verification criteria.",
      "Analistas y equipos de BI que necesitan un modelo explicable y criterios de comprobación.",
    ),
    outcome: L(
      "Roteiro para produzir um modelo e catálogo de medidas, uma auditoria priorizada e documentação; abertura e testes no Desktop continuam necessários.",
      "A guide for producing a model and measure catalog, a prioritized audit and documentation; opening and testing in Desktop remain necessary.",
      "Guía para producir un modelo y catálogo de medidas, una auditoría priorizada y documentación; siguen siendo necesarias la apertura y las pruebas en Desktop.",
    ),
    requirements: [
      L(
        "Power BI Desktop compatível em Windows e arquivos do projeto acessíveis.",
        "Compatible Power BI Desktop on Windows and accessible project files.",
        "Power BI Desktop compatible en Windows y archivos del proyecto accesibles.",
      ),
      L(
        "Assistente com leitura de arquivos; edição ao vivo exige conector Power BI autorizado, quando utilizado.",
        "An assistant with file access; live editing requires an authorized Power BI connector when used.",
        "Un asistente con acceso a archivos; la edición en vivo exige un conector Power BI autorizado cuando se use.",
      ),
      L(
        "Ferramenta de documentação DOCX e renderização para conferir o resultado. Node.js é opcional para o verificador da referência.",
        "DOCX documentation and rendering tools to inspect the result. Node.js is optional for the reference verifier.",
        "Herramientas DOCX y de renderización para comprobar el resultado. Node.js es opcional para verificar la referencia.",
      ),
    ],
    limitations: [
      L(
        "A amostra não demonstra desempenho, tendência de negócio nem compatibilidade com todo modelo existente.",
        "The sample demonstrates neither performance, business trends nor compatibility with every existing model.",
        "La muestra no demuestra rendimiento, tendencias de negocio ni compatibilidad con todo modelo existente.",
      ),
      L(
        "O ZIP não inclui um PBIX/PBIP executado; contém entradas e critérios para produzir e conferir o projeto.",
        "The ZIP does not include an executed PBIX/PBIP; it contains inputs and criteria for producing and checking the project.",
        "El ZIP no incluye un PBIX/PBIP ejecutado; contiene entradas y criterios para producir y comprobar el proyecto.",
      ),
      L(
        "Regras BPA têm exceções; nenhuma recomendação garante ganho de velocidade. Preserve o projeto original.",
        "BPA rules have exceptions; no recommendation guarantees a speed improvement. Preserve the original project.",
        "Las reglas BPA tienen excepciones; ninguna recomendación garantiza mayor velocidad. Conserva el proyecto original.",
      ),
    ],
    steps: [
      {
        title: L(
          "Preparar a base e a granularidade",
          "Prepare data and granularity",
          "Preparar datos y granularidad",
        ),
        input: L(
          "sample/sales.json, com vendas e categorias fictícias.",
          "sample/sales.json, containing fictional sales and categories.",
          "sample/sales.json, con ventas y categorías ficticias.",
        ),
        output: L(
          "Consultas de vendas e categorias com tipos e chaves conferidos.",
          "Sales and category queries with checked types and keys.",
          "Consultas de ventas y categorías con tipos y claves comprobados.",
        ),
        prompt: L(
          "Use claude-power-query-best-practices para preparar sample/sales.json. Cada sale_id representa uma venda; category_id aponta para uma categoria única. Preserve as quatro vendas e todos os valores. Defina tipos de date, amount e cost e valide chaves antes da relação. Não exclua linhas para fazer o total bater. Descreva etapas M legíveis e o que foi realmente atualizado no Desktop, distinguindo consulta proposta de execução observada.",
          "Use claude-power-query-best-practices to prepare sample/sales.json. Each sale_id represents one sale; category_id points to a unique category. Preserve all four sales and values. Define date, amount and cost types and validate keys before the relationship. Do not delete rows to force totals to match. Describe readable M steps and what was actually refreshed in Desktop, distinguishing a proposed query from observed execution.",
          "Usa claude-power-query-best-practices para preparar sample/sales.json. Cada sale_id representa una venta; category_id apunta a una categoría única. Conserva las cuatro ventas y todos sus valores. Define tipos de date, amount y cost y valida las claves antes de la relación. No elimines filas para cuadrar el total. Describe pasos M legibles y lo actualizado realmente en Desktop, distinguiendo consulta propuesta de ejecución observada.",
        ),
        checks: [
          L(
            "4 sale_id únicos; todas as categorias das vendas existem na dimensão.",
            "4 unique sale_id values; every sales category exists in the dimension.",
            "4 valores sale_id únicos; todas las categorías de ventas existen en la dimensión.",
          ),
        ],
      },
      {
        title: L(
          "Definir medidas e conferir filtros",
          "Define measures and check filters",
          "Definir medidas y comprobar filtros",
        ),
        input: L(
          "Consultas preparadas e sample/reference.json.",
          "Prepared queries and sample/reference.json.",
          "Consultas preparadas y sample/reference.json.",
        ),
        output: L(
          "Modelo com relação categorias 1:N vendas e medidas Sales, Cost, Margin e MarginPct.",
          "A model with a categories 1:N sales relationship and Sales, Cost, Margin and MarginPct measures.",
          "Modelo con relación categorías 1:N ventas y medidas Sales, Cost, Margin y MarginPct.",
        ),
        prompt: L(
          "Use power-bi-modelagem-dax-performance para modelar a amostra. Defina Sales como soma de amount, Cost como soma de cost, Margin = Sales - Cost e MarginPct = DIVIDE(Margin, Sales). Relacione categorias a vendas em 1:N com filtro da dimensão para o fato. Confira total, mês e categoria contra sample/reference.json. Para contexto sem vendas, documente BLANK sem forçar zero. Não estime melhora de desempenho com esta amostra; entregue DAX e evidência dos testes realmente executados.",
          "Use power-bi-modelagem-dax-performance to model the sample. Define Sales as the sum of amount, Cost as the sum of cost, Margin = Sales - Cost and MarginPct = DIVIDE(Margin, Sales). Relate categories to sales as 1:N with filtering from dimension to fact. Check totals, month and category against sample/reference.json. For context without sales, document BLANK without forcing zero. Do not estimate performance gains from this sample; deliver DAX and evidence of tests actually run.",
          "Usa power-bi-modelagem-dax-performance para modelar la muestra. Define Sales como suma de amount, Cost como suma de cost, Margin = Sales - Cost y MarginPct = DIVIDE(Margin, Sales). Relaciona categorías con ventas en 1:N, filtrando de dimensión a hecho. Comprueba total, mes y categoría contra sample/reference.json. Para contexto sin ventas, documenta BLANK sin forzar cero. No estimes mejoras de rendimiento con esta muestra; entrega DAX y evidencia de las pruebas realmente realizadas.",
        ),
        checks: [
          L(
            "Sales 500; Cost 310; Margin 190; MarginPct 0.38.",
            "Sales 500; Cost 310; Margin 190; MarginPct 0.38.",
            "Sales 500; Cost 310; Margin 190; MarginPct 0.38.",
          ),
          L(
            "Margem de janeiro 120 e fevereiro 70; percentuais calculados sobre a receita de cada contexto.",
            "January margin 120 and February margin 70; ratios calculated against revenue in each context.",
            "Margen de enero 120 y febrero 70; porcentajes calculados sobre los ingresos de cada contexto.",
          ),
        ],
      },
      {
        title: L(
          "Auditar com evidência e contexto",
          "Audit with evidence and context",
          "Auditar con evidencia y contexto",
        ),
        input: L(
          "Modelo produzido e regras BPA aplicáveis à versão.",
          "Produced model and BPA rules applicable to its version.",
          "Modelo producido y reglas BPA aplicables a su versión.",
        ),
        output: L(
          "Lista priorizada de achados, exceções e regras não avaliadas.",
          "A prioritized list of findings, exceptions and unevaluated rules.",
          "Lista priorizada de hallazgos, excepciones y reglas no evaluadas.",
        ),
        prompt: L(
          "Use claude-power-bi-best-practices para revisar o modelo da amostra. Registre versão das regras, relações, tipos e medidas. Classifique cada regra como aprovada, achado, exceção justificada ou não avaliada, com localização e evidência. A ausência de métricas Vertipaq não é aprovação de desempenho. Proponha correções pontuais sem aplicá-las automaticamente e preserve os totais de referência. Entregue critérios para confirmar cada correção e não declare o modelo inteiro homologado só pela ausência de alertas.",
          "Use claude-power-bi-best-practices to review the sample model. Record rule version, relationships, types and measures. Classify each rule as passed, finding, justified exception or not evaluated, with location and evidence. Missing Vertipaq metrics do not mean performance approval. Propose targeted corrections without applying them automatically and preserve reference totals. Deliver criteria for checking each correction; do not declare the entire model accepted merely because no alerts were found.",
          "Usa claude-power-bi-best-practices para revisar el modelo de muestra. Registra versión de reglas, relaciones, tipos y medidas. Clasifica cada regla como aprobada, hallazgo, excepción justificada o no evaluada, con ubicación y evidencia. La ausencia de métricas Vertipaq no significa aprobación del rendimiento. Propón correcciones puntuales sin aplicarlas automáticamente y conserva los totales de referencia. Entrega criterios para comprobar cada corrección; no declares todo el modelo homologado solo por no encontrar alertas.",
        ),
        checks: [
          L(
            "Regras sem evidência aparecem como não avaliadas; correções não mudam a definição das medidas.",
            "Rules without evidence appear as not evaluated; corrections do not change measure definitions.",
            "Las reglas sin evidencia figuran como no evaluadas; las correcciones no cambian la definición de las medidas.",
          ),
        ],
      },
      {
        title: L(
          "Documentar o que o modelo faz",
          "Document what the model does",
          "Documentar qué hace el modelo",
        ),
        input: L(
          "Projeto validado até aqui, DAX e registro da auditoria.",
          "Project checked so far, DAX and audit record.",
          "Proyecto comprobado hasta aquí, DAX y registro de auditoría.",
        ),
        output: L(
          "Documento com inventário, relações, catálogo de medidas, evidências e pendências.",
          "A document with inventory, relationships, measure catalog, evidence and outstanding checks.",
          "Documento con inventario, relaciones, catálogo de medidas, evidencias y pendientes.",
        ),
        prompt: L(
          "Use claude-bi-documentation para documentar o projeto produzido. Conte tabelas, colunas, relações e medidas e compare objetos extraídos com documentados. Explique Sales, Cost, Margin e MarginPct e inclua os valores de referência sem apresentá-los como dados reais. Registre testes realizados, regras não avaliadas e limitações. Use identidade visual neutra ou modelo explicitamente autorizado; não reutilize marca da fonte por padrão. Entregue DOCX e informe se houve abertura, renderização e inspeção visual.",
          "Use claude-bi-documentation to document the produced project. Count tables, columns, relationships and measures and compare extracted objects with documented ones. Explain Sales, Cost, Margin and MarginPct and include reference values without presenting them as real data. Record performed tests, unevaluated rules and limitations. Use neutral visual identity or an explicitly authorized template; do not reuse the source brand by default. Deliver a DOCX and state whether it was opened, rendered and visually inspected.",
          "Usa claude-bi-documentation para documentar el proyecto producido. Cuenta tablas, columnas, relaciones y medidas y compara objetos extraídos con documentados. Explica Sales, Cost, Margin y MarginPct e incluye valores de referencia sin presentarlos como datos reales. Registra pruebas realizadas, reglas no evaluadas y limitaciones. Usa identidad visual neutra o plantilla autorizada expresamente; no reutilices la marca original por defecto. Entrega DOCX e indica si se abrió, renderizó e inspeccionó visualmente.",
        ),
        checks: [
          L(
            "Inventário documentado confere com o projeto; pendências e dados fictícios estão identificados.",
            "Documented inventory matches the project; outstanding checks and fictional data are identified.",
            "El inventario documentado coincide con el proyecto; pendientes y datos ficticios están identificados.",
          ),
        ],
      },
    ],
    checks: [
      L("Vendas únicas", "Unique sales", "Ventas únicas"),
      L("Receita total", "Total revenue", "Ingresos totales"),
      L("Custo total", "Total cost", "Coste total"),
      L("Margem total", "Total margin", "Margen total"),
      L("Percentual de margem", "Margin ratio", "Porcentaje de margen"),
    ],
  },
};
