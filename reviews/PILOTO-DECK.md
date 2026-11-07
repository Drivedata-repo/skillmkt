# Piloto DriveData Deck — protocolo de duas semanas

**Estado: planejado, ainda não executado.** Este documento não registra participantes recrutados, tarefas realizadas ou resultados. O CSV acompanhante contém somente cabeçalhos. As metas abaixo são critérios propostos de decisão, não desempenho comprovado do produto.

## Pergunta que o piloto deve responder

Uma pessoa consegue escolher um pacote adequado, entender seus pré-requisitos, produzir uma primeira saída conferível e voltar para resolver uma tarefa real? Separar descoberta, download e execução: baixar um ZIP ou executar o verificador da referência não significa concluir a tarefa com a skill.

Escopo: 10–15 participantes, 14 dias a partir de uma data de início a definir, dois pacotes gratuitos e modos **Explore** e **Work**. A demo continua protegida por senha. Sem cobrança, recrutamento automático, mensagens enviadas ou acompanhamento agendado por este plano.

## Preparação antes de começar

1. Definir responsável pelo piloto, observador, data inicial, local restrito dos registros e data de revisão dos dados coletados.
2. Conferir a versão implantada e registrar o identificador do piloto. As receitas atuais são packs 1.0.0 com skills 1.2.0; registrar a versão efetivamente usada caso ela mude.
3. Confirmar acesso à demo e aos dois modos. Preparar um roteiro de ajuda igual para todos, sem revelar antecipadamente qual carta escolher.
4. Confirmar o ambiente de cada participante: assistente compatível, leitura de arquivos, Excel/Power Query ou Power BI Desktop, e ferramenta necessária para conferir a saída. Distinguir falta de ferramenta de defeito do Deck.
5. Explicar o registro e obter concordância antes da observação. Usar código pseudônimo; não guardar nome, email, senha, token, conversa privada ou base de cliente no CSV.
6. Escolher uma tarefa real pequena, autorizada e delimitada. Preferir uma cópia sem dados pessoais; não alterar produção. Antes da execução, escrever critério de aceite e o responsável por conferi-lo.

O piloto começa com a amostra fictícia. Não exigir envio de documentos confidenciais ao observador ou a um provedor de IA sem autorização aplicável. O participante pode parar, retirar um material ou relatar apenas a limitação.

## Composição e ordem das experiências

Buscar variedade de familiaridade com ferramentas, sem pretender representatividade estatística. Para Planilhas confiáveis, incluir pessoas que trabalham com dados operacionais; para Power BI sob controle, incluir usuários capazes de abrir e conferir o projeto no Desktop. Quem não tem o ambiente pode avaliar descoberta e pré-requisitos, mas sua execução deve ser marcada como bloqueada por ambiente, sem excluí-la silenciosamente do funil.

Cada participante escolhe **um pacote principal** compatível com sua necessidade. O outro pacote pode ser explorado, mas não é obrigatório executá-lo. Todos experimentam os dois modos em ordem alternada, sem executar duas vezes a mesma tarefa apenas para inflar atividade.

| Grupo proposto | Pacote principal | Primeiro modo | Com 10 participantes | Com 15 participantes |
| --- | --- | --- | ---: | ---: |
| A | Planilhas confiáveis | Explore | 3 | 4 |
| B | Planilhas confiáveis | Work | 2 | 4 |
| C | Power BI sob controle | Explore | 2 | 4 |
| D | Power BI sob controle | Work | 3 | 3 |

Para 11–14 participantes, distribuir as vagas adicionais alternando os grupos, considerando compatibilidade. Essas quantidades são alocação planejada, não pessoas existentes. Registrar a ordem real e qualquer mudança. Comparações entre modos serão descritivas: amostra pequena, familiaridade e ordem influenciam o resultado.

## Agenda relativa

| Período | Atividade | Evidência mínima |
| --- | --- | --- |
| Dias 1–2 | Entrada, contexto, descoberta no primeiro modo e inspeção do outro modo | Necessidade descrita, escolha, entendimento dos requisitos e tempo até a escolha |
| Dias 2–5 | Executar a amostra do pacote principal | Arquivo produzido ou bloqueio explícito; critérios conferidos e ferramentas realmente usadas |
| Dias 6–10 | Aplicar o roteiro a uma tarefa real delimitada | Critério definido antes da execução, saída local e registro de verificação |
| Dias 11–14 | Retorno independente e conversa final | Nova sessão, retomada ou nova tarefa, ajuda necessária e motivo para continuar ou abandonar |

Retorno independente significa uma nova sessão após a primeira execução, sem condução passo a passo do observador. Uma conversa final agendada isoladamente não conta como retorno ao produto. Lembretes, se usados pela equipe, devem ser anotados; o plano não dispara nenhum.

## Roteiro de observação

### 1. Descobrir e escolher

Apresentar: “Encontre um caminho para resolver esta necessidade. Mostre o que espera receber, o que precisa ter instalado e como saberia se deu certo.” O observador registra o primeiro modo, dúvidas, escolha e ajuda. Depois, pedir que a pessoa encontre o mesmo caminho no outro modo e explique a diferença percebida.

Não corrigir imediatamente uma escolha. Perguntar o motivo; se ela levar a operação inadequada ou fora da autorização, interromper essa operação e registrar a barreira. Medir tempo desde o início da exploração até a pessoa justificar uma escolha, excluindo pausas declaradas.

Para esta fase, registrar previamente dois critérios: explicar a adequação do pacote e identificar seus pré-requisitos. Usar `output_status=accepted` somente se ambos forem atendidos, `criteria_total=2`, `criteria_passed=2` e `artifact_verified=not_applicable`. A métrica de escolha sem ajuda usa também `help_count=0`; essa aceitação de descoberta não equivale a aceitar um artefato.

### 2. Amostra fictícia

Usar as entradas do ZIP e seguir as etapas na ordem. Instalação, uso de assistente e produção do artefato são ações distintas. A pessoa deve localizar o roteiro, entender que os ZIPs internos preservam idiomas e autoria originais e indicar quais ferramentas realmente executaram cada etapa.

**Planilhas confiáveis:** conferir 6 linhas de entrada, 5 únicas, 1 duplicata exata removida e total 330. A chave é `order_id + line_id`; valor divergente na mesma chave deve ser conflito. Produzir e conferir fórmulas no XLSX, testar mudança de quantidade em cópia e registrar recálculo real. A nota final deve separar gerado, aberto, renderizado e recalculado.

**Power BI sob controle:** conferir 4 vendas, receita 500, custo 310, margem 190 e percentual 0.38. Janeiro tem margem 120 e fevereiro 70. Conferir filtro por mês e categoria, relação da dimensão para o fato, medidas e ausência de dados. A auditoria distingue achado, aprovado, exceção e não avaliado; a documentação deve corresponder ao modelo produzido.

`node verify.cjs` confirma somente a referência matemática local. Registrar essa execução como verificação da referência, nunca como prova de que a IA produziu o arquivo correto ou de que Excel/Power BI foi validado.

### 3. Tarefa real

Antes de começar, registrar uma frase sobre a tarefa sem dados identificáveis e de 2 a 5 critérios objetivos. Exemplos de formato: “preservar todas as chaves válidas”, “reconciliar o total com a fonte”, “manter filtros existentes”. Esses critérios precisam refletir o caso real; os valores da amostra não se tornam metas do cliente.

Usar cópia recuperável. Registrar a saída, a ferramenta que abriu/recalculou/renderizou e a verificação feita pelo participante ou revisor. Se faltar ambiente, autorização ou dado, manter o bloqueio explícito. Não classificar arquivo apenas gerado como aceito.

### 4. Retornar e avaliar

Pedir que a pessoa retome o trabalho no modo que escolher, localize a etapa seguinte e explique o que faria sem ajuda. No encerramento, perguntar: “O que você conseguiu verificar?”, “Onde precisou de ajuda?”, “O que impediria usar novamente?” e “Que tarefa faria a seguir?”. Registrar intenção declarada separada de retorno observado.

## Registro local e exportação

Usar [piloto-deck-template.csv](piloto-deck-template.csv). **Uma linha representa uma tentativa observada numa fase**, não uma pessoa inteira. Reutilizar `participant_code` e criar `attempt_id` único; uma nova tentativa não deve substituir o registro de falha anterior. Não preencher linhas fictícias como se fossem observações.

1. Copiar o template para `.local/pilots/<pilot_id>/registro.csv`, em armazenamento restrito da equipe. Este diretório é uma sugestão de organização, não um destino já criado pelo protocolo.
2. Registrar os campos durante ou logo após cada tentativa. Deixar vazio o que não foi observado; não converter ausência em zero, falha ou sucesso.
3. Evidências locais ficam em `evidence/<attempt_id>/`, quando autorizadas. No CSV, usar somente referência relativa sem nome de cliente ou arquivo confidencial. Para circulação, exportar cópia redigida; a base real permanece no ambiente do participante.
4. Salvar CSV UTF-8, delimitado por vírgula, com aspas em campos que tenham vírgula ou quebra de linha. No Excel, importar por **Dados → De Texto/CSV**, preservando IDs como texto. Tratar texto iniciado por `=`, `+`, `-` ou `@` como literal, nunca fórmula executável.
5. Conferir quantidade de linhas, unicidade de `attempt_id`, datas, códigos e presença de versão. Guardar exportações datadas; não sobrescrever o histórico sem cópia.
6. Consolidar contagens a partir do CSV. O protocolo usa registro manual e não pressupõe telemetria, exportação automática ou integração de pesquisa já implementadas no app.

### Dicionário do CSV

| Campo(s) | Regra de preenchimento |
| --- | --- |
| `pilot_id`, `participant_code`, `attempt_id` | Identificadores locais sem nome/email; tentativa é única no piloto. |
| `recorded_at`, `started_at`, `ended_at` | ISO 8601 com fuso, por exemplo no formato `AAAA-MM-DDThh:mm:ss-03:00`; preencher somente horários observados. |
| `locale` | `pt`, `en` ou `es`, conforme interface usada. |
| `experience_level` | `beginner`, `intermediate` ou `advanced`, autodeclarado. |
| `pack_id` | `planilhas-confiaveis` ou `power-bi-sob-controle`. |
| `pack_version`, `skills_version`, `app_version` | Versões efetivas; usar commit ou identificador verificável do app, não “última”. |
| `first_mode`, `mode_used` | `explore` ou `work`; primeiro modo é fixo por participante, modo usado pertence à tentativa. |
| `phase` | `discovery`, `sample`, `real_task` ou `return`. |
| `environment_status` | `ready`, `partial`, `unavailable` ou `not_checked`. |
| `task_summary_redacted`, `acceptance_criteria_before` | Descrição sem dados pessoais e critérios definidos antes da tentativa. |
| `active_minutes` | Minutos de atividade observada, descontando pausas; usar ponto decimal no CSV e deixar vazio quando não medido. |
| `help_count` | Número de intervenções do observador; 0 somente quando observada ausência de ajuda. |
| `output_status` | `not_started`, `generated`, `checked`, `accepted` ou `blocked`. `accepted` exige conferência dos critérios aplicáveis. |
| `criteria_total`, `criteria_passed` | Inteiros, critérios aplicáveis à tentativa; `criteria_passed <= criteria_total`. Não misturar critérios da referência e do artefato. |
| `reference_verifier` | `passed`, `failed` ou `not_run`; não substitui `artifact_verified`. |
| `artifact_verified` | `yes`, `no` ou `not_applicable`; registrar `yes` somente para a saída produzida efetivamente conferida. |
| `return_type` | `independent`, `prompted`, `interview_only` ou `not_applicable`; preencher em fase `return`. |
| `blocker_category` | `none`, `discovery`, `language`, `environment`, `permissions`, `instructions`, `output_quality`, `download` ou `other`. |
| `evidence_ref`, `next_action`, `notes_redacted` | Referência relativa de evidência, próxima ação e observações sem conteúdo privado. |

Se uma pessoa interromper a participação, registrar isso em `notes_redacted` e encerrar novas observações. A relação entre código e pessoa, se necessária à organização, deve ficar separada do CSV e não integrar o repositório.

## Métricas e critérios propostos

Definir o denominador antes de ler os resultados. Reportar contagem e percentual juntos, por exemplo no formato `x/n`; nenhum número deste protocolo representa observação já obtida. Com amostra pequena, diferenças entre pacotes e modos são sinais para investigação, não demonstração estatística.

| Métrica | Cálculo e recorte | Meta proposta |
| --- | --- | --- |
| Escolha compreendida | Participantes que justificam pacote e pré-requisitos sem ajuda / participantes que iniciaram discovery | Pelo menos 80% |
| Tempo até escolha | Mediana dos minutos ativos até escolha justificada; informar também casos sem conclusão | Mediana até 5 minutos |
| Amostra aceita | Participantes com saída da amostra aceita, artefato verificado e critérios atendidos / participantes com ambiente ready que iniciaram sample | Pelo menos 75%; mostrar também taxa sobre todos que iniciaram sample |
| Transferência para tarefa real | Participantes com saída real aceita e artefato verificado / participantes com ambiente ready que iniciaram real_task | Pelo menos 60%; informar quantos não chegaram a iniciar |
| Retorno independente | Participantes com nova sessão return independent nos dias 6–14 / participantes que iniciaram sample | Pelo menos 50% |
| Conclusão sem ajuda | Tentativas sample ou real_task aceitas com help_count=0 / tentativas dessas fases com ajuda observada e resultado definido | Descrever por pacote e modo; não usar para punir quem relata dúvida |
| Cobertura de ambiente | Participantes ready / participantes que tentaram executar; separar partial e unavailable | Registrar integralmente; bloqueio não é removido do funil |
| Qualidade do registro | Tentativas aceitas com critérios, evidência e versão / todas as tentativas aceitas | 100% |
| Integridade e privacidade | Incidentes confirmados de acesso indevido, exposição de segredo ou corrupção de original | Nenhum incidente aceitável; interromper a operação afetada e investigar |

Para taxas por participante, contar a primeira conclusão de cada fase dentro da janela e não multiplicar sucesso por retries. Para dificuldade operacional, manter todas as tentativas e contabilizar repetições. Comparar Explore e Work dentro do mesmo pacote, anotando ordem, experiência e prontidão; não atribuir causalidade com este desenho.

## Decisão ao final dos 14 dias

- **Avançar com uma nova rodada:** critérios de escolha, amostra, tarefa real e retorno atingidos, registros suficientes e nenhum incidente crítico pendente. Isto autoriza uma decisão de produto pela equipe, não publicação automática.
- **Revisar antes de ampliar:** um ou mais critérios não atingidos. Priorizar barreiras observadas com evidência, preservando distinção entre problema de navegação, requisitos, instrução, ferramenta e qualidade da saída.
- **Resultado inconclusivo:** menos de 10 participantes iniciaram discovery, menos de 5 iniciaram uma tarefa real ou dados insuficientes para os denominadores principais. Não preencher lacunas com intenção de uso; propor nova janela ou escopo menor.
- **Interromper o fluxo afetado:** incidente de acesso, segredo ou alteração indevida. Preservar evidência mínima autorizada e corrigir antes de retomar.

As regras acima são gates de interpretação, não previsão de conversão. Não estimar disposição a pagar ou receita: esta é uma demo gratuita, sem teste de preço.

## Modelo de fechamento a preencher depois

Registrar período real, participantes por pacote/modo, funil `discovery → sample → real_task → return`, `x/n` de cada métrica, medianas com cobertura, três principais barreiras com evidências, mudanças propostas com responsável e decisão da equipe. Separar resultados observados, falas dos participantes e hipóteses. Até a execução, manter todos os resultados como **não medidos**.
