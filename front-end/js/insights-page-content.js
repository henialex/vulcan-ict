async function loadInsightsPageContent() {
  try {
    const res = await fetch("http://localhost:3001/api/insights-page-content", {
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

    setTextAll('[data-insights="banner_title"]', c.banner_title);
    setTextAll('[data-insights="eyebrow_text"]', c.eyebrow_text);
    setTextAll('[data-insights="intro_title"]', c.intro_title);
    setTextAll('[data-insights="intro_description"]', c.intro_description);
    setTextAll('[data-insights="helper_box_title"]', c.helper_box_title);
    setTextAll('[data-insights="helper_box_text"]', c.helper_box_text);
  } catch (_) {
    // ignore
  }
}

document.addEventListener("DOMContentLoaded", loadInsightsPageContent);

