# Pacotes gratuitos da demo — edição 1.0.0

Dois roteiros editoriais reúnem skills existentes da edição 1.2.0. O acesso continua protegido pela sessão de senha da demo. Não há preços, cobrança ou autorização adicional de redistribuição comercial.

## Contrato de produto

`getPacks(locale)` retorna um array localizado. Cada item contém `id`, `title`, `tagline`, `description`, `audience`, `outcome`, `requirements[]`, `limitations[]`, `steps[]`, `sample`, `version`, `skillVersion`, `locale`, `mode`, `rights`, `originalsLanguage` e `originalsNotice`.

Cada etapa contém `id`, `skillId`, `title`, `input`, `output`, `prompt` e `checks[]`. Cada arquivo de amostra contém `filename`, `mimeType` e `content`. Os campos `sample.input` e `sample.reference` são arrays; `sample.checks` contém `id`, `label` e `expected`. Texto editorial, prompts, checklists e nomes fictícios têm autoria PT/EN/ES. IDs, números, chaves e fórmulas são preservados.

### Planilhas confiáveis

1. `claude-power-query-best-practices`: organizar e deduplicar por chave composta, sem apagar conflitos.
2. `claude-xlsx`: produzir fórmulas, resumo por pedido e conferir recálculo.
3. `automacao-documentos-office`: registrar evidência e pendências em documento editável.

Amostra CSV: 6 linhas, 5 únicas, 1 duplicata exata; total 330. Totais por pedido: 160, 80, 40 e 50. Chave repetida com conteúdo diferente é erro, não descarte automático.

### Power BI sob controle

1. `claude-power-query-best-practices`: preparar tipos, chaves e granularidade.
2. `power-bi-modelagem-dax-performance`: definir modelo e medidas com contexto de filtro.
3. `claude-power-bi-best-practices`: auditar com evidência, exceções e cobertura declarada.
4. `claude-bi-documentation`: documentar inventário, medidas, verificações e lacunas.

Amostra JSON: 4 vendas, receita 500, custo 310, margem 190 e percentual 0.38. Janeiro tem margem 120 e fevereiro 70. O percentual é razão de totais do contexto, nunca média simples de percentuais.

## Entrega e segurança

- `GET /api/packs?lang=pt|en|es`: exige sessão válida e retorna diretamente o array localizado.
- `GET /api/pack-download?id=<id>&lang=pt|en|es`: exige sessão, valida parâmetros e aplica o limitador existente a 30 downloads por hora/IP no escopo do pacote.
- A leitura de arquivos usa `DATABASE_URL` do papel `skillmkt_app`, sem credencial administrativa nem fallback privilegiado. SQL parametrizado exige `current_user=skillmkt_app`.
- As versões e SHA-256 de cada ZIP 1.2.0 estão fixados em `data/packs.cjs`, independentemente de futuras versões de `data/releases.cjs`.
- O servidor confere SHA-256 dos bytes recebidos, metadados do banco e hash fixado antes de montar o ZIP. Não extrai nem executa as skills.
- Os ZIPs originais ficam intactos em `SKILLS/`. O pacote inclui `README.md`, `CHECKLIST.md`, `sample/`, `verify.cjs`, `MANIFEST.json` e `INTEGRITY.json`.
- Limite total de fontes: 3.500.000 bytes; ZIP final: 4.000.000 bytes. Resposta privada sem cache, com `X-Package-SHA256` calculado dos bytes finais e `X-Package-Version: 1.0.0`.
- Licenças e autoria originais permanecem nos ZIPs internos; a curadoria e o roteiro são da DriveData. Roteiros localizados não reescrevem o conteúdo original das skills.

## Evidência e verificação

O resultado de referência é matemático e determinístico. O verificador Node lê somente a amostra, calcula o resultado e compara `sample/reference.json`; não chama IA, não instala dependências e não valida execução no Excel ou Power BI. XLSX, DOCX e PBIP/PBIX de produção não vêm prontos no download.

Foram realizadas consultas somente leitura no PostgreSQL existente: papel `skillmkt_app`, `rolsuper=false`, `rolbypassrls=false`; os dois conjuntos de ZIPs 1.2.0 foram lidos, tiveram seus bytes conferidos e foram montados em memória. Nenhuma escrita no banco foi feita para esta verificação. O limitador da aplicação mantém sua operação existente quando o endpoint é usado normalmente.

Testes locais: `node --test tests/packs*.test.cjs`. Cobrem os três idiomas, schema, cálculos independentes, conflitos, datas, sessão, método, parâmetros, limite, indisponibilidade, integridade dos bytes, ZIPs originais preservados, manifest, verificador executado e rejeição de referência adulterada. Os testes de arquivos privados informam ausência de fixtures quando executados em checkout sem os ZIPs.

As páginas oficiais [conexão PostgreSQL](https://supabase.com/docs/guides/database/connecting-to-postgres) e [changelog Supabase](https://supabase.com/changelog) foram consultadas antes da integração. A implementação reutiliza o cliente PostgreSQL/TLS e o papel de aplicação já existentes, sem alteração de schema, permissões ou exposição pela Data API.

Roteamento local, inclusão no catálogo e componentes visuais são integrados separadamente pelo coordenador. Nenhuma rota pública de download de originais foi criada.
