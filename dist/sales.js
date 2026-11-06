"use strict";
let salesStatus = { aiConfigured: false, leadsConfigured: false };
let contactDraft = {
  name: "",
  email: "",
  company: "",
  phone: "",
  consent: false,
};
let submission = null;
let aiRun = 0;
fetch("/api/status")
  .then((r) => (r.ok ? r.json() : Promise.reject()))
  .then((s) => {
    salesStatus = s;
  })
  .catch(() => {});
async function postJSON(path, data) {
  const r = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(22000),
  });
  const result = await r.json();
  if (!r.ok)
    throw new Error(
      result.error || "Não foi possível concluir. Tente novamente.",
    );
  return result;
}
const baseRenderTriage = renderTriage;
renderTriage = function () {
  baseRenderTriage();
  if (state.step === 2) {
    const form = $("#triage-step-two");
    form.insertAdjacentHTML(
      "beforeend",
      salesStatus.aiConfigured
        ? '<label class="check-label"><input type="checkbox" id="ai-consent">Quero analisar meu relato com IA. Autorizo o envio do desafio, ferramentas e resultado desejado à Groq para sugerir soluções.</label>'
        : '<p class="fine">Análise por temas disponível. A análise por IA ainda não foi ativada.</p>',
    );
    const saveSubmit = form.onsubmit;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const useAI = $("#ai-consent")?.checked === true;
      saveSubmit(e);
      if (!useAI) return;
      const run = ++aiRun;
      const snapshot = JSON.stringify({
        ...state.triage,
        audience: state.audience,
      });
      $("#triage-body").insertAdjacentHTML(
        "afterbegin",
        '<p class="ai-note" id="ai-loading" role="status">Analisando seu contexto com IA… Você já pode explorar as sugestões por temas.</p>',
      );
      try {
        const result = await postJSON("/api/triage", {
          context: JSON.parse(snapshot),
          aiConsent: true,
        });
        if (
          run !== aiRun ||
          snapshot !==
            JSON.stringify({ ...state.triage, audience: state.audience })
        )
          return;
        state.aiResult = result;
        if (state.step === 3 && $("#triage-dialog").open) renderTriage();
      } catch {
        if (run === aiRun && $("#ai-loading"))
          $("#ai-loading").textContent =
            "A IA não respondeu. As sugestões abaixo usam temas do catálogo.";
      }
    };
  }
};
const baseBrief = showBrief;
showBrief = function () {
  baseBrief();
  const chosen = SKILLS.filter((s) => selectedSkills.has(s.id));
  if (chosen.length) {
    $("#brief-body").insertAdjacentHTML(
      "beforeend",
      `<section class="skill-selected"><h3>Cartas selecionadas (${chosen.length})</h3>${chosen.map((s) => `<p>${esc(s.code)} · ${esc(s.title)}<button data-remove-skill="${esc(s.id)}">Remover</button></p>`).join("")}</section>`,
    );
    $$("[data-remove-skill]").forEach(
      (b) =>
        (b.onclick = () => {
          toggleSkill(b.dataset.removeSkill);
          showBrief();
        }),
    );
    $("#download-brief").disabled = false;
    $("#print-brief").disabled = false;
  }
  $("#brief-body").insertAdjacentHTML(
    "beforeend",
    `<form id="lead-form" class="lead-form"><h3>Enviar para a DriveData</h3><p>Compartilhe seu briefing para uma conversa sobre o projeto.</p><div class="field-grid"><div class="field"><label for="lead-name">Seu nome</label><input id="lead-name" name="name" required minlength="2" maxlength="100" autocomplete="name" value="${esc(contactDraft.name)}"></div><div class="field"><label for="lead-email">E-mail</label><input id="lead-email" name="email" required type="email" maxlength="254" autocomplete="email" value="${esc(contactDraft.email)}"></div></div><div class="field-grid"><div class="field"><label for="lead-company">Empresa ou equipe</label><input id="lead-company" name="company" required minlength="2" maxlength="150" autocomplete="organization" value="${esc(contactDraft.company)}"></div><div class="field"><label for="lead-phone">Telefone (opcional)</label><input id="lead-phone" name="phone" maxlength="40" autocomplete="tel" value="${esc(contactDraft.phone)}"></div></div><div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><label class="check-label"><input id="lead-consent" type="checkbox" required ${contactDraft.consent ? "checked" : ""}>Autorizo a DriveData a armazenar meu contato e briefing no Supabase e me contatar sobre esta solicitação. Não inclui inscrição em campanhas.</label><p class="fine">Envie apenas informações necessárias ao projeto. Para solicitar correção ou exclusão, use o contato da DriveData em <a href="https://drivedata.com.br" target="_blank" rel="noopener">drivedata.com.br</a>.</p><button class="btn primary" id="send-lead" type="submit">Enviar briefing ↗</button><p id="lead-status" class="lead-status" role="status"></p></form>`,
  );
  const saveContact = () => {
    for (const k of ["name", "email", "company", "phone"])
      contactDraft[k] = $("#lead-" + k).value;
    contactDraft.consent = $("#lead-consent").checked;
  };
  $("#lead-form").oninput = saveContact;
  $("#lead-form").onsubmit = async (e) => {
    e.preventDefault();
    saveContact();
    const status = $("#lead-status"),
      button = $("#send-lead");
    if (state.triage.pain.trim().length < 20) {
      status.textContent =
        "Complete a triagem com pelo menos 20 caracteres sobre seu desafio antes de enviar.";
      return;
    }
    const payload = {
      ...contactDraft,
      context: { ...state.triage, audience: state.audience },
      solutions: [...state.selected].sort(),
      skillIds: [...selectedSkills].sort(),
      website: new FormData(e.target).get("website") || "",
    };
    const serialized = JSON.stringify(payload);
    if (!submission || submission.content !== serialized)
      submission = { content: serialized, id: crypto.randomUUID() };
    button.disabled = true;
    status.textContent = "Enviando seu briefing…";
    try {
      const r = await postJSON("/api/leads", {
        ...payload,
        requestId: submission.id,
      });
      status.textContent =
        "Briefing recebido pela DriveData. Protocolo: " + r.reference;
      button.textContent = "Briefing enviado ✓";
    } catch (error) {
      status.textContent =
        error.name === "TimeoutError"
          ? "O envio demorou. Tente novamente; o mesmo pedido não será duplicado."
          : error.message;
      button.disabled = false;
    }
  };
};
$("#briefing-nav").onclick = () => showBrief();
const baseBuildBrief = buildBrief;
buildBrief = () =>
  baseBuildBrief() +
  "\n\nCARTAS SELECIONADAS\n" +
  SKILLS.filter((s) => selectedSkills.has(s.id))
    .map(
      (s) =>
        s.code +
        " | " +
        s.title +
        "\nCapacidades: " +
        s.deliverables.join("; "),
    )
    .join("\n\n");
