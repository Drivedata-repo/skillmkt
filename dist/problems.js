"use strict";
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.DeckProblemDemo = api;
    api.mount();
  }
})(typeof globalThis === "object" ? globalThis : this, () => {
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function samples(kind, scenario = 0) {
    if (![0, 1, 2].includes(scenario)) throw new RangeError("Invalid scenario");
    if (kind === "orders") {
      const rows = [
        { order: "P-101", item: "A", quantity: 2, unitPrice: 50 },
        { order: "P-102", item: "B", quantity: 1, unitPrice: 80 },
        { order: "P-103", item: "A", quantity: 3, unitPrice: 50 },
        { order: "P-104", item: "C", quantity: 1, unitPrice: 120 },
      ];
      if (scenario !== 2) rows.splice(1, 0, { ...rows[0] });
      if (scenario === 1)
        rows.push({ order: "P-102", item: "B", quantity: 2, unitPrice: 80 });
      return rows;
    }
    if (kind === "reconcile")
      return [
        { period: "2026-01", source: 1200, report: 1200 },
        {
          period: "2026-02",
          source: 1800,
          report: scenario === 0 ? 2050 : scenario === 1 ? 1550 : 1800,
        },
        { period: "2026-03", source: 1400, report: 1400 },
      ];
    if (kind === "performance")
      return scenario === 2
        ? [
            { visual: "V01", daxMs: 210, displayMs: 90, otherMs: 30 },
            { visual: "V02", daxMs: 400, displayMs: 170, otherMs: 50 },
            { visual: "V03", daxMs: 160, displayMs: 60, otherMs: 20 },
          ]
        : [
            { visual: "V01", daxMs: 840, displayMs: 120, otherMs: 40 },
            {
              visual: "V02",
              daxMs: scenario === 0 ? 1900 : 400,
              displayMs: scenario === 0 ? 400 : 1900,
              otherMs: 200,
            },
            { visual: "V03", daxMs: 350, displayMs: 180, otherMs: 70 },
          ];
    throw new RangeError("Invalid demonstration");
  }
  function calculate(kind, rows, threshold = 0) {
    if (
      !Array.isArray(rows) ||
      !Number.isFinite(threshold) ||
      threshold < 0 ||
      threshold > 10000
    )
      throw new RangeError("Invalid input");
    if (kind === "orders") {
      const groups = new Map(),
        output = [],
        sum = (arr) =>
          arr.reduce(
            (total, r) => total + Math.round(r.unitPrice * 100) * r.quantity,
            0,
          ) / 100;
      rows.forEach((r, index) => {
        if (
          !Number.isSafeInteger(r.quantity) ||
          r.quantity < 0 ||
          !Number.isFinite(r.unitPrice) ||
          r.unitPrice < 0
        )
          throw new RangeError("Invalid order");
        const key = JSON.stringify([r.order, r.item]);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({ ...r, line: index + 1 });
      });
      let duplicates = 0,
        conflicts = 0;
      for (const group of groups.values()) {
        const signatures = new Set(
          group.map((r) =>
            JSON.stringify([r.quantity, Math.round(r.unitPrice * 100)]),
          ),
        );
        if (signatures.size > 1) {
          conflicts++;
          group.forEach((r) =>
            output.push({ ...r, amount: sum([r]), status: "review" }),
          );
        } else
          group.forEach((r, index) => {
            if (index) duplicates++;
            output.push({
              ...r,
              amount: sum([r]),
              status: index ? "duplicate" : "checked",
            });
          });
      }
      output.sort((a, b) => a.line - b.line);
      return {
        rows: output,
        inputCount: rows.length,
        duplicates,
        conflicts,
        gross: sum(rows),
        checked: sum(output.filter((r) => r.status === "checked")),
      };
    }
    if (kind === "reconcile") {
      const output = rows.map((r) => {
        if (![r.source, r.report].every(Number.isFinite))
          throw new RangeError("Invalid amount");
        const difference =
          (Math.round(r.report * 100) - Math.round(r.source * 100)) / 100;
        return { ...r, difference, review: Math.abs(difference) > threshold };
      });
      return {
        rows: output,
        difference:
          output.reduce((sum, r) => sum + Math.round(r.difference * 100), 0) /
          100,
        reviewCount: output.filter((r) => r.review).length,
      };
    }
    if (kind === "performance") {
      const keys = ["daxMs", "displayMs", "otherMs"];
      const output = rows
        .map((r) => {
          if (!keys.every((k) => Number.isFinite(r[k]) && r[k] >= 0))
            throw new RangeError("Invalid measurement");
          const duration = keys.reduce((sum, k) => sum + r[k], 0),
            maximum = Math.max(...keys.map((k) => r[k]));
          return {
            ...r,
            duration,
            dominant: keys.filter((k) => r[k] === maximum),
            review: duration > threshold,
          };
        })
        .sort(
          (a, b) => b.duration - a.duration || a.visual.localeCompare(b.visual),
        );
      return {
        rows: output,
        first: output.find((r) => r.review)?.visual || null,
        reviewCount: output.filter((r) => r.review).length,
      };
    }
    throw new RangeError("Invalid demonstration");
  }
  function csv(rows) {
    if (!rows.length) return "";
    const keys = Object.keys(rows[0]);
    const cell = (value) => {
      let s = Array.isArray(value) ? value.join(" + ") : String(value ?? "");
      if (/^[=+@\-\t\r]/.test(s) && typeof value !== "number") s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    };
    return (
      [keys, ...rows.map((r) => keys.map((k) => r[k]))]
        .map((row) => row.map(cell).join(","))
        .join("\r\n") + "\r\n"
    );
  }
  function mount() {
    const root = document.querySelector("[data-problem-kind]");
    if (!root) return;
    const $ = (s) => document.querySelector(s),
      t = DeckI18n.t,
      kind = root.dataset.problemKind,
      slug = root.dataset.problemSlug;
    const localePath = (locale) =>
      "/problemas/" + slug + "/" + (locale === "pt" ? "" : locale + "/");
    const params = new URL(location.href).searchParams;
    const state = {
      scenario: /^[0-2]$/.test(params.get("sample") || "")
        ? Number(params.get("sample"))
        : 0,
      threshold: kind === "performance" ? 1000 : 0,
    };
    if (
      params.has("limit") &&
      params.get("limit").trim() !== "" &&
      Number.isFinite(Number(params.get("limit"))) &&
      Number(params.get("limit")) >= 0 &&
      Number(params.get("limit")) <= 10000
    )
      state.threshold = Number(params.get("limit"));
    const targetURL = (locale) => {
      const url = new URL(localePath(locale), location.origin);
      url.searchParams.set("lang", locale);
      url.searchParams.set("sample", String(state.scenario));
      if (kind !== "orders")
        url.searchParams.set("limit", String(state.threshold));
      url.hash = location.hash;
      return url.pathname + url.search + url.hash;
    };
    if (document.documentElement.dataset.problemLocale !== DeckI18n.locale) {
      location.replace(targetURL(DeckI18n.locale));
      return;
    }
    DeckI18n.onChange(async (next) => () => location.assign(targetURL(next)));
    document.querySelectorAll("[data-problem-link]").forEach((a) => {
      a.href =
        "/problemas/" +
        a.dataset.problemLink +
        "/" +
        (DeckI18n.locale === "pt" ? "" : DeckI18n.locale + "/") +
        "?lang=" +
        DeckI18n.locale;
    });
    $("#sample").value = String(state.scenario);
    if ($("#limit")) $("#limit").value = String(state.threshold);
    const nf = new Intl.NumberFormat(DeckI18n.intlLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const integer = new Intl.NumberFormat(DeckI18n.intlLocale, {
      maximumFractionDigits: 2,
    });
    const labels = {
      checked: "Conferido",
      duplicate: "Duplicata exata",
      review: "Revisão manual",
      daxMs: "Consulta DAX",
      displayMs: "Exibição",
      otherMs: "Outras etapas",
    };
    const table = (headers, rows) =>
      `<table><thead><tr>${headers.map((h) => `<th scope="col">${esc(t(h))}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => "<tr>" + row.map((v, i) => (i === 0 ? `<th scope="row">${esc(v)}</th>` : `<td>${esc(v)}</td>`)).join("") + "</tr>").join("")}</tbody></table>`;
    let reference, csvRows;
    function run(announce = false) {
      const limit = $("#limit");
      if (
        limit &&
        (limit.value.trim() === "" ||
          !Number.isFinite(Number(limit.value)) ||
          Number(limit.value) < 0 ||
          Number(limit.value) > 10000)
      ) {
        $("#demo-status").textContent = t("Informe um valor entre 0 e 10000.");
        $("#download-json").disabled = $("#download-csv").disabled = true;
        return;
      }
      state.scenario = Number($("#sample").value);
      state.threshold = limit ? Number(limit.value) : 0;
      const rows = samples(kind, state.scenario),
        result = calculate(kind, rows, state.threshold);
      let input, output, metrics;
      if (kind === "orders") {
        input = table(
          ["Pedido", "Item", "Quantidade", "Preço unitário"],
          rows.map((r) => [
            r.order,
            r.item,
            r.quantity,
            nf.format(r.unitPrice),
          ]),
        );
        output = table(
          ["Pedido", "Item", "Valor", "Situação"],
          result.rows.map((r) => [
            r.order,
            r.item,
            nf.format(r.amount),
            t(labels[r.status]),
          ]),
        );
        metrics = [
          ["Total conferido", nf.format(result.checked)],
          ["Total bruto da entrada", nf.format(result.gross)],
          ["Duplicatas exatas removidas", result.duplicates],
          ["Grupos em revisão", result.conflicts],
        ];
      } else if (kind === "reconcile") {
        input = table(
          ["Período", "Fonte", "Relatório"],
          rows.map((r) => [r.period, nf.format(r.source), nf.format(r.report)]),
        );
        output = table(
          ["Período", "Diferença", "Situação"],
          result.rows.map((r) => [
            r.period,
            nf.format(r.difference),
            t(r.review ? "Investigar" : "Dentro da tolerância"),
          ]),
        );
        metrics = [
          ["Diferença total", nf.format(result.difference)],
          ["Períodos para investigar", result.reviewCount],
        ];
      } else {
        input = table(
          [
            "Visual",
            "Consulta DAX (ms)",
            "Exibição (ms)",
            "Outras etapas (ms)",
          ],
          rows.map((r) => [
            r.visual,
            integer.format(r.daxMs),
            integer.format(r.displayMs),
            integer.format(r.otherMs),
          ]),
        );
        output = table(
          ["Visual", "Duração (ms)", "Componente dominante", "Situação"],
          result.rows.map((r) => [
            r.visual,
            integer.format(r.duration),
            r.dominant.map((k) => t(labels[k])).join(" + "),
            t(r.review ? "Investigar" : "Abaixo ou no limite"),
          ]),
        );
        metrics = [
          ["Primeiro visual a investigar", result.first || t("Nenhum")],
          ["Visuais acima do limite", result.reviewCount],
        ];
      }
      $("#demo-input").innerHTML = input;
      $("#demo-output").innerHTML = output;
      $("#demo-metrics").innerHTML = metrics
        .map(
          ([label, value]) =>
            `<div><dt>${esc(t(label))}</dt><dd>${esc(value)}</dd></div>`,
        )
        .join("");
      reference = {
        schema: 1,
        fictional: true,
        kind,
        scenario: state.scenario,
        threshold: state.threshold,
        input: rows,
        output: result,
      };
      const exportColumns =
        kind === "orders"
          ? [
              ["order", "Pedido"],
              ["item", "Item"],
              ["amount", "Valor"],
              ["status", "Situação"],
            ]
          : kind === "reconcile"
            ? [
                ["period", "Período"],
                ["source", "Fonte"],
                ["report", "Relatório"],
                ["difference", "Diferença"],
                ["review", "Situação"],
              ]
            : [
                ["visual", "Visual"],
                ["duration", "Duração (ms)"],
                ["dominant", "Componente dominante"],
                ["review", "Situação"],
              ];
      csvRows = result.rows.map((row) =>
        Object.fromEntries(
          exportColumns.map(([key, label]) => {
            let value = row[key];
            if (key === "status") value = t(labels[value]);
            if (key === "dominant")
              value = value.map((k) => t(labels[k])).join(" + ");
            if (key === "review")
              value = t(
                value
                  ? "Investigar"
                  : kind === "reconcile"
                    ? "Dentro da tolerância"
                    : "Abaixo ou no limite",
              );
            return [t(label), value];
          }),
        ),
      );
      $("#download-json").disabled = $("#download-csv").disabled = false;
      $("#demo-status").textContent = announce
        ? t("Amostra conferida. A tabela de saída foi atualizada.")
        : "";
      history.replaceState(null, "", targetURL(DeckI18n.locale));
    }
    $("#demo-form").onsubmit = (e) => {
      e.preventDefault();
      run(true);
    };
    $("#sample").onchange = () => run(true);
    if ($("#limit")) $("#limit").oninput = () => run(true);
    function save(name, body, type) {
      const url = URL.createObjectURL(new Blob([body], { type })),
        a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }
    $("#download-json").onclick = () =>
      save(
        slug + "-reference.json",
        JSON.stringify(reference, null, 2) + "\n",
        "application/json",
      );
    $("#download-csv").onclick = () =>
      save(
        slug + "-output.csv",
        "\uFEFF" + csv(csvRows),
        "text/csv;charset=utf-8",
      );
    $("#copy-task").onclick = async () => {
      try {
        await navigator.clipboard.writeText($("#task-text").textContent);
        $("#copy-status").textContent = t(
          "Pedido copiado. Substitua os campos entre colchetes pelos seus materiais autorizados.",
        );
      } catch {
        $("#copy-status").textContent = t(
          "Não foi possível copiar. Selecione o pedido abaixo e copie manualmente.",
        );
        $("#task-text").focus();
      }
    };
    run();
  }
  return { samples, calculate, csv, mount };
});
