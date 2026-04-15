(() => {
  const API_BASE = "http://localhost:3001/api";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
    return data;
  }

  function splitPipe(value) {
    return String(value || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function renderServiceCard(service) {
    const iconClass = escapeHtml(service.icon_class || "fa fa-cog");
    const title = escapeHtml(service.title || "");
    const problem = escapeHtml(service.problem || "");
    const target = escapeHtml(service.target_audience || "");
    const trust = escapeHtml(service.trust_reason || "");
    const features = splitPipe(service.features);

    return `
      <div class="col-lg-6 col-md-6 mb-4">
        <div class="service_card_modern">
          <div class="service_icon_modern">
            <i class="${iconClass}"></i>
          </div>
          <div class="service_content">
            <h4>${title}</h4>
            <p><strong>What problem it solves:</strong> ${problem}</p>
            <p><strong>Who it is for:</strong> ${target}</p>
            <p><strong>Why Vulcan is trusted:</strong> ${trust}</p>
            <ul class="service_features">
              ${features
                .map((f) => `<li><i class="fa fa-check"></i> ${escapeHtml(f)}</li>`)
                .join("")}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function renderCategorySection(category, index, services) {
    const bg = index % 2 !== 0 ? " bg-light" : "";
    const name = escapeHtml(category.name || "");
    const desc = escapeHtml(category.description || "");
    const cards = services
      .filter((s) => s.category === category.name)
      .map(renderServiceCard)
      .join("");

    return `
      <section class="work_area p_120${bg}">
        <div class="container">
          <div class="main_title text-center">
            <h2>${name}</h2>
            <p>${desc}</p>
          </div>
          <div class="row">
            ${cards || `<div class="col-12 text-center">No services found.</div>`}
          </div>
        </div>
      </section>
    `;
  }

  function renderCta(cta) {
    const wrap = document.getElementById("servicesCta");
    if (!wrap) return;
    if (!cta) {
      wrap.style.display = "none";
      return;
    }

    wrap.querySelector("[data-cta-title]").textContent = cta.title || "";
    wrap.querySelector("[data-cta-description]").textContent = cta.description || "";

    const b1 = wrap.querySelector("[data-cta-btn1]");
    const b2 = wrap.querySelector("[data-cta-btn2]");
    const norm =
      typeof window.normalizeStaticPageHref === "function"
        ? window.normalizeStaticPageHref
        : (h) => h || "#";
    b1.href = cta.button1_link ? norm(String(cta.button1_link)) : "#";
    b1.textContent = cta.button1_text || "Continue";
    b2.href = cta.button2_link ? norm(String(cta.button2_link)) : "#";
    b2.textContent = cta.button2_text || "Learn more";
  }

  async function renderServicesPage() {
    const mount = document.getElementById("servicesCategoriesMount");
    if (!mount) return;

    mount.innerHTML = `<section class="work_area p_120"><div class="container"><div class="text-center">Loading…</div></div></section>`;

    try {
      const { services, categories, cta } = await fetchJson(`${API_BASE}/services-page`);
      mount.innerHTML = (categories || [])
        .map((cat, idx) => renderCategorySection(cat, idx, services || []))
        .join("");
      renderCta(cta);
    } catch (e) {
      console.error(e);
      mount.innerHTML = `<section class="work_area p_120"><div class="container"><div class="text-center">Failed to load services.</div></div></section>`;
    }
  }

  renderServicesPage();
})();

