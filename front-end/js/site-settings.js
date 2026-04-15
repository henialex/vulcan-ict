(() => {
  const API_BASE = "http://localhost:3001/api";

  async function fetchSettings() {
    const res = await fetch(`${API_BASE}/site-settings`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Failed: ${res.status}`);
    return data.settings || null;
  }

  function setText(selector, value) {
    const els = document.querySelectorAll(selector);
    if (!els || els.length === 0) return;
    els.forEach((el) => {
      el.textContent = value ?? "";
    });
  }

  function setHref(selector, value) {
    const els = document.querySelectorAll(selector);
    if (!els || els.length === 0) return;
    els.forEach((el) => {
      if (!value) {
        el.setAttribute("href", "#");
        return;
      }
      const href =
        typeof window.normalizeStaticPageHref === "function"
          ? window.normalizeStaticPageHref(String(value))
          : String(value);
      el.setAttribute("href", href);
    });
  }

  function setSrc(selector, value) {
    const els = document.querySelectorAll(selector);
    if (!els || els.length === 0) return;
    els.forEach((el) => {
      if (value) el.setAttribute("src", value);
    });
  }

  function applySettings(settings) {
    if (!settings) return;

    // Footer (common)
    setText('[data-setting="footer_about"]', settings.footer_about);
    setText('[data-setting="newsletter_text"]', settings.newsletter_text);

    setHref('[data-setting="facebook_link"]', settings.facebook_link);
    setHref('[data-setting="twitter_link"]', settings.twitter_link);
    setHref('[data-setting="instagram_link"]', settings.instagram_link);
    setHref('[data-setting="linkedin_link"]', settings.linkedin_link);

    // Contact page blocks (optional)
    setText('[data-setting="office_city"]', settings.office_city);
    setText('[data-setting="office_address"]', settings.office_address);
    setText('[data-setting="office_phone"]', settings.office_phone);
    setText('[data-setting="office_hours"]', settings.office_hours);
    setText('[data-setting="office_email"]', settings.office_email);
    setHref('[data-setting="office_phone_link"]', settings.office_phone ? `tel:${settings.office_phone}` : null);
    setHref('[data-setting="office_email_link"]', settings.office_email ? `mailto:${settings.office_email}` : null);

    // Map iframe
    setSrc('iframe[data-setting="map_embed_url"]', settings.map_embed_url);
  }

  (async () => {
    try {
      const settings = await fetchSettings();
      applySettings(settings);
    } catch (e) {
      console.error("site-settings failed", e);
    }
  })();
})();

