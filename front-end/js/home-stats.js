async function loadHomeStats() {
  try {
    const mount = document.getElementById("homeStatsMount");
    if (!mount) return;

    const res = await fetch("http://localhost:3001/api/home-stats", {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return;

    const data = await res.json();
    const stats = Array.isArray(data?.stats) ? data.stats : [];
    if (stats.length === 0) return;

    mount.innerHTML = stats
      .map((s) => {
        const number = s?.stat_number ?? "";
        const label = s?.stat_label ?? "";
        return `
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stat_item">
              <h2 class="counter">${escapeHtml(number)}</h2>
              <p>${escapeHtml(label)}</p>
            </div>
          </div>
        `;
      })
      .join("");

    // If counterup plugin is on the page, re-trigger it after injecting.
    if (window.jQuery && typeof window.jQuery.fn?.counterUp === "function") {
      window.jQuery(".counter").counterUp({
        delay: 10,
        time: 1000,
      });
    }
  } catch (_) {
    // ignore (page should still render)
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", loadHomeStats);

