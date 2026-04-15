async function loadProjectTags() {
  try {
    const mount = document.querySelector("[data-project-tags-mount]");
    if (!mount) return;

    const projectId =
      mount.getAttribute("data-project-id") ||
      document.body.getAttribute("data-project-id");
    if (!projectId) return;

    const res = await fetch(
      `http://localhost:3001/api/projects/${encodeURIComponent(projectId)}/tags`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return;

    const data = await res.json();
    const tags = Array.isArray(data?.tags) ? data.tags : [];
    if (tags.length === 0) return;

    mount.innerHTML = tags
      .map((t) => {
        const iconClass = t?.icon_class ? String(t.icon_class) : "fa fa-tag";
        const label = t?.label ?? "";
        return `<span class="story_chip"><i class="${escapeAttr(
          iconClass
        )}"></i> ${escapeHtml(label)}</span>`;
      })
      .join("");
  } catch (_) {
    // ignore
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

function escapeAttr(value) {
  return String(value).replace(/[^a-zA-Z0-9 _-]/g, "");
}

document.addEventListener("DOMContentLoaded", loadProjectTags);

