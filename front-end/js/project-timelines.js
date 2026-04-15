(() => {
  const API_BASE = "http://localhost:3001/api";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function resolveProjectId(mount) {
    const fromQuery = new URLSearchParams(window.location.search || "").get("projectId");
    if (fromQuery && Number.isFinite(Number(fromQuery)) && Number(fromQuery) > 0) {
      return String(Number(fromQuery));
    }
    const fromAttr = mount.getAttribute("data-project-id");
    if (fromAttr && Number.isFinite(Number(fromAttr)) && Number(fromAttr) > 0) {
      return String(Number(fromAttr));
    }
    try {
      const res = await fetch(`${API_BASE}/projects`, { headers: { Accept: "application/json" } });
      if (!res.ok) return "5";
      const data = await res.json();
      const list = data.projects || [];
      const match = list.find((p) => {
        const t = String(p.title || "").toLowerCase();
        return t.includes("ecta") || t.includes("ethiopian coffee");
      });
      if (match?.id != null) return String(match.id);
      if (list[0]?.id != null) return String(list[0].id);
    } catch (_) {
      /* ignore */
    }
    return "5";
  }

  async function loadProjectTimelines() {
    try {
      const mount = document.querySelector("[data-project-timelines-mount]");
      if (!mount) return;

      const projectId = await resolveProjectId(mount);
      const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}/timelines`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json().catch(() => ({}));
      const timelines = Array.isArray(data?.timelines) ? data.timelines : [];

      // Always replace mount: empty API list must clear hardcoded fallback HTML in the template.
      if (timelines.length === 0) {
        mount.innerHTML =
          '<p class="text-muted" style="padding-left: 1rem;">No timeline entries are published for this project yet.</p>';
        return;
      }

      mount.innerHTML = timelines
        .map((t) => {
          const title = t?.title ?? "";
          const desc = t?.description ?? "";
          return `
          <div class="timeline_item">
            <div class="timeline_marker"></div>
            <div class="timeline_content">
              <h5>${escapeHtml(title)}</h5>
              <p>${escapeHtml(desc)}</p>
            </div>
          </div>
        `;
        })
        .join("");
    } catch (_) {
      // keep static fallback on network errors
    }
  }

  document.addEventListener("DOMContentLoaded", loadProjectTimelines);
})();
