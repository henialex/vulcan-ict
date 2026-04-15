async function loadAboutFeatures() {
  try {
    const mount = document.getElementById("aboutFeaturesMount");
    if (!mount) return;

    const res = await fetch("http://localhost:3001/api/about-features", {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return;

    const data = await res.json();
    const features = Array.isArray(data?.features) ? data.features : [];
    if (features.length === 0) return;

    mount.innerHTML = features
      .map((f) => {
        const iconClass = f?.icon_class ? String(f.icon_class) : "fa fa-check-circle";
        const text = f?.feature_text ?? "";
        return `
          <div class="feature_item">
            <i class="${escapeAttr(iconClass)}"></i>
            <span>${escapeHtml(text)}</span>
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

document.addEventListener("DOMContentLoaded", loadAboutFeatures);

