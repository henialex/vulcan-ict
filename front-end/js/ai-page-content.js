async function loadAiPageContent() {
  try {
    const res = await fetch("http://localhost:3001/api/ai-page-content", {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return;

    const data = await res.json();
    const c = data?.content;
    if (!c) return;

    const setTextAll = (selector, value) => {
      if (value === undefined || value === null) return;
      document.querySelectorAll(selector).forEach((el) => {
        el.textContent = String(value);
      });
    };

    const setHrefAll = (selector, value) => {
      if (!value) return;
      const href =
        typeof window.normalizeStaticPageHref === "function"
          ? window.normalizeStaticPageHref(String(value))
          : String(value);
      document.querySelectorAll(selector).forEach((el) => {
        el.setAttribute("href", href);
      });
    };

    setTextAll('[data-ai="banner_title"]', c.banner_title);
    setTextAll('[data-ai="section_title"]', c.section_title);
    setTextAll('[data-ai="lead_text"]', c.lead_text);
    setTextAll('[data-ai="description"]', c.description);
    setTextAll('[data-ai="cta_button_text"]', c.cta_button_text);
    setHrefAll('[data-ai="cta_button_link"]', c.cta_button_link);
  } catch (_) {
    // ignore (page should still render)
  }
}

document.addEventListener("DOMContentLoaded", loadAiPageContent);

