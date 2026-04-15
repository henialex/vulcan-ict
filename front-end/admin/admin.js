(() => {
  const API_BASE = "http://localhost:3001/api";
  const TOKEN_KEY = "vulcan_admin_token";

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = Object.assign(
      { Accept: "application/json" },
      options.headers || {}
    );
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      clearToken();
      if (!location.pathname.endsWith("/admin/login.html")) {
        location.href = "login.html";
      }
      throw new Error("Unauthorized");
    }
    if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
    return data;
  }

  window.VulcanAdmin = {
    apiFetch,
    setToken,
    clearToken,
    getToken,
  };
})();

