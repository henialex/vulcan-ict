async function loadHomePageContent() {
  try {
    const res = await fetch("http://localhost:3001/api/home-page-content", {
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

    setTextAll('[data-home="hero_title"]', c.hero_title);
    setTextAll('[data-home="hero_subtitle"]', c.hero_subtitle);
    setTextAll('[data-home="hero_button1_text"]', c.hero_button1_text);
    setHrefAll('[data-home="hero_button1_link"]', c.hero_button1_link);
    setTextAll('[data-home="hero_button2_text"]', c.hero_button2_text);
    setHrefAll('[data-home="hero_button2_link"]', c.hero_button2_link);

    setTextAll('[data-home="why_title"]', c.why_title);
    setTextAll('[data-home="why_description"]', c.why_description);

    setTextAll('[data-home="ai_showcase_title"]', c.ai_showcase_title);
    setTextAll('[data-home="ai_showcase_description"]', c.ai_showcase_description);

    setTextAll('[data-home="home_cta_title"]', c.home_cta_title);
    setTextAll('[data-home="home_cta_description"]', c.home_cta_description);
    setTextAll('[data-home="home_cta_button1_text"]', c.home_cta_button1_text);
    setHrefAll('[data-home="home_cta_button1_link"]', c.home_cta_button1_link);
    setTextAll('[data-home="home_cta_button2_text"]', c.home_cta_button2_text);
    setHrefAll('[data-home="home_cta_button2_link"]', c.home_cta_button2_link);
  } catch (_) {
    // ignore (page should still render with default hardcoded content)
  }
}

document.addEventListener("DOMContentLoaded", loadHomePageContent);

