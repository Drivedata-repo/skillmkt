"use strict";
window.DeckEvolution = (() => {
  const esc = (s) => DeckArt.esc(s),
    t = (s, p) => DeckI18n.t(s, p);
  function compatibility(s) {
    const a = s.compatibilityAssessment;
    if (!a) return "";
    return `<section class="compatibility-panel ${a.blocking ? "is-blocked" : ""}"><div class="evidence-heading"><h3>${esc(t("No seu ambiente"))}</h3><span>${esc(a.label)}</span></div><p>${esc(a.summary)}</p>${a.requirements.length ? `<ul class="requirements-list">${a.requirements.map((r) => `<li><span>${esc(r.label)}</span><strong>${esc(t(r.availability === "available" ? "Você informou que tem" : r.availability === "unavailable" ? "Você informou que não tem" : "A confirmar"))}</strong></li>`).join("")}</ul>` : ""}<p class="fine">${esc(a.evidence.note)}</p><button class="text-button" data-detail-tab="start">${esc(t("Conferir instalação"))}</button></section>`;
  }
  function lab(s) {
    const l = s.lab;
    if (!l) return "";
    return `<section class="lab-panel"><div class="evidence-heading"><h3>${esc(t("Laboratório da carta"))}</h3><span>${esc(l.label)}</span></div><p>${esc(l.notice)}</p><dl class="lab-evidence"><div><dt>${esc(t("Execução por assistente"))}</dt><dd>${esc(l.executionLabel)}</dd></div><div><dt>${esc(t("Critério de aprovação"))}</dt><dd>${esc(l.scenario.check)}</dd></div></dl>${(l.assistantSamples || []).map((sample, index) => assistantSample(s, sample, index)).join("")}${deliverables(l)}${l.reference ? `<details><summary>${esc(t("Ver evidência reproduzível"))}</summary><p>${esc(t("Esta verificação executa o cálculo de referência com dados fictícios. Não executa a skill no assistente."))}</p><p>${esc(t("Resultado da verificação"))}: <strong>${esc(t(l.reference.passed ? "Aprovado" : "Requer revisão"))}</strong></p><p class="fine">${esc(l.reference.runtime || "Node.js")} · ${esc(l.reference.method)}</p><div class="sample-actions">${(l.reference.artifacts || []).map((a, i) => `<button class="text-button" data-lab-artifact="${esc(s.id)}" data-artifact-index="${i}">${esc(t(i === 0 ? "Baixar entrada" : "Baixar saída de referência"))}</button>`).join("")}</div></details>` : ""}<button class="text-button" data-eval-kit="${esc(s.id)}">${esc(t("Baixar roteiro de avaliação"))}</button></section>`;
  }
  function assistantSample(s, sample, index) {
    return `<details class="assistant-evidence"><summary>${esc(t("Ver amostra executada por assistente"))}</summary><p>${esc(sample.scopeLabel)}</p><p class="fine">${esc(sample.runtime)} · v${esc(sample.version)} · ${esc(new Intl.DateTimeFormat(DeckI18n.intlLocale, { dateStyle: "medium" }).format(new Date(sample.finishedAt)))}</p><p>${esc(sample.modelLabel)}</p><p>${esc(sample.limitation)}</p><ul>${sample.checks.map((check) => `<li>${esc(check.label)} — ${esc(t(check.passed ? "Aprovado" : "Requer revisão"))}</li>`).join("")}</ul><p class="fine">${esc(t("Os dados do ensaio permanecem no idioma original para preservar a evidência."))}</p><h4>${esc(t("Entrada do ensaio"))}</h4><pre>${esc(JSON.stringify(sample.input, null, 2))}</pre><h4>${esc(t("Saída observada"))}</h4><pre>${esc(JSON.stringify(sample.output, null, 2))}</pre><div class="sample-actions">${sample.artifacts.map((a, i) => `<button class="text-button" data-assistant-artifact="${esc(s.id)}" data-sample-index="${index}" data-artifact-index="${i}">${esc(t(["Baixar entrada", "Baixar saída observada", "Baixar evidência do ensaio"][i] || "Baixar evidência do ensaio"))}</button>`).join("")}</div></details>`;
  }
  function deliverables(l) {
    const samples = l.deliverableSamples || [],
      readiness = l.deliverableReadiness || [];
    return (
      samples
        .map(
          (sample) =>
            `<details class="assistant-evidence"><summary>${esc(t("Ver entrega produzida por assistente"))}</summary><h4>${esc(sample.title)}</h4><p>${esc(sample.scope)}</p><p class="fine">${esc(sample.runtime)} · v${esc(sample.version)} · ${esc(sample.modelLabel)}</p><ul>${sample.checks.map((c) => `<li>${esc(c.label)} — ${esc(t(c.passed ? "Aprovado" : "Requer revisão"))}</li>`).join("")}</ul><p>${esc(t("O selo se refere a este cenário, arquivo e ambiente. Não representa todos os usos da skill."))}</p><ul>${sample.limitations.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><div class="sample-actions">${sample.artifacts.map((a) => `<a class="text-button" href="${esc(a.url)}" download="${esc(a.filename)}">${esc(a.label)}</a>`).join("")}</div></details>`,
        )
        .join("") +
      readiness
        .filter((r) => !samples.some((s) => s.caseId === r.caseId))
        .map(
          (r) =>
            `<details class="assistant-evidence"><summary>${esc(t("Ver cenário e critérios preparados"))}</summary><h4>${esc(r.title)}</h4><p><strong>${esc(r.statusLabel)}</strong></p><p>${esc(r.scope)}</p><h4>${esc(t("Materiais e requisitos"))}</h4><ul>${r.prerequisites.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><h4>${esc(t("Critério de aprovação"))}</h4><ul>${r.checks.map((c) => `<li>${esc(c.label)}</li>`).join("")}</ul><p>${esc(t("Ainda sem entregável produzido e conferido neste ensaio."))}</p><ul>${r.limitations.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>`,
        )
        .join("")
    );
  }
  const help = {
    recognition: {
      label: "A skill não apareceu",
      steps: [
        "Confira se SKILL.md está dentro da pasta da skill, sem uma pasta ZIP extra envolvendo tudo.",
        "Use a pasta do assistente escolhido e abra um novo chat para conferir o reconhecimento.",
        "Peça ao assistente para informar se encontrou a skill pelo identificador. Não considere uma resposta genérica como prova de instalação.",
      ],
    },
    dependency: {
      label: "Falta uma ferramenta",
      steps: [
        "Compare a mensagem de erro com os requisitos desta carta.",
        "Confira no assistente se a ferramenta está conectada e se sua conta tem acesso ao recurso.",
        "Se o acesso não existir, volte à triagem e marque a ferramenta como indisponível para buscar outra opção.",
      ],
    },
    "different-result": {
      label: "O resultado saiu diferente",
      steps: [
        "Use uma cópia pequena e anonimizada dos dados para reproduzir a diferença.",
        "Compare o resultado com o critério da missão e identifique a primeira divergência.",
        "Envie ao assistente o esperado, o observado e a regra que deve permanecer. Confira novamente antes de substituir o arquivo.",
      ],
    },
    unclear: {
      label: "Não sei como começar",
      steps: [
        "Abra a missão prática desta carta e leia a entrada e a entrega esperada.",
        "Substitua os marcadores do comando pelos seus dados e confirme o que precisa entregar.",
        "Comece com uma amostra pequena. Use a conferência da carta para decidir se o resultado atende à tarefa.",
      ],
    },
    incompatible: {
      label: "Meu assistente não é compatível",
      steps: [
        "Confira o ambiente de origem e as ferramentas mencionadas na ficha da carta.",
        "Uma skill orienta o assistente, mas não instala os conectores nem concede permissões.",
        "Escolha seu assistente e informe as ferramentas indisponíveis na triagem para revisar a indicação.",
      ],
    },
  };
  function support(s, issue = "recognition") {
    const h = help[issue] || help.recognition;
    return `<section class="support-panel"><p class="fine">${esc(s.code)} · ${esc(s.id)}</p><h3>${esc(t("Vamos destravar o primeiro uso."))}</h3><p>${esc(t("Escolha o que aconteceu. A orientação considera esta carta e seus requisitos."))}</p><div class="support-choices">${Object.entries(
      help,
    )
      .map(
        ([id, x]) =>
          `<button class="btn secondary" data-help-issue="${id}" aria-pressed="${id === issue}">${esc(t(x.label))}</button>`,
      )
      .join(
        "",
      )}</div><h4>${esc(t(h.label))}</h4><ol>${h.steps.map((x) => `<li>${esc(t(x))}</li>`).join("")}</ol><h4>${esc(t("Requisitos desta carta"))}</h4><ul>${s.dependencies.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><button class="btn" data-copy-help="${esc(s.id)}" data-issue="${issue}">${esc(t("Copiar pedido de ajuda contextualizado"))}</button><p class="fine">${esc(t("Preencha o esperado e o observado. Remova dados pessoais e segredos antes de compartilhar."))}</p></section>${feedback(s, issue)}`;
  }
  function helpPrompt(s, issue) {
    return [
      t("Preciso de ajuda com a skill {id}, versão {version}.", {
        id: s.id,
        version: s.version,
      }),
      t(help[issue]?.label || help.recognition.label),
      t("Requisitos desta carta") + ": " + s.dependencies.join("; "),
      t(
        "Esperado: [descreva a entrega]. Observado: [descreva o erro ou a diferença]. Ambiente: [assistente e ferramentas].",
      ),
      t(
        "Identifique a causa com as evidências disponíveis. Se faltar informação, peça somente o necessário para o próximo passo. Não invente acesso a ferramentas.",
      ),
      s.universe.boundary,
    ].join("\n\n");
  }
  function feedback(s, issue = "none") {
    return `<form class="skill-feedback" data-feedback-form="${esc(s.id)}"><h3>${esc(t("Esta carta ajudou?"))}</h3><label>${esc(t("Resultado do seu uso"))}<select name="outcome" required><option value="">${esc(t("Selecione uma resposta"))}</option><option value="resolved">${esc(t("Resolvi minha tarefa"))}</option><option value="partial">${esc(t("Ajudou parcialmente"))}</option><option value="not-fit">${esc(t("Não serviu para esta tarefa"))}</option></select></label><label>${esc(t("Principal dificuldade"))}<select name="reason">${[["none", "Nenhuma"], ...Object.entries(help).map(([id, x]) => [id, x.label]), ["out-of-scope", "A tarefa ficou fora do escopo"]].map(([id, label]) => `<option value="${id}" ${issue === id ? "selected" : ""}>${esc(t(label))}</option>`).join("")}</select></label><label class="check-line"><input type="checkbox" name="consent" required>${esc(t("Enviar esta avaliação sem meu relato, arquivos ou dados de contato."))}</label><p class="fine">${esc(t("Registramos a carta, a versão atual, as opções escolhidas, o idioma e uma identificação não reversível da sessão. Uma resposta por carta nesta sessão."))}</p><button class="btn secondary" type="submit">${esc(t("Enviar avaliação"))}</button><p class="feedback-status" role="status"></p></form>`;
  }
  function plan(p, skills) {
    if (!p) return "";
    return `<section class="personal-plan"><div class="evidence-heading"><h3>${esc(p.title)}</h3><span>${esc(t("{count} etapas", { count: p.steps.length }))}</span></div><p>${esc(p.rationale)}</p><ol>${p.steps
      .map((step) => {
        const s = skills.find((s) => s.id === step.skillId);
        return s
          ? `<li><span class="plan-number">${step.order}</span><div><small>${esc(s.code)}</small><h4>${esc(s.title)}</h4><p>${esc(step.rationale)}</p><dl><dt>${esc(t("Recebe"))}</dt><dd>${esc(step.input)}</dd><dt>${esc(t("Entrega para a próxima etapa"))}</dt><dd>${esc(step.output)}</dd></dl><button class="text-button" data-start="${esc(s.id)}">${esc(t("Abrir etapa"))}</button></div></li>`
          : "";
      })
      .join(
        "",
      )}</ol><p class="fine">${esc(p.notice)}</p><button class="btn secondary" data-save-plan>${esc(t("Adicionar este plano ao Meu Deck"))}</button><button class="text-button" data-export-plan>${esc(t("Baixar roteiro"))}</button></section>`;
  }
  return { compatibility, lab, support, helpPrompt, feedback, plan };
})();
