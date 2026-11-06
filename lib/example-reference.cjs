// Small reference transformations for fictional fixtures; never execute user code.
function run(kind, input) {
  switch (kind) {
    case "orders": {
      const unique = new Map(),
        duplicates = [];
      for (const r of input.orders) {
        if (unique.has(r.id)) {
          if (JSON.stringify(unique.get(r.id)) !== JSON.stringify(r))
            throw new Error("Pedido conflitante: " + r.id);
          duplicates.push(r.id);
        } else unique.set(r.id, r);
      }
      const byClient = {};
      for (const r of unique.values())
        byClient[r.client] = (byClient[r.client] || 0) + r.value;
      return {
        uniqueOrders: unique.size,
        duplicates,
        byClient,
        total: [...unique.values()].reduce((n, r) => n + r.value, 0),
      };
    }
    case "minutes":
      return {
        meeting: input.meeting,
        date: input.date,
        actions: input.decisions.map((x) => ({
          ...x,
          due: x.due || "A confirmar",
        })),
      };
    case "document":
      return {
        title: input.title,
        sections: [
          { heading: "Objetivo", text: input.title },
          { heading: "Escopo", items: input.scope },
          { heading: "Exclusões", items: input.exclusions },
          { heading: "Aceite", text: input.acceptance },
        ],
      };
    case "cleanup": {
      const totals = {},
        errors = [];
      for (const [index, r] of input.rows.entries()) {
        const product = r.product.trim().toUpperCase();
        const amount = /^\d+(,\d{1,2})?$/.test(r.amount)
          ? Number(r.amount.replace(",", "."))
          : NaN;
        if (!Number.isFinite(amount)) {
          errors.push({ line: index + 1, product, value: r.amount });
          continue;
        }
        totals[product] =
          Math.round(((totals[product] || 0) + amount) * 100) / 100;
      }
      return { totals, errors, sourceRows: input.rows.length };
    }
    case "slides":
      return {
        audience: input.audience,
        objective: input.objective,
        slides: input.facts.map((fact, i) => ({
          title: ["Situação", "Problema", "Próximo passo"][i],
          body: fact,
          notes: "Validar este fato com o responsável antes de apresentar.",
        })),
      };
    case "margin": {
      const revenue = input.rows.reduce((n, r) => n + r.revenue, 0),
        cost = input.rows.reduce((n, r) => n + r.cost, 0);
      return {
        revenue,
        cost,
        profit: revenue - cost,
        margin: revenue ? (revenue - cost) / revenue : null,
        formula: "=IFERROR((SUM(B2:B3)-SUM(C2:C3))/SUM(B2:B3),0)",
      };
    }
    case "reconcile": {
      const months = [
        ...new Set([...input.source, ...input.report].map((r) => r.month)),
      ];
      const rows = months.map((month) => {
        const sum = (source) =>
          source
            .filter((r) => r.month === month)
            .reduce((n, r) => n + r.revenue, 0);
        return {
          month,
          source: sum(input.source),
          report: sum(input.report),
          difference: sum(input.report) - sum(input.source),
        };
      });
      return {
        rows,
        totalDifference: rows.reduce((n, r) => n + r.difference, 0),
        nextStep:
          "Conferir filtros, duplicidades e a regra de reconhecimento em Fev.",
      };
    }
    case "requirements":
      return {
        need: input.need,
        flows: [
          {
            role: input.roles[0],
            screen: "Nova solicitação",
            acceptance:
              "Ao salvar uma solicitação válida, exibir o estado " +
              input.states[0],
          },
          {
            role: input.roles[0],
            screen: "Minhas solicitações",
            acceptance:
              "Exibir estado e histórico de cada solicitação autorizada",
          },
          {
            role: input.roles[1],
            screen: "Fila de atendimento",
            acceptance: "Permitir transições entre " + input.states.join(", "),
          },
        ],
        openDecisions: [
          "Confirmar regras de permissão",
          "Definir persistência e integrações",
        ],
      };
    case "content":
      return {
        draft: `${input.audience}: ${input.problem.toLowerCase()} faz parte da sua rotina?\n\n${input.capability} é um ponto de partida para entender as inconsistências.\n\n${input.cta}.`,
        status: "Rascunho para aprovação",
      };
    case "seo": {
      const issues = [];
      if (!input.description)
        issues.push({
          item: "Descrição",
          finding: "Ausente",
          action: "Escrever uma descrição fiel ao conteúdo da página",
        });
      if (input.headings.length !== 1)
        issues.push({
          item: "H1",
          finding: input.headings.length + " títulos principais",
          action: "Definir um título principal e organizar os subtítulos",
        });
      for (const image of input.images)
        if (!image.alt)
          issues.push({
            item: image.file,
            finding: "Sem texto alternativo",
            action:
              "Descrever o conteúdo relevante; imagem decorativa pode ter alt vazio",
          });
      return { title: input.title, issues };
    }
    default:
      throw new Error("Exemplo desconhecido");
  }
}
module.exports = { run };
