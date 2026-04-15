/**
 * Rewrites CMS paths (/contact, http://localhost:3001/about) to static HTML
 * filenames (contact.html, about-us.html) when the site is served as flat files.
 * Load this script before any page script that applies API-driven hrefs.
 */
(function () {
  function normalizeStaticPageHref(href) {
    const raw = String(href || "").trim();
    if (!raw) return raw;
    if (/^(mailto:|tel:|#)/i.test(raw)) return raw;

    let path = raw;
    let query = "";
    if (raw.includes("?")) {
      const parts = raw.split("?");
      path = parts[0];
      query = parts.slice(1).join("?");
    }

    if (/^https?:\/\//i.test(path)) {
      try {
        const u = new URL(path);
        const isLocalApi =
          (u.hostname === "localhost" || u.hostname === "127.0.0.1") &&
          u.port === "3001";
        if (!isLocalApi) return raw;
        path = u.pathname || "/";
      } catch {
        return raw;
      }
    } else if (/^\/\//.test(path)) {
      return raw;
    }

    if (path.endsWith(".html")) {
      const file = path.startsWith("/") ? path.slice(1) : path;
      return file + (query ? `?${query}` : "");
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

    const pathKey = path.split("?")[0].replace(/\/$/, "") || "/";
    if (map.has(pathKey)) {
      return map.get(pathKey) + (query ? `?${query}` : "");
    }
    if (pathKey.startsWith("/")) {
      return pathKey.slice(1) + ".html" + (query ? `?${query}` : "");
    }
    return raw;
  }

  window.normalizeStaticPageHref = normalizeStaticPageHref;
})();
