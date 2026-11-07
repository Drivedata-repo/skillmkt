# DriveData Deck — entrega 1.2

## Correção solicitada

A coleção troca PT/EN/ES sem recarregar a página. A carta aberta mantém capítulo, face, giro, etapa, campos preenchidos e posição aproximada da leitura. O novo catálogo é preparado antes da troca; falha de rede preserva a tela anterior. Requisições antigas não podem repor resultados no idioma anterior. Downloads pendentes continuam associados à carta original e não podem ser duplicados por uma nova renderização.

## Oito frentes implementadas

1. **Fontes das 137 skills:** edição 1.2.0 com procedimentos específicos, casos negativos, integridade e histórico. Sete referências CONNECTORS corrigidas, quatro guias extensos reorganizados e sete edições privadas parametrizadas. ZIPs 1.1 e fontes globais preservados. Detalhamento em [REVISAO-APLICADA-1.2.md](REVISAO-APLICADA-1.2.md).
2. **Triagem contextual:** no máximo duas perguntas quando falta contexto, distinção de etapas e respeito às exclusões. Uma tarefa que exige Figma sem acesso às ferramentas não recebe uma indicação irrelevante de Power BI.
3. **Compatibilidade:** escolha de assistente e 21 capacidades declaradas. A indicação considera ferramentas indisponíveis e informa requisitos antes do primeiro uso. Não há percentual fictício de compatibilidade.
4. **Laboratório:** roteiro para todas as cartas, dez referências determinísticas em três idiomas e três amostras limitadas executadas pelo Codex CLI na versão 1.2. Entrada, saída, critérios e evidência podem ser baixados.
5. **Arte individual:** 137 composições vetoriais com objetos ligados à aplicação, identidade estável entre idiomas, movimentos de hover/foco e respeito à preferência de movimento reduzido.
6. **Planos personalizados:** sequências de duas ou três skills, com entrada e entrega de cada etapa; salvar no Meu Deck e baixar o roteiro. Importar um plano existente preserva os demais.
7. **Ajuda após download:** diagnóstico guiado de reconhecimento, ferramenta ausente, resultado divergente, primeiro passo e incompatibilidade. Pedido de ajuda copiável com carta, versão e requisitos.
8. **Feedback e indicadores:** avaliação estruturada voluntária e contagens opcionais de indicação/download. Painel com chave administrativa separada, apenas agregados; fechar limpa a chave e impede que uma resposta atrasada repopule o painel.

## Verificação

- `npm run build`: 710 frases de interface verificadas em inglês e espanhol, 137 cartas e recursos presentes.
- `node --env-file=.env.local --test tests/*.test.cjs`: 134 testes aprovados, sem falhas ou skips nesta máquina.
- Banco: 137 novos ZIPs 1.2 importados sem substituir releases anteriores; hashes de arquivo e manifesto conferidos. Runtime sem acesso de leitura aos eventos individuais de feedback e à lista de espera; transações de QA revertidas.
- Navegador local: troca de idioma com carta aberta e campos preenchidos; laboratório expandido; ajuda copiada; download real do DD-042 v1.2 com conferência SHA-256; plano proposta → apresentação; bloqueio de indicação Figma incompatível; painel autenticado e estado vazio real.
- Layout: 375, 390 e 820 px sem excesso horizontal observado; landing, login e coleção conferidos. As verificações locais finais não registraram erros de JavaScript.

## Limites da evidência

Os 137 roteiros não são 137 execuções integrais por IA. Os três ensaios reais usam dados fictícios e respostas JSON, sem gerar arquivos Office nem integrar serviços externos. O modelo não foi informado pelos eventos do CLI. As dez referências determinísticas também não executam a skill no assistente. Esses limites aparecem no laboratório.

O site continua em demonstração gratuita por senha; downloads não exigem compra. Meu Deck permanece neste navegador, com exportação/importação. As métricas representam sessões e respostas declaradas, não pessoas únicas ou eficácia comprovada. A janela de 90 dias do painel não apaga automaticamente dados antigos. Nenhum original privado foi publicado no Git.
