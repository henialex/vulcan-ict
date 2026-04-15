async function loadAboutContent() {
  try {
    const res = await fetch("http://localhost:3001/api/about-content", {
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

    const setSrcAll = (selector, value) => {
      if (!value) return;
      document.querySelectorAll(selector).forEach((el) => {
        el.setAttribute("src", String(value));
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

    setTextAll('[data-about="banner_title"]', c.banner_title);
    setTextAll('[data-about="main_title"]', c.main_title);
    setTextAll('[data-about="main_subtitle"]', c.main_subtitle);
    setTextAll('[data-about="section_title"]', c.section_title);
    setTextAll('[data-about="paragraph_1"]', c.paragraph_1);
    setTextAll('[data-about="paragraph_2"]', c.paragraph_2);
    setTextAll('[data-about="paragraph_3"]', c.paragraph_3);
    setSrcAll('[data-about="about_image"]', c.about_image);

    setTextAll('[data-about="vision_title"]', c.vision_title);
    setTextAll('[data-about="vision_text"]', c.vision_text);
    setTextAll('[data-about="mission_title"]', c.mission_title);
    setTextAll('[data-about="mission_text"]', c.mission_text);

    setTextAll('[data-about="cta_title"]', c.cta_title);
    setTextAll('[data-about="cta_description"]', c.cta_description);
    setTextAll('[data-about="cta_button1_text"]', c.cta_button1_text);
    setHrefAll('[data-about="cta_button1_link"]', c.cta_button1_link);
    setTextAll('[data-about="cta_button2_text"]', c.cta_button2_text);
    setHrefAll('[data-about="cta_button2_link"]', c.cta_button2_link);
  } catch (_) {
    // ignore (page should still render)
  }
}

document.addEventListener("DOMContentLoaded", loadAboutContent);

