# DriveData Deck: conferência dos dez ensaios

Em 7 de novembro de 2026, os dez cenários limitados produziram 13 arquivos originais, com o Codex CLI lendo a edição 1.2.0 completa de cada skill, incluindo contrato, casos e referências. Os arquivos foram conferidos em uma etapa independente da geração. O modelo não foi identificado nos eventos do executor.

**Conferência técnica: 10 de 10 cenários. Aceite de João: pendente. Homologação integral das 137 skills: não realizada. Demo gratuita mantida.**

Galeria: [abrir os ensaios](https://deck.drivedata.com.br/ensaios/). As descrições estão em português, inglês e espanhol; os arquivos originais são preservados no idioma em que foram produzidos. O ZIP inclui um relatório HTML que pode ser aberto após a extração.

| Ensaio | Arquivos originais | Conferência realizada |
|---|---|---|
| Margem ponderada | margin.xlsx | Excel: oito fórmulas; receita 1100, custo 690, lucro 410 e margem 410/1100. Mudança de entrada e receita zero. |
| Proposta | proposal.docx | Word, uma página; escopo, exclusão, aceite e preço a confirmar. |
| Apresentação | presentation.pptx | PowerPoint, três slides editáveis em 16:9; fatos 20 e 5, sem resultados inventados. |
| Resumo PDF | summary.pdf | Uma página, texto selecionável, três pedidos e total 2500. |
| Ata | minutes.docx | Word, uma página; prazo de Ana em 2026-11-10 e de Bruno a confirmar. |
| Documentação BI | model-documentation.docx e .md | Duas tabelas, seis colunas, três medidas e um relacionamento. Seis páginas finais no Word. |
| Power Query | revised.pq e diagnosis.md | Código gerado executado no Mashup do Excel: três linhas, nulo preservado, 10,5 + 20 = 30,5. |
| DAX | revised.dax e diagnosis.md | Código gerado executado no Power Pivot: total, filtros A/B, mudança de receita, filtro vazio e denominador zero. |
| Protótipo | prototype.html | Navegação, validação, criação, mudança de status e perfis simulados. Desktop e 390px; reinicialização ao recarregar. |
| Consolidação | orders.xlsx | Excel: três pedidos únicos, duas origens de P01, registro da duplicata e fórmulas de 1700 + 800 = 2500. Mudança de entrada atualiza os totais. |

Foram inspecionadas visualmente 16 páginas ou slides renderizados dos arquivos finais, além das duas apresentações do protótipo no navegador. As planilhas originais são preservadas; cópias recalculadas no Excel são entregues separadamente, com identificação e hashes próprios.

## Falhas encontradas e tratadas

- O executor anterior ignorava a seleção do sandbox Windows instalado. A seleção do backend provisionado foi explicitada; pasta restrita, rede desativada e política sem escalonamento foram mantidas.
- A primeira execução de PDF não tinha a biblioteca indicada no Python escolhido. A tentativa seguinte encontrou acesso negado ao interpretador instalado pelo usuário. A execução final usou o Python gerenciado permitido e seu ReportLab, sem alterar permissões ou instalar pacotes.
- A primeira documentação do modelo apresentou quebras inadequadas. A segunda corrigiu as quebras, mas deixou tabelas além da página. A terceira execução recebeu a evidência da revisão e corrigiu as larguras da tabela, da grade e de cada célula. O resultado foi aberto e renderizado novamente no Word, sem desenhos ou texto fora da página.
- A conferência automática foi corrigida para preservar acentos do Python no Windows, distinguir tabela de participantes de compromissos e aceitar `type nullable number` no M. Os critérios de conteúdo não foram reduzidos para aprovar arquivos incorretos.

O histórico resumido das tentativas permanece em `data/deliverable-evidence.json`. Fontes privadas, prompts, scripts produzidos pelo assistente e logs completos ficam em `.local/artifact-evals`, fora do Git e do ZIP público.

## Limites da aprovação

Cada aprovação se refere ao arquivo, ao cenário fictício e à edição identificada por hash. Estes ensaios não testam todos os usos, dados de clientes, instalação automática, descoberta espontânea da skill, conectores remotos ou integração comercial. Os testes de M e DAX usam os motores do Excel local; não homologam Power BI Service, RLS, DirectQuery, folding remoto ou ganho de desempenho. Os diagnósticos originais de M/DAX registram a etapa de geração estática; a execução nos motores ocorreu posteriormente, na revisão independente.

Não foi feita uma comparação controlada com o assistente sem skill. Portanto, os resultados demonstram entregas reais nos cenários testados, sem comprovar ganho causal de qualidade ou produtividade atribuível à skill.

## Reproduzir

1. Disponibilizar os ZIPs privados da edição 1.2.0 em `.local/releases/1.2.0`, sem alterar os hashes.
2. Executar `node scripts/run-deliverable-evals.cjs --execute` ou selecionar um caso com `--case=ID`. O executor cria outra pasta e preserva as tentativas anteriores.
3. Conferir Office com `scripts/review-deliverable-office.ps1 -RunDirectory CAMINHO`, M/DAX com `scripts/review-deliverable-bi.ps1 -RunDirectory CAMINHO` e renderizar PDFs com `python scripts/render-deliverable-review.py CAMINHO`.
4. Inspecionar as páginas e exercitar o HTML no navegador. Registrar somente observações realizadas em `independent-review.json`, vinculadas aos hashes. Não inferir aceite humano.
5. Rodar `--verify-dir=CAMINHO`. `--publish-dir=CAMINHO` exige os critérios e a revisão de publicação aprovados. `npm run build` reconstrói a galeria e o ZIP.

A revisão do proprietário é voluntária e local ao navegador: marcar um ensaio não altera o banco, o selo técnico ou a aprovação de outras pessoas. A exportação da conferência identifica versões e hashes para acompanhar o retorno.

Referências do método: [avaliação de skills com artefatos e critérios](https://developers.openai.com/blog/eval-skills), [modelo Power Pivot no Excel](https://learn.microsoft.com/en-us/office/vba/excel/concepts/about-the-powerpivot-model-object-in-excel), [conexão ADO com o modelo](https://learn.microsoft.com/en-us/office/vba/api/excel.modelconnection.adoconnection).
