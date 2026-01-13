/* assets/app.js
   - Construye el menú izquierdo (sidebar) con rutas absolutas (evita 404).
   - Marca como "active" el link de la página actual.
   - (Opcional) Buscador: filtra links del menú si existe #search en la topbar.
*/

(function () {
  // Cambia esto SOLO si tu repo tiene otro nombre
  const BASE = "/repositorio-digital-sectorial";

  const MENU = [
    { type: "item", label: "Inicio", href: `${BASE}/index.html` },

    { type: "item", label: "Convenio de Adhesión", href: `${BASE}/paginas/convenio.html` },

    { type: "item", label: "Anexos Técnicos", href: `${BASE}/paginas/anexos-tecnicos.html` },
    { type: "sub",  label: "Anexos de provisión de datos", href: `${BASE}/paginas/anexos-provision-datos.html` },
    { type: "sub",  label: "Anexos de consumo de datos",   href: `${BASE}/paginas/anexos-consumo-datos.html` },

    { type: "item", label: "Reglas de Uso", href: `${BASE}/paginas/reglas-uso.html` },
  ];

  function buildMenuHTML() {
    return `
      <div class="side-head">
        <div class="side-logo">
          <img src="${BASE}/assets/img/Logo.png" alt="Nodo Laboral y Previsional">
        </div>
      </div>

      <nav class="nav">
        ${MENU.map(m => {
          const cls = m.type === "sub" ? "nav-sub" : "nav-item";
          return `<a class="${cls}" href="${m.href}">${m.label}</a>`;
        }).join("")}
      </nav>
    `;
  }

  function markActiveLinks() {
    const current = window.location.pathname;
    document.querySelectorAll(".nav a").forEach(a => {
      // active exact match o match con /index.html cuando estás en /
      const href = a.getAttribute("href");
      if (!href) return;

      const same =
        current === href ||
        (current.endsWith("/") && href.endsWith("/index.html")) ||
        (current.endsWith("/index.html") && href.endsWith("/index.html"));

      if (same) a.classList.add("active");
    });
  }

  function setupSearch() {
    const input = document.getElementById("search");
    if (!input) return;

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll(".nav a").forEach(a => {
        const text = a.textContent.toLowerCase();
        a.style.display = text.includes(q) ? "" : "none";
      });
    });
  }

  // --- Render ---
  const menuEl = document.getElementById("menu");
  if (menuEl) {
    menuEl.innerHTML = buildMenuHTML();
    markActiveLinks();
  }

  setupSearch();
})();
