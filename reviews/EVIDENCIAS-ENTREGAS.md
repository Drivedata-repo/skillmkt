# Evidências de cenários com arquivos finais

## Estado observado em 7 de novembro de 2026

Foram preparados dez cenários individuais usando as fontes reais dos pacotes 1.2.0. **Nenhum arquivo final desses dez cenários foi produzido pelo assistente neste ambiente.** O cenário de margem foi tentado três vezes; nove cenários não foram executados. Os três ensaios JSON anteriores continuam registrados separadamente em `data/assistant-evidence.json`: não são convertidos em evidência de geração de Office, PDF ou HTML.

O Codex CLI recusou operações de terminal por política, inclusive leitura do CSV fictício. O log privado da terceira tentativa registra `CreateProcess ... rejected: blocked by policy`. A segunda tentativa foi um diagnóstico com code-mode host desligado e falhou de forma fechada; essa alteração foi revertida. Não houve contorno de política, uso de outro executor para os comandos recusados ou novos retries depois da confirmação. Retomar as execuções exige um ambiente autorizado que efetivamente permita criação de arquivos.

`exitCode: 0` do assistente não implica sucesso: nas três tentativas não existia `margin.xlsx`. Os registros públicos indicam `passed: false`, `assistantExecuted: false`, `executionVerified: false` e `fullSkillExecutionVerified: false`. O modelo não foi reportado de forma confiável, portanto permanece `null`.

## Dez cenários e critérios

| Caso | Skill | Arquivo final previsto | Conferência independente | Estado |
|---|---|---|---|---|
| margin-workbook | claude-xlsx | margin.xlsx | Dados, fórmulas, margem ponderada 410/1100 e recálculo no Excel | Bloqueado; 3 tentativas sem arquivo |
| proposal-document | claude-docx | proposal.docx | Escopo, exclusões, aceite, preço pendente e revisão visual | Não executado |
| editable-slides | claude-pptx | presentation.pptx | 3 slides editáveis 16:9, fatos 20/5, revisão visual | Não executado |
| summary-pdf | claude-pdf | summary.pdf | 1 página, texto selecionável, pedidos e total 2500, revisão visual | Não executado |
| meeting-minutes | claude-acta-drivedata | minutes.docx | Ana 2026-11-10; prazo de Bruno pendente; tabela editável; revisão visual | Não executado |
| model-documentation | claude-bi-documentation | model-documentation.docx e .md | Cobertura do BIM fictício: 2 tabelas, 6 colunas, 3 medidas, 1 relacionamento | Não executado |
| power-query-review | claude-power-query-best-practices | revised.pq e diagnosis.md | Cultura pt-BR, nulo preservado, sem Buffer desnecessário; limites do motor | Não executado |
| dax-review | claude-power-bi-dax-optimization | revised.dax e diagnosis.md | SUM, DIVIDE, números esperados e limites de execução/performance | Não executado |
| request-prototype | prototipos-e-especificacao-funcional | prototype.html | Estrutura local, fluxo no navegador e revisão visual | Não executado |
| orders-consolidation | automacao-documentos-office | orders.xlsx | 3 IDs únicos, origens de P01, SUMIF/SUM e recálculo independente | Não executado |

Os dois cenários de código M/DAX produzem arquivos revisáveis, mas **não executam os motores Power Query ou DAX**. Uma eventual aprovação estará limitada à revisão estática e aos números fictícios, sem alegar equivalência geral ou ganho de desempenho. O protótipo não comprova autenticação ou backend. Nenhum cenário comprova integração externa.

## Arquitetura e contrato

- `scripts/run-deliverable-evals.cjs`: entradas fictícias, execução opt-in do assistente, captura privada dos eventos e leitura independente dos formatos finais.
- `data/deliverable-evidence.json`: somente metadados seguros, textos PT/EN/ES, hashes de fonte/pacote, estados e tentativas resumidas. Não contém fonte de skills, prompts privados, credenciais ou caminhos locais.
- `lib/deliverable-evidence.cjs`: `getDeliverableSamples(skill, locale)` retorna apenas casos aprovados com arquivos reais, hashes íntegros e pacote atual. Atualmente retorna `[]` para todas as skills.
- `getDeliverableReadiness(skill, locale)` retorna a preparação correspondente à skill, com `status`, `statusLabel`, `title`, `scope`, `prerequisites`, `checks`, `limitations`, `version`, `attempts`, `finishedAt`, `currentVersion` e `fullSkillExecutionVerified: false`.
- `tests/deliverable-evidence.test.cjs`: cobertura de estados honestos, idiomas, números, privacidade e oráculos com referências e casos negativos. Os exemplos de snapshots nos testes são referências autorais para testar os validadores, não entregas executadas por IA.

Os campos de amostra aprovada são `caseId`, `title`, `scope`, `status`, `statusLabel`, `limitations`, `runtime`, `modelLabel`, `version`, `finishedAt`, `sourceSha256`, `packageSha256`, `checks`, `artifacts`, `passed`, `currentVersion`, `evidenceLanguage`, `executionVerified` e `fullSkillExecutionVerified`. Cada artefato contém `label`, `url`, `filename`, `mimeType` e `sha256`.

## Execução futura, somente após mudança do ambiente

O comando abaixo prepara entradas e lê hashes, sem iniciar um assistente:

```powershell
node scripts/run-deliverable-evals.cjs
```

As dez entradas fictícias já foram materializadas em `.local/artifact-evals/1.2.0/2026-11-07T12-49-09-286Z`. Esses arquivos são preparação autoral e não contam como execução por IA. Os três logs reais ficam nos diretórios de 12:37:53, 12:40:41 e 12:41:38 da mesma raiz. Logs privados nunca são exportados.

Depois de uma mudança externa autorizada, execute um caso antes de ampliar:

```powershell
node scripts/run-deliverable-evals.cjs --execute --case=margin-workbook
```

O runner usa o modelo padrão do ambiente; não substitui o modelo. CLI com `--ephemeral --ignore-user-config -s workspace-write`, apps/plugins desativados, rede do sandbox e pesquisa web desativadas. O ambiente do processo só repassa caminhos de runtime, sistema e autenticação gerenciada do CLI; não repassa variáveis do projeto. O prompt restringe o trabalho à pasta isolada e às entradas fornecidas. Isso não equivale a uma auditoria do sandbox do provedor. Rejeição de política interrompe o lote; os próximos casos não são tentados.

Para conferir arquivos de uma execução real:

```powershell
node scripts/run-deliverable-evals.cjs --verify-dir="D:\CODEX\skillmkt\.local\artifact-evals\1.2.0\<execucao>\<caso>"
```

O verificador reabre XLSX/DOCX/PPTX/PDF com bibliotecas independentes e compara conteúdo e fórmulas. Ele nunca cria o entregável nem executa o código gerador do assistente. Critérios de revisão visual, interação e recálculo não são inferidos de presença de arquivo ou de testes estáticos. Precisam de revisão independente registrada em `independent-review.json`, ligada aos hashes originais:

```json
{
  "outputHashes": {"margin.xlsx": "<sha256 do arquivo original>"},
  "recalc": {
    "passed": true,
    "reviewer": "<responsável pela conferência>",
    "reviewedAt": "<data ISO real>",
    "evidence": "<como o Excel recalculou uma cópia e quais células e valores foram conferidos>"
  },
  "publication": {
    "passed": true,
    "reviewer": "<responsável pela conferência>",
    "reviewedAt": "<data ISO real>",
    "evidence": "<conferência de dados exclusivamente fictícios, metadados e ausência de segredos>"
  }
}
```

Para formatos visuais acrescentar `visual`; para HTML acrescentar `interaction`, com a mesma estrutura de evidência. Nunca preencher esses campos sem realizar a conferência. Recálculo deve usar uma cópia para preservar o hash original do entregável do assistente; registrar células e valores observados. Se o assistente alterar o arquivo após revisão, a revisão anterior não serve.

Exportação só ocorre após todos os critérios e revisão de publicação:

```powershell
node scripts/run-deliverable-evals.cjs --publish-dir="D:\CODEX\skillmkt\.local\artifact-evals\1.2.0\<execucao>\<caso>"
```

A exportação copia apenas os nomes finais explicitamente autorizados para `dist/evidence-assets/<versao>/<caso>/`, preserva hashes e publica metadados seguros. Não exporta geradores, prompts ou logs. O site precisará conservar esses assets no build e incluí-los na função que verifica os arquivos. Até existir uma execução aprovada, a pasta pública não precisa conter arquivos.

Mesmo após aprovação de um cenário, `executionVerified` e `fullSkillExecutionVerified` continuam falsos: o rótulo permitido é **Cenário com entregável conferido**, sem homologação integral da skill.
