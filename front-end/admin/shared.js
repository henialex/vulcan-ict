(() => {
  function requireAuth() {
    if (!window.VulcanAdmin || !VulcanAdmin.getToken()) {
      location.href = "login.html";
      return false;
    }
    return true;
  }

  function adminLogoutLinkHandler(selector = "a[href*='logout']") {
    document.querySelectorAll(selector).forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.VulcanAdmin) VulcanAdmin.clearToken();
        location.href = "login.html";
      });
    });
  }

  function rewriteAdminLinks() {
    const map = new Map([
      ["/admin", "dashboard.html"],
      ["/admin/", "dashboard.html"],
      ["/admin/home", "home.html"],
      ["/admin/about", "about.html"],
      ["/admin/ai-solutions", "ai-solutions.html"],
      ["/admin/services-page", "services-page.html"],
      ["/admin/projects", "projects.html"],
      ["/admin/add-project", "add-project.html"],
      ["/admin/services", "services.html"],
      ["/admin/add-service", "add-service.html"],
      ["/admin/messages", "messages.html"],
      ["/admin/insights", "insights.html"],
      ["/admin/add-insight", "add-insight.html"],
      ["/admin/site-settings", "site-settings.html"],
      ["/admin/partners", "partners.html"],
      ["/admin/add-partner", "add-partner.html"],
      ["/admin/success-story-ecta", "success-story-ecta.html"],
      ["/admin/login", "login.html"],
    ]);

    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (map.has(href)) a.setAttribute("href", map.get(href));
      if (href.startsWith("/admin/edit-project/")) {
        const id = href.split("/").pop();
        a.setAttribute("href", `edit-project.html?id=${encodeURIComponent(id)}`);
      }
      if (href.startsWith("/admin/edit-service/")) {
        const id = href.split("/").pop();
        a.setAttribute("href", `edit-service.html?id=${encodeURIComponent(id)}`);
      }
      if (href.startsWith("/admin/edit-insight/")) {
        const id = href.split("/").pop();
        a.setAttribute("href", `edit-insight.html?id=${encodeURIComponent(id)}`);
      }
      if (href.startsWith("/admin/edit-partner/")) {
        const id = href.split("/").pop();
        a.setAttribute("href", `edit-partner.html?id=${encodeURIComponent(id)}`);
      }
    });
  }

  window.VulcanAdminUI = {
    requireAuth,
    adminLogoutLinkHandler,
    rewriteAdminLinks,
  };
})();

