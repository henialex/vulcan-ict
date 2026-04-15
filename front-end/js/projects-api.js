(() => {
  const API_BASE = "http://localhost:3001/api";
  const BACKEND_BASE = "http://localhost:3001";

  function resolveAssetUrl(input) {
    const raw = String(input || "").trim();
    if (!raw) return "";
    if (/^(https?:)?\/\//i.test(raw)) return raw;
    if (/^(data:|blob:)/i.test(raw)) return raw;

    // Front-end static assets
    if (
      raw.startsWith("img/") ||
      raw.startsWith("css/") ||
      raw.startsWith("vendors/") ||
      raw.startsWith("/img/") ||
      raw.startsWith("/css/") ||
      raw.startsWith("/vendors/")
    ) {
      if (raw.startsWith("/")) return raw.slice(1);
      return raw;
    }

    // If it's a plain filename (common for multer uploads), assume /uploads/projects on backend.
    if (/^[^/]+\.(png|jpe?g|webp|gif|svg)$/i.test(raw)) {
      return `${BACKEND_BASE}/uploads/projects/${raw}`;
    }

    // Backend-served assets (uploads, etc.)
    if (raw.startsWith("/uploads") || raw.startsWith("/public") || raw.startsWith("/images")) {
      return `${BACKEND_BASE}${raw}`;
    }
    if (raw.startsWith("uploads/") || raw.startsWith("public/") || raw.startsWith("images/")) {
      return `${BACKEND_BASE}/${raw}`;
    }

    if (raw.startsWith("/")) return `${BACKEND_BASE}${raw}`;
    return raw;
  }

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

  /**
   * Project cards are rendered on the static front-end. DB links often point at
   * the API origin (e.g. http://localhost:3001/success-story-ecta.html), which
   * Express does not serve as a static file → "Cannot GET". Rewrite those to
   * same-directory .html names used by the static site.
   */
  /**
   * Same ordering as back-end projectsApiController (ECTA → Enterprise → BunaLink → Lumos).
   * Applied here so the home page order updates even if the API server was not restarted.
   * BunaLink titles include "enterprise" — check bunalink before generic enterprise.
   */
  function homePageProjectSortKey(project) {
    const t = String(project.title || "").toLowerCase();
    if (t.includes("ecta") || t.includes("ethiopian coffee")) return 0;
    if (t.includes("bunalink")) return 2;
    if (t.includes("lumos")) return 3;
    if (t.includes("enterprise")) return 1;
    return 100;
  }

  function sortHomePageProjects(projects) {
    return [...projects].sort(
      (a, b) =>
        homePageProjectSortKey(a) - homePageProjectSortKey(b) ||
        (Number(a.id) || 0) - (Number(b.id) || 0)
    );
  }

  function layoutTypeNorm(p) {
    return String(p.layout_type ?? "")
      .trim()
      .toLowerCase();
  }

  function normalizeButtonLink(href) {
    const raw = String(href || "").trim();
    if (!raw) return raw;
    if (/^(mailto:|tel:|#)/i.test(raw)) return raw;

    const [pathPart0, ...queryParts] = raw.split("?");
    const query = queryParts.length ? `?${queryParts.join("?")}` : "";

    let pathOnly = pathPart0.trim();
    if (/^https?:\/\//i.test(pathOnly)) {
      try {
        const u = new URL(pathOnly);
        const isLocalApi =
          (u.hostname === "localhost" || u.hostname === "127.0.0.1") &&
          u.port === "3001";
        if (!isLocalApi) return raw;
        pathOnly = u.pathname || "/";
      } catch {
        return raw;
      }
    } else if (/^\/\//.test(pathOnly)) {
      return raw;
    }

    const path = pathOnly.replace(/\/$/, "") || "/";

    if (path.endsWith(".html")) {
      const file = path.startsWith("/") ? path.slice(1) : path;
      return file + query;
    }

    const map = new Map([
      ["/", "index.html"],
      ["/contact", "contact.html"],
      ["/services", "services.html"],
      ["/about", "about-us.html"],
      ["/ai-solutions", "ai-solutions.html"],
      ["/insights", "insights.html"],
      ["/success-story-ecta", "success-story-ecta.html"],
    ]);

    if (map.has(path)) return map.get(path) + query;
    if (path.startsWith("/")) {
      return path.slice(1) + ".html" + query;
    }
    if (!path.includes("/")) {
      return path + ".html" + query;
    }
    return raw;
  }

  function renderFeatured(project) {
    const title = escapeHtml(project.title || "");
    const client = escapeHtml(project.client || "");
    const scope = escapeHtml(project.scope || "");
    const description = escapeHtml(project.description || "");
    const image = resolveAssetUrl(project.image || "");
    const tags = splitPipe(project.tech_tags);
    const features = splitPipe(project.features);
    const impactItems = splitPipe(project.impact_items);
    const impactIcons = splitPipe(project.impact_icons);

    return `
      <div class="col-lg-6 mb-4">
        <div class="project_card featured">
          <div class="project_image">
            ${image ? `<img src="${escapeHtml(image)}" alt="${title}" class="project_case_image">` : ""}
            <div class="project_overlay">
              <div class="project_tech">
                ${tags.map((t) => `<span class="tech_tag">${escapeHtml(t)}</span>`).join("")}
              </div>
            </div>
          </div>

          <div class="project_content">
            <h4>${title}</h4>
            ${(client || scope)
              ? `<p class="project_type">${
                  client ? `<strong>Client:</strong> ${client}` : ""
                }${client && scope ? " | " : ""}${
                  scope ? `<strong>Scope:</strong> ${scope}` : ""
                }</p>`
              : ""}
            <p class="project_description">${description}</p>

            ${
              project.button_text && project.button_link
                ? `<div class="mt-3"><a href="${escapeHtml(
                    normalizeButtonLink(project.button_link)
                  )}" class="main_btn_light">${escapeHtml(project.button_text)}</a></div>`
                : ""
            }

            ${
              project.tech_approach
                ? `<div class="project_approach"><h5>Technology Approach</h5><p>${escapeHtml(
                    project.tech_approach
                  )}</p></div>`
                : ""
            }

            <div class="project_features">
              ${features
                .map(
                  (f) =>
                    `<span class="feature_item"><i class="fa fa-check"></i> ${escapeHtml(f)}</span>`
                )
                .join("")}
            </div>

            <div class="project_impact">
              ${impactItems
                .map((item, idx) => {
                  const icon = impactIcons[idx] ? escapeHtml(impactIcons[idx]) : "fa fa-globe";
                  return `<div class="impact_item"><i class="${icon}"></i><span>${escapeHtml(
                    item
                  )}</span></div>`;
                })
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderWide(project) {
    const title = escapeHtml(project.title || "");
    const client = escapeHtml(project.client || "");
    const scope = escapeHtml(project.scope || "");
    const description = escapeHtml(project.description || "");
    const image = resolveAssetUrl(project.image || "");
    const tags = splitPipe(project.tech_tags);
    const modules = splitPipe(project.modules);
    const moduleIcons = splitPipe(project.module_icons);
    const features = splitPipe(project.features);
    const featureIcons = splitPipe(project.feature_icons);
    const cardClass = (project.title || "").includes("BunaLink") ? "bunalink" : "lumos";

    return `
      <div class="row mb-5">
        <div class="col-12">
          <div class="project_card ${cardClass}">
            <div class="row align-items-center">
              <div class="col-lg-4">
                <div class="project_image">
                  ${image ? `<img src="${escapeHtml(image)}" alt="${title}" class="project_case_image">` : ""}
                  <div class="project_overlay">
                    <div class="project_tech">
                      ${tags
                        .map((t) => `<span class="tech_tag">${escapeHtml(t)}</span>`)
                        .join("")}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-8">
                <div class="project_content">
                  <h4>${title}</h4>
                  ${(client || scope)
                    ? `<p class="project_type">${
                        client ? `<strong>Client:</strong> ${client}` : ""
                      }${client && scope ? " | " : ""}${
                        scope ? `<strong>Scope:</strong> ${scope}` : ""
                      }</p>`
                    : ""}
                  <p class="project_description">${description}</p>

                  ${
                    modules.length
                      ? `<div class="project_modules">
                          ${modules
                            .map((m, idx) => {
                              const icon = moduleIcons[idx]
                                ? escapeHtml(moduleIcons[idx])
                                : "fa fa-check";
                              return `<div class="module_item"><i class="${icon}"></i><span>${escapeHtml(
                                m
                              )}</span></div>`;
                            })
                            .join("")}
                        </div>`
                      : ""
                  }

                  ${
                    features.length
                      ? `<div class="project_features_lumos">
                          ${features
                            .map((f, idx) => {
                              const icon = featureIcons[idx]
                                ? escapeHtml(featureIcons[idx])
                                : "fa fa-check";
                              return `<div class="feature_item_lumos"><i class="${icon}"></i><span>${escapeHtml(
                                f
                              )}</span></div>`;
                            })
                            .join("")}
                        </div>`
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async function renderHomeProjects() {
    const featuredMount = document.getElementById("projectsFeatured");
    const wideMount = document.getElementById("projectsWide");
    if (!featuredMount || !wideMount) return;

    try {
      const { projects } = await fetchJson(`${API_BASE}/projects`);
      const ordered = sortHomePageProjects(projects || []);

      const featured = ordered.filter((p) => layoutTypeNorm(p) === "featured").slice(0, 2);
      const wide = ordered.filter((p) => layoutTypeNorm(p) === "wide");

      if (featured.length === 0 && wide.length === 0) return;

      featuredMount.innerHTML = featured.map(renderFeatured).join("");
      wideMount.innerHTML = wide.map(renderWide).join("");

      // hide old hardcoded section if present
      const fallback = document.getElementById("projectsFallback");
      if (fallback) fallback.style.display = "none";
    } catch (e) {
      console.error(e);
    }
  }

  renderHomeProjects();
})();

