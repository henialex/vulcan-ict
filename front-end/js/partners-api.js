(() => {
  const API_BASE = "http://localhost:3001/api";

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
    return data;
  }

  async function renderPartners() {
    const mount = document.getElementById("partnersMount");
    if (!mount) return;

    try {
      const { partners } = await fetchJson(`${API_BASE}/partners`);
      if (!partners || partners.length === 0) return;

      mount.innerHTML = partners
        .map((p) => {
          const name = escapeHtml(p.name);
          const type = escapeHtml(p.partner_type);
          const desc = escapeHtml(p.description);
          const logo = p.logo_image ? escapeHtml(p.logo_image) : "";
          const icon = p.icon_class ? escapeHtml(p.icon_class) : "";

          const logoHtml = logo
            ? `<img src="${logo}" alt="${name}">`
            : icon
              ? `<i class="${icon}"></i>`
              : `<span class="fa fa-building"></span>`;

          return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div class="partner_card">
                <div class="partner_logo ${name.toLowerCase().includes("bonanza") ? "bonanza_logo" : ""}">
                  ${logoHtml}
                </div>
                <div class="partner_content">
                  <h5>${name}</h5>
                  <p class="partner_type">${type}</p>
                  <p class="partner_desc">${desc}</p>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    } catch (e) {
      console.error("partners render failed", e);
    }
  }

  renderPartners();
})();

