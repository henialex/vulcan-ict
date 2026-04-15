async function loadServiceProcessSteps() {
  try {
    const mount = document.getElementById("serviceProcessStepsMount");
    if (!mount) return;

    const [stepsRes, featuresRes] = await Promise.all([
      fetch("http://localhost:3001/api/service-process-steps", {
        headers: { Accept: "application/json" },
      }),
      fetch("http://localhost:3001/api/service-process-features", {
        headers: { Accept: "application/json" },
      }),
    ]);

    if (!stepsRes.ok) return;

    const stepsData = await stepsRes.json();
    const steps = Array.isArray(stepsData?.steps) ? stepsData.steps : [];
    if (steps.length === 0) return;

    const featuresByStepId = new Map();
    if (featuresRes.ok) {
      const featuresData = await featuresRes.json();
      const features = Array.isArray(featuresData?.features)
        ? featuresData.features
        : [];

      for (const f of features) {
        const stepId = f?.process_step_id;
        if (!stepId) continue;
        const arr = featuresByStepId.get(stepId) || [];
        arr.push(f);
        featuresByStepId.set(stepId, arr);
      }
    }

    mount.innerHTML = steps
      .map((s, idx) => {
        const stepNumber = s?.step_number ?? String(idx + 1).padStart(2, "0");
        const iconClass = s?.icon_class ? String(s.icon_class) : "fa fa-check";
        const title = s?.title ?? "";
        const desc = s?.description ?? "";
        const hasConnector = idx < steps.length - 1;
        const featureTags = (featuresByStepId.get(s?.id) || [])
          .map((f) => f?.feature_text)
          .filter(Boolean);

        const featuresHtml =
          featureTags.length > 0
            ? `
              <div class="process_features">
                ${featureTags
                  .map(
                    (t) =>
                      `<span class="feature_tag">${escapeHtml(t)}</span>`
                  )
                  .join("")}
              </div>
            `
            : "";

        return `
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="process_card_map">
              ${hasConnector ? '<div class="process_connector_right"></div>' : ""}
              <div class="process_number_map">${escapeHtml(stepNumber)}</div>
              <div class="process_icon_map">
                <i class="${escapeAttr(iconClass)}"></i>
              </div>
              <h4>${escapeHtml(title)}</h4>
              <p>${escapeHtml(desc)}</p>
              ${featuresHtml}
            </div>
          </div>
        `;
      })
      .join("");
  } catch (_) {
    // ignore (page should still render)
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return String(value).replace(/[^a-zA-Z0-9 _-]/g, "");
}

document.addEventListener("DOMContentLoaded", loadServiceProcessSteps);

