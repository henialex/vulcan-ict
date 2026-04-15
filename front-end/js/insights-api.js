(() => {
  const API_BASE = "http://localhost:3001/api";
  const BACKEND_BASE = "http://localhost:3001";

  function resolveAssetUrl(input) {
    const raw = String(input || "").trim();
    if (!raw) return "";
    if (/^(https?:)?\/\//i.test(raw)) return raw;
    if (/^(data:|blob:)/i.test(raw)) return raw;

    // Front-end static assets live relative to the HTML pages
    if (
      raw.startsWith("img/") ||
      raw.startsWith("css/") ||
      raw.startsWith("vendors/") ||
      raw.startsWith("/img/") ||
      raw.startsWith("/css/") ||
      raw.startsWith("/vendors/")
    ) {
      // turn "/img/foo.jpg" into "img/foo.jpg" so it works on file:// and static servers
      if (raw.startsWith("/")) return raw.slice(1);
      return raw;
    }

    // Backend-served assets (uploads, etc.)
    if (raw.startsWith("/uploads") || raw.startsWith("/public") || raw.startsWith("/images")) {
      return `${BACKEND_BASE}${raw}`;
    }
    if (raw.startsWith("uploads/") || raw.startsWith("public/") || raw.startsWith("images/")) {
      return `${BACKEND_BASE}/${raw}`;
    }

    // If it's a root-relative path but not a known front-end asset folder, assume backend.
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
    if (!res.ok) {
      throw new Error(data.error || `Request failed: ${res.status}`);
    }
    return data;
  }

  async function renderInsightsList() {
    const mount = document.getElementById("insightsList");
    if (!mount) return;

    mount.innerHTML = `<div class="col-12 text-center">Loading…</div>`;

    try {
      const { insights } = await fetchJson(`${API_BASE}/insights`);

      if (!insights || insights.length === 0) {
        mount.innerHTML = `<div class="col-12 text-center">No insights available yet.</div>`;
        return;
      }

      mount.innerHTML = insights
        .map((item) => {
          const tag = escapeHtml(item.tag || "Insight");
          const year = escapeHtml(item.year || item.date_label || "");
          const title = escapeHtml(item.title || "");
          const excerpt = escapeHtml(item.excerpt || "");
          const thumb = resolveAssetUrl(item.thumbnail_image || item.hero_image || "");
          const slug = encodeURIComponent(item.slug || "");

          return `
            <div class="col-lg-4 col-md-6 mb-4">
              <div class="insights_card">
                <div class="insights_meta">
                  <span class="insights_tag">${tag}</span>
                  <span>${year}</span>
                </div>
                ${
                  thumb
                    ? `<img src="${escapeHtml(thumb)}" alt="${title}" class="insights_thumb mb-3">`
                    : ""
                }
                <h4>${title}</h4>
                <p>${excerpt}</p>
                <a class="text_link" href="single-blog.html?post=${slug}">Read full update</a>
              </div>
            </div>
          `;
        })
        .join("");
    } catch (e) {
      console.error(e);
      mount.innerHTML = `<div class="col-12 text-center">Failed to load insights.</div>`;
    }
  }

  async function renderSingleInsight() {
    const titleEl = document.getElementById("postTitle");
    const bodyEl = document.getElementById("postBody");
    if (!titleEl || !bodyEl) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("post");

    if (!slug) {
      titleEl.textContent = "Insight not found";
      document.getElementById("postExcerpt").textContent =
        "Please return to Insights and select a post.";
      const hero = document.getElementById("postHeroImage");
      if (hero) hero.style.display = "none";
      return;
    }

    titleEl.textContent = "Loading…";

    try {
      const { post } = await fetchJson(`${API_BASE}/insights/${encodeURIComponent(slug)}`);

      document.title = `${post.title} - Vulcan ICT PLC`;
      document.getElementById("postTitle").textContent = post.title || "";
      document.getElementById("postExcerpt").textContent = post.excerpt || "";
      document.getElementById("postTag").textContent = post.tag || "Insight";
      document.getElementById("postDate").textContent = post.date_label || post.year || "";

      const hero = document.getElementById("postHeroImage");
      if (hero) {
        hero.src = resolveAssetUrl(post.hero_image || "");
        hero.alt = post.title || "";
        hero.style.display = post.hero_image ? "" : "none";
      }

      // body is stored as "para1|para2|para3" in EJS version
      const body = document.getElementById("postBody");
      body.innerHTML = "";
      String(post.body || "")
        .split("|")
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((para) => {
          const p = document.createElement("p");
          p.textContent = para;
          body.appendChild(p);
        });

      const gallery = document.getElementById("postGallery");
      if (gallery) {
        gallery.innerHTML = "";
        String(post.gallery_images || "")
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 6)
          .forEach((src) => {
            const col = document.createElement("div");
            col.className = "col-md-4 mb-3";
            const resolved = resolveAssetUrl(src);
            col.innerHTML = `<img class="img-fluid rounded" style="width:100%;height:190px;object-fit:cover;" src="${escapeHtml(
              resolved
            )}" alt="${escapeHtml(post.title || "")}">`;
            gallery.appendChild(col);
          });
      }

      const ctaWrap = document.getElementById("postCTA");
      const ctaLink = document.getElementById("postCTALink");
      if (ctaWrap && ctaLink && post.cta_label && post.cta_link) {
        ctaLink.href =
          typeof window.normalizeStaticPageHref === "function"
            ? window.normalizeStaticPageHref(String(post.cta_link))
            : String(post.cta_link);
        ctaLink.textContent = post.cta_label;
        ctaWrap.style.display = "";
      } else if (ctaWrap) {
        ctaWrap.style.display = "none";
      }
    } catch (e) {
      console.error(e);
      titleEl.textContent = "Insight not found";
      document.getElementById("postExcerpt").textContent =
        "Please return to Insights and select a post.";
      const hero = document.getElementById("postHeroImage");
      if (hero) hero.style.display = "none";
    }
  }

  renderInsightsList();
  renderSingleInsight();
})();

