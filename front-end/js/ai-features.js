async function loadAiFeatures() {
  try {
    const mount = document.getElementById("aiFeaturesMount");
    if (!mount) return;

    const res = await fetch("http://localhost:3001/api/ai-features", {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return;

    const data = await res.json();
    const features = Array.isArray(data?.features) ? data.features : [];
    if (features.length === 0) return;

    mount.innerHTML = features
      .map((f) => {
        const img = f?.image ?? "";
        const title = f?.title ?? "";
        const desc = f?.description ?? "";

        return `
          <div class="ai-card">
            <img src="${escapeAttr(img)}" class="ai-image">
            <h5>${escapeHtml(title)}</h5>
            <p>${escapeHtml(desc)}</p>
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
  // for src attribute; keep it simple/safe
  return String(value).replace(/\"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", loadAiFeatures);

