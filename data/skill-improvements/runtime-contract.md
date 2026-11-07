# Contrato de capacidades Figma / FigQuery — edição 1.2.0

Este contrato descreve requisitos de descoberta. Não implementa um adaptador, não certifica o backend e não garante atomicidade. O nome da skill não cria ferramentas.

## Preflight obrigatório

Registre host, backend, versão ou schema observado, editor (`Design`, `FigJam` ou `Slides`), fileKey, nodeIds e permissões. Para cada capacidade usada, anote ferramenta real, entrada aceita, campos de saída e limitações. Não faça mutação exploratória para descobrir uma API desconhecida.

| Capacidade | Contrato mínimo a confirmar | Quando ausente |
| --- | --- | --- |
| Criar arquivo | plano/editor/nome, retorno file_key e leitura do arquivo | entregar plano não aplicado; não inventar file_key |
| Contexto estático | get_design_context documentado ou metadata + leitura estrutural com IDs, estilos e assets | registrar lacunas; não deduzir que o design foi lido |
| Contexto de movimento | inventário de nós, timing, easing e cobertura/truncamento | implementação de movimento pendente |
| Escrita | use_figma ou equivalente documentado para o editor correto | entregar proposta, não canvas fictício |
| Builder FigQuery | $fig e métodos realmente presentes; distinguir plan node de nó materializado | não executar exemplo do builder |
| Raw Plugin API | métodos explicitamente suportados para o editor e versão | não contornar builder usando método inexistente |
| Code Connect | leitura de propriedades, mapeamento e contrato de executeTemplate | preservar instâncias como lacunas explícitas |
| Símbolos SwiftUI | getSfSymbolCharacter ou equivalente documentado | placeholder explícito, sem codepoint inventado |
| Diagrama | generate_diagram ou equivalente e inspeção das arestas | entregar especificação textual não aplicada |
| Plugin / shader | create/update, schema de controles, compilação e preview | separar fonte produzida de execução pendente |

## Leitura única coerente

`get_design_context` não é universalmente obrigatório nem proibido. Use-o quando o schema atual o suportar e houver o contexto exigido. Caso contrário, componha leitura por metadata e consultas documentadas do builder. Identifique nós por ID; nome e posição são fallback explícito. Não há teto fixo de três leituras: leia o necessário para resolver dependências e verificar mudanças, evitando repetição sem motivo. Uma leitura antiga pode estar desatualizada após edição concorrente.

## Mutação, retry e concorrência

- Serialize writes que compartilham documento, variáveis, biblioteca ou dependências. Páginas diferentes não comprovam isolamento. Leituras independentes só podem ser paralelas quando o host permitir.
- Use os métodos do builder suportados para criação/mutação. Não passe plan nodes a APIs raw. Se precisar de estado materializado, faça flush conforme o contrato e use o nó real.
- Após erro, só repita sem ler o canvas quando `safeToRetryWithoutCanvasRead === true`. Se `false` ou ausente, leia o estado, reconcilie IDs e efeitos e complete apenas o que falta. Não presuma rollback total.
- Após criação com resposta perdida, consulte status ou arquivos/nós recentes antes de repetir. Sem reconciliação disponível, declare resultado incerto.
- Devolva `return` estruturado ou o `FigDoneResult` documentado pelo adaptador. Não use `closePlugin()` para encerrar um lifecycle administrado pelo host.
- Envie o identificador real da variante em `skillNames` apenas se esse parâmetro existir no schema. Telemetria não deve quebrar a execução.

## Evidência e limites

Validade estrutural, escrita aceita, compilação e aparência observada são estados separados. Movimento precisa de evidência temporal; screenshot estático não prova timing. Assets temporários autorizados devem ser persistidos em destino durável para a aplicação final. Documente suporte a estilos customizados pela capacidade observada, sem depender de nome de feature flag histórica.

Teste mínimo a executar no host autorizado: leitura de um alvo conhecido; mutação pequena dentro do escopo; releitura dos IDs e propriedades; inspeção visual proporcional. Esta edição fornece o roteiro, mas não executou esse teste no Figma ou FigQuery.
