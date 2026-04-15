/**
 * Shared admin sidebar: same navigation on every CMS page (matches dashboard).
 * Call VulcanAdminLayout.renderSidebar("projects") after auth, before rewriteAdminLinks().
 */
(() => {
  const NAV_ITEMS = [
    { id: "dashboard", href: "/admin", icon: "dashboard", label: "Dashboard" },
    { id: "projects", href: "/admin/projects", icon: "folder_special", label: "Projects" },
    { id: "home", href: "/admin/home", icon: "home", label: "Home" },
    { id: "about", href: "/admin/about", icon: "info", label: "About" },
    { id: "ai-solutions", href: "/admin/ai-solutions", icon: "smart_toy", label: "AI Solutions" },
    { id: "services-page", href: "/admin/services-page", icon: "route", label: "Services Page" },
    { id: "success-story-ecta", href: "/admin/success-story-ecta", icon: "timeline", label: "Success Story (ECTA)" },
    { id: "insights", href: "/admin/insights", icon: "insights", label: "Insights" },
    { id: "partners", href: "/admin/partners", icon: "handshake", label: "Partners" },
    { id: "services", href: "/admin/services", icon: "engineering", label: "Services" },
    { id: "messages", href: "/admin/messages", icon: "mail", label: "Messages" },
    { id: "site-settings", href: "/admin/site-settings", icon: "settings", label: "Site Settings" },
  ];

  function linkClass(activeId, itemId) {
    const base = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200";
    if (activeId === itemId) {
      return `${base} text-cyan-600 font-semibold bg-slate-200`;
    }
    return `${base} text-slate-500 hover:bg-slate-200`;
  }

  function renderSidebar(activeId) {
    const aside = document.getElementById("vulcanAdminSidebar");
    if (!aside) return;

    const links = NAV_ITEMS.map(
      (item) => `
      <a class="${linkClass(activeId, item.id)}" href="${item.href}">
        <span class="material-symbols-outlined">${item.icon}</span>
        <span class="text-sm font-medium">${item.label}</span>
      </a>`
    ).join("");

    aside.innerHTML = `
    <div class="mb-10 px-2 shrink-0">
      <h1 class="text-2xl font-bold tracking-tighter text-slate-900">Vulcan ICT</h1>
      <p class="text-xs text-slate-500 font-medium">Admin Dashboard</p>
    </div>
    <nav class="flex-1 space-y-1 min-h-0 overflow-y-auto">${links}</nav>
    <div class="pt-6 mt-6 border-t border-slate-200 space-y-1 shrink-0">
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors duration-200" href="/admin/logout">
        <span class="material-symbols-outlined">logout</span>
        <span class="text-sm font-medium">Logout</span>
      </a>
    </div>
    <div class="mt-8 flex items-center gap-3 px-2 shrink-0">
      <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white text-sm font-bold">A</div>
      <div>
        <p class="text-xs font-bold text-slate-900">Admin User</p>
        <p class="text-[10px] text-slate-500">Vulcan ICT Admin</p>
      </div>
    </div>`;
  }

  window.VulcanAdminLayout = { renderSidebar };
})();
