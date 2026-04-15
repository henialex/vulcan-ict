async function loadHomeWhyItems() {
  try {
    const mount = document.getElementById("homeWhyItemsMount");
    if (!mount) return;

    const res = await fetch("http://localhost:3001/api/home-why-items", {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return;

    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    if (items.length === 0) return;

    mount.innerHTML = items
      .map((it) => {
        const iconClass = it?.icon_class ? String(it.icon_class) : "fa fa-check";
        const title = it?.title ?? "";
        const description = it?.description ?? "";

        return `
          <div class="capability_item">
            <div class="capability_icon">
              <i class="${escapeAttr(iconClass)}"></i>
            </div>
            <div class="capability_content">
              <h4>${escapeHtml(title)}</h4>
              <p>${escapeHtml(description)}</p>
            </div>
          </div>
        `;
      })
      .join("");
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

function escapeAttr(value) {
  // class attribute: keep it simple/safe
  return String(value).replace(/[^a-zA-Z0-9 _-]/g, "");
}

document.addEventListener("DOMContentLoaded", loadHomeWhyItems);

