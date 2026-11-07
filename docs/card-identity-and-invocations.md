# Invocações e identidade das cartas

As 137 skills continuam gratuitas na demonstração. Os nove valores em USD são propostos. A faixa determina o ritual visual e sonoro, sem alterar os atributos fictícios de poder ou a avaliação técnica.

| Preço proposto | Invocação | Assinatura visual e sonora | Duração |
|---|---|---|---|
| US$ 7 | Pulso inicial | Expansão suave e duas notas cristalinas | 1,2 s |
| US$ 12 | Eco vetorial | Anéis concêntricos e notas com resposta em eco | 1,5 s |
| US$ 17 | Fluxo esmeralda | Hélices verdes e marimba sintetizada | 1,8 s |
| US$ 22 | Ignição âmbar | Reator geométrico, raios e impacto grave | 2,1 s |
| US$ 27 | Fenda azul | Portal vertical e subida de sintetizador | 2,4 s |
| US$ 32 | Tempestade iônica | Arcos elétricos, partículas ciano e arpejo | 2,8 s |
| US$ 37 | Ascensão prismática | Cristais violeta e cascata de sinos | 3,1 s |
| US$ 42 | Convergência orbital | Três órbitas de platina e acorde espacial | 3,5 s |
| US$ 47 | Coroação solar | Carga, feixe, elevação, selos opostos, 24 raios, coroa e acorde de celebração | 4,2 s |

Em **Poder da carta → Invocar carta**, os efeitos completos abrem uma apresentação dentro da carta. É possível sair pelo botão de retorno, Escape ou fechamento da carta. A mudança de idioma cancela a sequência antes de reconstruir o conteúdo. No modo suave ou com `prefers-reduced-motion`, a confirmação é estática e não abre a apresentação. O som tem controle independente e preferência persistente.

O áudio é original, sintetizado por Web Audio após uma ação do usuário. Não há arquivos de terceiros, captura de microfone ou chamada a serviço de IA. Cada faixa tem partitura, timbre e duração próprios. Existe apenas um barramento ativo; cancelar, silenciar ou ocultar a aba desliga as fontes e cancela reproduções pendentes. Um compressor controla os picos. As animações duram no máximo 4,2 segundos e não usam estroboscopia.

## Passaporte e integridade

- **Código de registro:** `DD-001` a `DD-137`, já persistidos no catálogo. Não renumerar os códigos quando mudar ordenação, título, slug ou grupo.
- **ID permanente:** `ddk_` seguido de SHA-256 de `drivedata:deck:card:v1\n<CÓDIGO>`, em UTF-8, sem quebra ao final. O caractere `\n` nessa notação representa uma quebra de linha LF real.
- **Serial de exibição:** `DDK-<NÚMERO>-<12 primeiros hexadecimais em três blocos>`. A abreviação é visual; o ID completo identifica o registro.
- **Selo visual:** padrão determinístico derivado do hash; não é QR code, assinatura digital ou mecanismo de autenticação.
- **ID de edição:** `dde_` seguido de SHA-256 de `drivedata:deck:card:v1:edition\n<DIGEST DA CARTA>\n<VERSÃO>\n<SHA-256 DO ZIP>`. Muda quando o conteúdo/versão muda. O ID permanente permanece.
- **JSON exportável:** identidade, edição, URL da carta e entradas canônicas para reproduzir os hashes. Sem dados pessoais ou chaves.
- **Conferência local do ZIP:** hash dos bytes escolhidos comparado ao pacote da edição exibida. Nenhum upload. Pacotes de até 4 MB, seguindo o limite do download existente.

O passaporte identifica uma **entrada do catálogo compartilhada por todos os usuários**. Não identifica uma cópia vendida individual, não prova compra ou propriedade e não concede licença. Os hashes verificam consistência e integridade em relação ao catálogo recebido por HTTPS; não são uma assinatura do emissor. Não existe contrato, carteira, token emitido ou transação em blockchain nesta versão.

## Possível evolução para blockchain

Recomendação arquitetural, ainda não implementada: se houver utilidade comercial para direitos de acesso portáveis ou coleções transferíveis, estudar **ERC-1155**. Ele permite vários tipos de token no mesmo contrato e múltiplas unidades por tipo, combinação mais próxima de um catálogo de skills com várias licenças por edição. Para uma peça realmente única por proprietário, avaliar **ERC-721**. Essa escolha é uma inferência de adequação ao produto a partir dos padrões, não uma promessa de valorização.

Fontes primárias consultadas em 2026-11-07: [ERC-1155 — Multi Token Standard](https://eips.ethereum.org/EIPS/eip-1155) e [ERC-721 — Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721).

Uma etapa futura teria de definir:

1. O que o token representa: acesso, licença, edição ou peça única, com direitos de distribuição confirmados.
2. Se transferir o token também transfere ou revoga o acesso; arquivos já baixados não podem ser recolhidos por uma blockchain.
3. Rede, custos, custódia, recuperação de acesso, política de atualizações e auditoria do contrato.
4. Um mapeamento persistente entre `card ID`, `edition ID` e `chain ID + contract + token ID`. Não chamar o ID atual de endereço de carteira.
5. Prova do direito de baixar no servidor, sem tornar o ZIP privado acessível diretamente por metadados públicos do token.
6. Metadados versionados e conteúdo publicado de maneira durável. O hash de edição atual ajuda a vincular os bytes, mas sozinho não implementa nenhuma dessas funções.

Não é necessário blockchain para vender e entregar skills. O passaporte funciona hoje e permite avaliar essa evolução sem migrar o catálogo nem impor carteira aos usuários.

## Verificação e reprodução

`npm test` inclui unicidade das 137 identidades, estabilidade em PT/EN/ES, mudança de edição, adulteração de campos, nove partituras distintas, limites de duração e cancelamento de áudio durante uma retomada pendente. `npm run build` também verifica unicidade das identidades.

Para a comparação visual local e renderização dos nove sons pelo mesmo sintetizador do site:

```powershell
node scripts/preview-collection.cjs
python -m http.server 4339 --bind 127.0.0.1 --directory .local/collection-preview
```

Abra `http://127.0.0.1:4339/`. A prévia contém nove cartas, uma captura pausada no auge e exportação de WAV estéreo 48 kHz com relatório de pico/RMS. Essa página de QA não é publicada no site. O áudio renderizado confirma o funcionamento do sintetizador; a preferência subjetiva por timbre depende de audição.
