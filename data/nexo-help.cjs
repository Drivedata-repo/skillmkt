"use strict";
// Base de ajuda do NEXO com IA. É a ÚNICA fonte de fatos de ajuda que o modelo recebe.
// Cada texto existe em PT, EN e ES. Mantenha curto: tudo isto entra no contexto a cada pergunta.
//
// ATENÇÃO, RASCUNHO PARA APROVAÇÃO DO JOÃO: os textos de licença (topics "licenses" e "client-use"
// e todos os licenseNotes) descrevem o que está escrito nos pacotes, mas não foram revisados por
// um profissional de direito. Enquanto não forem aprovados, o chat com IA deve ficar desligado.

const topics = {
  "free-vs-paid": {
    pt: "Cartas grátis e pagas. Algumas skills são de outros fabricantes e o Deck não tem permissão para redistribuí-las. Para essas, a carta vira um guia gratuito, com preço zero, que leva à fonte oficial; o Deck não entrega o arquivo. As skills oficiais e gratuitas de Office (Word, PDF, PowerPoint e Excel) são Apache 2.0 e podem ser baixadas aqui. As demais cartas têm preço proposto, pela entrega, pelo escopo e pelo esforço de conferir, com teto de US$ 47.",
    en: "Free and paid cards. Some skills belong to other publishers and the Deck has no permission to redistribute them. For those, the card becomes a free guide, priced at zero, that points to the official source; the Deck does not deliver the file. The official free Office skills (Word, PDF, PowerPoint and Excel) are Apache 2.0 and can be downloaded here. The other cards have a proposed price, based on deliverables, scope and verification effort, capped at US$ 47.",
    es: "Cartas gratis y de pago. Algunas skills son de otros fabricantes y el Deck no tiene permiso para redistribuirlas. Para ellas, la carta pasa a ser una guía gratuita, con precio cero, que lleva a la fuente oficial; el Deck no entrega el archivo. Las skills oficiales y gratuitas de Office (Word, PDF, PowerPoint y Excel) son Apache 2.0 y se pueden descargar aquí. Las demás cartas tienen un precio propuesto, según entrega, alcance y esfuerzo de verificación, con tope de US$ 47.",
  },
  licenses: {
    pt: "Licenças. Cada pacote traz os textos de licença dentro do ZIP e esses textos são o que vale. Nas cartas de autoria da DriveData, todo o conteúdo segue os termos DriveData (arquivo LICENCA-DRIVEDATA.txt). Nas cartas baseadas em obra aberta, a obra original mantém a licença dela (MIT ou Apache 2.0, com o aviso de autoria, em um arquivo de licença dentro da pasta da skill), e o material acrescentado pela DriveData segue o LICENCA-DRIVEDATA.txt. Cartas de outros fabricantes sem permissão de redistribuição não têm pacote; vale a licença da fonte oficial.",
    en: "Licenses. Each package carries the license texts inside the ZIP, and those texts are what applies. In DriveData-authored cards, all the content follows the DriveData terms (file LICENCA-DRIVEDATA.txt). In cards based on open work, the original work keeps its own license (MIT or Apache 2.0, with the authorship notice, in a license file inside the skill folder), and the material added by DriveData follows LICENCA-DRIVEDATA.txt. Cards from other publishers without redistribution permission have no package; the official source's license applies.",
    es: "Licencias. Cada paquete incluye los textos de licencia dentro del ZIP y esos textos son lo que vale. En las cartas de autoría de DriveData, todo el contenido sigue los términos DriveData (archivo LICENCA-DRIVEDATA.txt). En las cartas basadas en obra abierta, la obra original mantiene su propia licencia (MIT o Apache 2.0, con el aviso de autoría, en un archivo de licencia dentro de la carpeta de la skill), y el material agregado por DriveData sigue el LICENCA-DRIVEDATA.txt. Las cartas de otros fabricantes sin permiso de redistribución no tienen paquete; vale la licencia de la fuente oficial.",
  },
  "client-use": {
    pt: "Uso no trabalho e com clientes. Os termos DriveData permitem usar, copiar e adaptar o material da DriveData nas suas atividades e nas da empresa em que você trabalha, e não permitem revender, sublicenciar ou redistribuir esse material a terceiros, sozinho ou dentro de outro produto. Nas cartas de autoria da DriveData, isso vale para todo o conteúdo do pacote. Nas cartas baseadas em obra aberta (MIT ou Apache 2.0), a obra original segue a licença dela, com regras próprias de redistribuição, e o material acrescentado pela DriveData segue os termos DriveData. Os termos não mencionam o resultado do seu trabalho. Em caso de dúvida sobre um contrato, consulte um profissional de direito.",
    en: "Use at work and with clients. The DriveData terms allow you to use, copy and adapt the DriveData material in your own activities and in those of the company you work for, and do not allow reselling, sublicensing or redistributing that material to third parties, alone or inside another product. In DriveData-authored cards, this applies to all the package content. In cards based on open work (MIT or Apache 2.0), the original work follows its own license, with its own redistribution rules, and the material added by DriveData follows the DriveData terms. The terms do not mention the result of your work. If in doubt about a contract, consult a legal professional.",
    es: "Uso en el trabajo y con clientes. Los términos DriveData permiten usar, copiar y adaptar el material de DriveData en tus actividades y en las de la empresa donde trabajas, y no permiten revender, sublicenciar ni redistribuir ese material a terceros, solo o dentro de otro producto. En las cartas de autoría de DriveData, esto vale para todo el contenido del paquete. En las cartas basadas en obra abierta (MIT o Apache 2.0), la obra original sigue su propia licencia, con reglas propias de redistribución, y el material agregado por DriveData sigue los términos DriveData. Los términos no mencionan el resultado de tu trabajo. Ante la duda sobre un contrato, consulta a un profesional del derecho.",
  },
  install: {
    pt: "Instalação. Na carta, abra Primeiro uso e escolha o assistente em que vai usar a skill. Siga a etapa Instalação e preserve a pasta completa do pacote. Depois, abra um novo chat no seu assistente, confira se a skill foi reconhecida e experimente o comando sugerido. Conectores e ferramentas continuam sendo requisitos separados.",
    en: "Installation. On the card, open First use and choose the assistant where you will use the skill. Follow the Installation step and keep the package folder complete. Then open a new chat in your assistant, check that the skill was recognized and try the suggested command. Connectors and tools remain separate requirements.",
    es: "Instalación. En la carta, abre Primer uso y elige el asistente donde usarás la skill. Sigue el paso Instalación y conserva la carpeta completa del paquete. Luego abre un chat nuevo en tu asistente, comprueba que la skill fue reconocida y prueba el comando sugerido. Los conectores y las herramientas siguen siendo requisitos aparte.",
  },
  "first-use": {
    pt: "Primeiro uso. Abra a carta e vá em Primeiro uso. O guia tem quatro etapas: Ambiente, Instalação, Primeiro comando e Conferência. A skill é executada no seu ambiente, com as suas ferramentas; o Deck não executa a skill por você. Confira cada entrega antes de usá-la. Se travar, a carta tem a aba de ajuda para usar.",
    en: "First use. Open the card and go to First use. The guide has four steps: Environment, Installation, First command and Check. The skill runs in your environment, with your tools; the Deck does not run the skill for you. Check each deliverable before using it. If you get stuck, the card has a help tab.",
    es: "Primer uso. Abre la carta y ve a Primer uso. La guía tiene cuatro pasos: Entorno, Instalación, Primer comando y Verificación. La skill se ejecuta en tu entorno, con tus herramientas; el Deck no ejecuta la skill por ti. Revisa cada entrega antes de usarla. Si te trabas, la carta tiene una pestaña de ayuda.",
  },
  "download-errors": {
    pt: "Erros de download. Se a sessão expirou, entre novamente. Se o aviso disser que a versão mudou, atualize a página e baixe a edição atual. O Deck confere a versão e a integridade do ZIP antes de iniciar o download. Se continuar, informe o código da carta e o texto do erro; o NEXO não abre chamado automaticamente.",
    en: "Download errors. If your session expired, sign in again. If the notice says the version changed, refresh the page and download the current edition. The Deck checks the version and the ZIP's integrity before starting the download. If it continues, report the card code and the error text; NEXO does not open a ticket automatically.",
    es: "Errores de descarga. Si la sesión expiró, vuelve a entrar. Si el aviso dice que la versión cambió, actualiza la página y descarga la edición actual. El Deck comprueba la versión y la integridad del ZIP antes de iniciar la descarga. Si continúa, informa el código de la carta y el texto del error; NEXO no abre un ticket automáticamente.",
  },
  access: {
    pt: "Acesso. Para acesso de comprador, use a página de acesso com o mesmo e-mail da compra. Para a demonstração, use o acesso de demonstração recebido. Na demonstração os downloads disponíveis estão liberados para experimentar e os preços exibidos são propostos. O NEXO não consulta contas, senhas nem pagamentos.",
    en: "Access. For buyer access, use the access page with the same email as the purchase. For the demo, use the demo access you received. In the demo, the available downloads are open for you to try and the prices shown are proposed. NEXO does not look up accounts, passwords or payments.",
    es: "Acceso. Para el acceso de comprador, usa la página de acceso con el mismo correo de la compra. Para la demostración, usa el acceso de demostración recibido. En la demostración las descargas disponibles están abiertas para probar y los precios mostrados son propuestos. NEXO no consulta cuentas, contraseñas ni pagos.",
  },
  "my-deck": {
    pt: "Meu Deck e invocação. Meu Deck guarda as cartas que você salvou. Na primeira inclusão de uma carta com invocação, ela apresenta o efeito e o som da sua faixa; remover e recolocar não repete. Para repetir, abra Poder da carta e escolha Invocar carta. Som e efeitos suaves podem ser ajustados na própria carta.",
    en: "My Deck and summoning. My Deck keeps the cards you saved. The first time you add a card with a summoning, it plays the effect and sound of its tier; removing and re-adding does not repeat it. To repeat, open Card power and choose Summon card. Sound and gentle effects can be adjusted on the card itself.",
    es: "Mi Deck e invocación. Mi Deck guarda las cartas que guardaste. La primera vez que agregas una carta con invocación, muestra el efecto y el sonido de su categoría; quitarla y volver a ponerla no lo repite. Para repetir, abre Poder de la carta y elige Invocar carta. El sonido y los efectos suaves se pueden ajustar en la propia carta.",
  },
  passport: {
    pt: "Passaporte da carta. DD é o código da carta no catálogo. O passaporte reúne o identificador permanente, a edição e a impressão digital do ZIP. Ele identifica o registro do catálogo, não uma cópia exclusiva comprada. Não há token, carteira nem blockchain nessa identidade.",
    en: "Card passport. DD is the card's code in the catalog. The passport holds the permanent identifier, the edition and the ZIP's fingerprint. It identifies the catalog record, not an exclusive copy you bought. There is no token, wallet or blockchain in this identity.",
    es: "Pasaporte de la carta. DD es el código de la carta en el catálogo. El pasaporte reúne el identificador permanente, la edición y la huella del ZIP. Identifica el registro del catálogo, no una copia exclusiva comprada. No hay token, billetera ni blockchain en esta identidad.",
  },
  pricing: {
    pt: "Preços. Cada carta mostra um preço proposto em dólares, de US$ 7 a US$ 47, calculado pela profundidade da skill, pelo escopo, pelo esforço de verificação e pelo quanto pode ser reaproveitada. Cartas grátis mostram preço zero. O NEXO não confirma compras nem consulta pagamentos.",
    en: "Prices. Each card shows a proposed price in dollars, from US$ 7 to US$ 47, based on the skill's depth, scope, verification effort and reuse. Free cards show a zero price. NEXO does not confirm purchases or look up payments.",
    es: "Precios. Cada carta muestra un precio propuesto en dólares, de US$ 7 a US$ 47, según la profundidad de la skill, el alcance, el esfuerzo de verificación y la reutilización. Las cartas gratis muestran precio cero. NEXO no confirma compras ni consulta pagos.",
  },
  privacy: {
    pt: "Privacidade da conversa. Para responder perguntas livres, o NEXO envia sua mensagem, as últimas mensagens da conversa, o código da carta aberta e o idioma a um provedor de IA nos Estados Unidos. Não envia seu e-mail nem seu identificador de cliente. O Deck não guarda a conversa no servidor; o histórico fica só na aba e some ao recarregar. Não escreva senhas, dados de pagamento ou dados de clientes.",
    en: "Chat privacy. To answer free-form questions, NEXO sends your message, the latest messages of the conversation, the code of the open card and the language to an AI provider in the United States. It does not send your email or customer identifier. The Deck does not store the conversation on the server; the history stays only in the tab and disappears on reload. Do not write passwords, payment data or client data.",
    es: "Privacidad del chat. Para responder preguntas libres, NEXO envía tu mensaje, los últimos mensajes de la conversación, el código de la carta abierta y el idioma a un proveedor de IA en Estados Unidos. No envía tu correo ni tu identificador de cliente. El Deck no guarda la conversación en el servidor; el historial queda solo en la pestaña y desaparece al recargar. No escribas contraseñas, datos de pago ni datos de clientes.",
  },
  "not-do": {
    pt: "O que o NEXO não faz. Não executa skills, não consulta nem altera contas, senhas ou pagamentos, não confirma compras, não abre chamados e não dá aconselhamento jurídico. Ele orienta sobre as cartas e sobre o uso do Deck com base nas informações do catálogo. Quando não sabe, diz que não sabe.",
    en: "What NEXO does not do. It does not run skills, look up or change accounts, passwords or payments, confirm purchases, open tickets or give legal advice. It guides you on the cards and on using the Deck based on the catalog's information. When it does not know, it says so.",
    es: "Lo que NEXO no hace. No ejecuta skills, no consulta ni modifica cuentas, contraseñas o pagos, no confirma compras, no abre tickets ni da asesoría jurídica. Te orienta sobre las cartas y sobre el uso del Deck con base en la información del catálogo. Cuando no sabe, lo dice.",
  },
};

// Nota fixa por classe de direito (classify().class). O modelo só escolhe a classe; o texto é este.
const licenseNotes = {
  "own-declared": {
    pt: "Carta de autoria DriveData. Todo o conteúdo do pacote segue o arquivo LICENCA-DRIVEDATA.txt: uso nas suas atividades e nas da empresa em que você trabalha, sem revenda, sublicença ou redistribuição a terceiros.",
    en: "DriveData-authored card. All the package content follows the file LICENCA-DRIVEDATA.txt: use in your activities and in those of the company you work for, without resale, sublicensing or redistribution to third parties.",
    es: "Carta de autoría DriveData. Todo el contenido del paquete sigue el archivo LICENCA-DRIVEDATA.txt: uso en tus actividades y en las de la empresa donde trabajas, sin reventa, sublicencia ni redistribución a terceros.",
  },
  mit: {
    pt: "Carta baseada em obra aberta sob licença MIT. A obra original segue a licença MIT, cujo texto e aviso de autoria estão no arquivo de licença dentro da pasta da skill. O material acrescentado pela DriveData segue o LICENCA-DRIVEDATA.txt: uso nas suas atividades e nas da empresa em que você trabalha, sem revenda, sublicença ou redistribuição.",
    en: "Card based on open work under the MIT license. The original work follows the MIT license, whose text and authorship notice are in the license file inside the skill folder. The material added by DriveData follows LICENCA-DRIVEDATA.txt: use in your activities and in those of the company you work for, without resale, sublicensing or redistribution.",
    es: "Carta basada en obra abierta bajo licencia MIT. La obra original sigue la licencia MIT, cuyo texto y aviso de autoría están en el archivo de licencia dentro de la carpeta de la skill. El material agregado por DriveData sigue el LICENCA-DRIVEDATA.txt: uso en tus actividades y en las de la empresa donde trabajas, sin reventa, sublicencia ni redistribución.",
  },
  "apache-2.0": {
    pt: "Carta baseada em obra aberta sob Apache 2.0. A obra original segue a Apache 2.0, cujo texto está em LICENSE.txt dentro da pasta da skill, com o registro das alterações em ALTERACOES-E-AUTORIA.md. O material acrescentado pela DriveData segue o LICENCA-DRIVEDATA.txt: uso nas suas atividades e nas da empresa em que você trabalha, sem revenda, sublicença ou redistribuição.",
    en: "Card based on open work under Apache 2.0. The original work follows Apache 2.0, whose text is in LICENSE.txt inside the skill folder, with the record of changes in ALTERACOES-E-AUTORIA.md. The material added by DriveData follows LICENCA-DRIVEDATA.txt: use in your activities and in those of the company you work for, without resale, sublicensing or redistribution.",
    es: "Carta basada en obra abierta bajo Apache 2.0. La obra original sigue la Apache 2.0, cuyo texto está en LICENSE.txt dentro de la carpeta de la skill, con el registro de cambios en ALTERACOES-E-AUTORIA.md. El material agregado por DriveData sigue el LICENCA-DRIVEDATA.txt: uso en tus actividades y en las de la empresa donde trabajas, sin reventa, sublicencia ni redistribución.",
  },
  "free-apache": {
    pt: "Skill oficial e gratuita sob Apache 2.0, publicada pelo fabricante. Vale a licença que acompanha o pacote.",
    en: "Official free skill under Apache 2.0, published by the maker. The license that comes with the package applies.",
    es: "Skill oficial y gratuita bajo Apache 2.0, publicada por el fabricante. Vale la licencia que acompaña al paquete.",
  },
  proprietary: {
    pt: "Skill de outro fabricante, sem permissão de redistribuição. O Deck não entrega o arquivo; esta carta é um guia gratuito que leva à fonte oficial. Valem os termos do fabricante.",
    en: "Skill from another publisher, without redistribution permission. The Deck does not deliver the file; this card is a free guide that points to the official source. The publisher's terms apply.",
    es: "Skill de otro fabricante, sin permiso de redistribución. El Deck no entrega el archivo; esta carta es una guía gratuita que lleva a la fuente oficial. Valen los términos del fabricante.",
  },
  "no-license": {
    pt: "Skill de outro fabricante cuja fonte não declara licença de redistribuição. O Deck não entrega o arquivo; esta carta é um guia gratuito que leva à fonte oficial. Confira os termos lá.",
    en: "Skill from another publisher whose source declares no redistribution license. The Deck does not deliver the file; this card is a free guide that points to the official source. Check the terms there.",
    es: "Skill de otro fabricante cuya fuente no declara licencia de redistribución. El Deck no entrega el archivo; esta carta es una guía gratuita que lleva a la fuente oficial. Revisa los términos allí.",
  },
  authorized: {
    pt: "Carta com autorização documentada do autor para distribuição pelo Deck. Vale o arquivo de licença do pacote.",
    en: "Card with the author's documented authorization for distribution by the Deck. The package's license file applies.",
    es: "Carta con autorización documentada del autor para su distribución por el Deck. Vale el archivo de licencia del paquete.",
  },
  unknown: {
    pt: "Não tenho a classificação de licença desta carta. Leia o arquivo de licença dentro do pacote antes de usar.",
    en: "I do not have this card's license classification. Read the license file inside the package before using it.",
    es: "No tengo la clasificación de licencia de esta carta. Lee el archivo de licencia dentro del paquete antes de usarla.",
  },
};

const refusal = {
  pt: "Eu ajudo com o Deck: encontrar cartas, entender licenças, instalar e usar skills. Esse assunto está fora do que posso responder aqui.",
  en: "I help with the Deck: finding cards, understanding licenses, installing and using skills. That subject is outside what I can answer here.",
  es: "Ayudo con el Deck: encontrar cartas, entender licencias, instalar y usar skills. Ese tema está fuera de lo que puedo responder aquí.",
};

const sensitive = {
  pt: "Parece haver uma senha, um dado de pagamento ou um documento pessoal na mensagem, e eu não devo recebê-los. Não enviei a mensagem a nenhum serviço e a tirei da conversa. Para acesso e conta, use a página de acesso; eu não consulto contas, senhas nem pagamentos.",
  en: "The message seems to contain a password, payment data or a personal document, and I should not receive them. I did not send the message to any service and I removed it from the conversation. For access and account, use the access page; I do not look up accounts, passwords or payments.",
  es: "El mensaje parece contener una contraseña, un dato de pago o un documento personal, y no debo recibirlos. No envié el mensaje a ningún servicio y lo quité de la conversación. Para acceso y cuenta, usa la página de acceso; no consulto cuentas, contraseñas ni pagos.",
};

module.exports = { topics, licenseNotes, refusal, sensitive };
