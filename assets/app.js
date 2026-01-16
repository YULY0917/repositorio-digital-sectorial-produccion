(function () {
  const body = document.body;

  // =========================
  // MENU MOVIL
  // =========================
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".overlay");

  const openMenu = () => body.classList.add("menu-open");
  const closeMenu = () => body.classList.remove("menu-open");

  if (burger) {
    burger.addEventListener("click", () => {
      body.classList.contains("menu-open") ? closeMenu() : openMenu();
    });
  }
  if (overlay) overlay.addEventListener("click", closeMenu);

  // Cierra menú al navegar (móvil)
  document.querySelectorAll(".menu a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 980px)").matches) closeMenu();
    });
  });

  // =========================
  // ACTIVO EN MENU
  // =========================
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href && href === current) a.classList.add("active");
  });

  // =========================
  // VERSIONAMIENTO AUTOMATICO (ULTIMO COMMIT)
  // - se inserta solo al final del sidebar
  // =========================
  (function () {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    let box = sidebar.querySelector(".site-version");
    if (!box) {
      box = document.createElement("div");
      box.className = "site-version";
      box.innerHTML = `
        <div class="version-title">Última actualización</div>
        <div class="version-date" id="siteVersion">—</div>
      `;
      sidebar.appendChild(box);
    }

    const el = sidebar.querySelector("#siteVersion");
    if (!el) return;

    const owner = "yuly0917";
    const repo = "repositorio-digital-sectorial";
    const branch = "main";

    fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${branch}`, { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        const iso = data?.commit?.committer?.date;
        if (!iso) { el.textContent = "—"; return; }

        const date = new Date(iso);
        el.textContent = date.toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      })
      .catch(() => { el.textContent = "—"; });
  })();

  // =========================
  // BUSCADOR GLOBAL (PAGINAS + PDFS)
  // =========================
  const input =
    document.getElementById("search") ||
    document.querySelector('input[type="search"]');

  const resultsBox =
    document.getElementById("searchResults") ||
    document.querySelector(".search-results") ||
    document.getElementById("search-results");

  const clearBtn =
    document.querySelector(".search-clear") ||
    document.querySelector(".clear-btn");

  // Si la página no tiene buscador, no hacemos nada (pero NO rompemos el resto)
  if (!input || !resultsBox) return;

  // Prefijos correctos según estemos en /paginas/ o en raíz
  const inPaginas = location.pathname.includes("/paginas/");
  const PAGE_PREFIX = inPaginas ? "" : "paginas/";
  const DOC_PREFIX  = inPaginas ? "../docs/" : "docs/";
  const HOME_URL    = inPaginas ? "../index.html" : "index.html";

  // Helper para crear docs
  const docs = [];

  // ---- PÁGINAS ----
  docs.push(
    { title:"Inicio", section:"Página", url: HOME_URL, keywords:"inicio home repositorio" },
    { title:"Convenio de Adhesión", section:"Página", url: PAGE_PREFIX + "convenio.html", keywords:"convenio adhesion" },
    { title:"Anexos Técnicos", section:"Página", url: PAGE_PREFIX + "anexos-tecnicos.html", keywords:"anexos tecnicos anexo 1 anexo 2 anexo 3 anexo 4" },
    { title:"Anexos de Provisión de Datos", section:"Página", url: PAGE_PREFIX + "anexos-provision-datos.html", keywords:"provision datos proveedor anexo 1 anexo 2 ips dt suseso sp" },
    { title:"Anexos de Consumo de Datos", section:"Página", url: PAGE_PREFIX + "anexos-consumo-datos.html", keywords:"consumo datos consumidor anexo 3 anexo 4 ips dt suseso sp" },
    { title:"Reglas de Uso", section:"Página", url: PAGE_PREFIX + "reglas-uso.html", keywords:"reglas uso" },
    { title:"Datos disponibles", section:"Página", url: PAGE_PREFIX + "datos-disponibles.html", keywords:"datos disponibles sets catalogo" },
    { title:"Documentos Nodo", section:"Página", url: PAGE_PREFIX + "documentos-nodo.html", keywords:"documentos nodo reportes presentaciones" }
  );

  // ---- PDFs “globales” (si existen en /docs) ----
  docs.push(
    { title:"Convenio Sectorial Nodo (PDF)", section:"PDF", url: DOC_PREFIX + "Convenio-Sectorial-Nodo.pdf", keywords:"convenio sectorial nodo pdf" },
    { title:"Sets de datos disponibles 4 OAEs Fase 1 (PDF)", section:"PDF", url: DOC_PREFIX + "Sets_datos_disponibles_4_OAEs_Fase1.pdf", keywords:"sets datos disponibles fase 1 pdf" }
  );

  // ---- Documentos Nodo (los que subiste) ----
  // OJO: tu archivo tiene & => debe ir %26 en la URL
  docs.push(
    { title:"Lanzamiento – Nodo Laboral y Previsional (V3) (PDF)", section:"PDF", url: DOC_PREFIX + "251214_Lanzamiento_NODO_L%26P_V3.pdf", keywords:"lanzamiento nodo v3 pdf" },
    { title:"Reporte de Avance OAEs (13-01-2026) (PDF)", section:"PDF", url: DOC_PREFIX + "260113_Reporte_de_Avance_OAEs.pdf", keywords:"reporte avance oaes 2026 pdf" }
  );

  // ---- Anexos por OAE (los nombres que vienes usando: SP_Anexo1.pdf, etc.) ----
  const OAES = ["SP", "SUSESO", "DT", "IPS"];
  OAES.forEach(oae => {
    ["1","2","3","4"].forEach(n => {
      docs.push({
        title: `${oae} – Anexo ${n} (PDF)`,
        section:"PDF",
        url: DOC_PREFIX + `${oae}_Anexo${n}.pdf`,
        keywords: `${oae} anexo ${n} pdf provisión consumo datos`
      });
    });
  });

  // También indexa los links del menú (por si cambias textos)
  const menuDocs = Array.from(document.querySelectorAll(".menu a")).map(a => {
    const title = (a.textContent || "").trim();
    const url = a.getAttribute("href") || "#";
    const keywords = a.getAttribute("data-keywords") || title;
    return { title, section:"Menú", url, keywords };
  });

  // Deduplicar por URL
  const seen = new Set();
  const DOCS = [...docs, ...menuDocs].filter(d => {
    const key = (d.url || "").trim();
    if (!key || key === "#") return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  function norm(s){
    return (s||"")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .trim();
  }

  function hideResults(){
    resultsBox.style.display = "none";
    resultsBox.innerHTML = "";
    resultsBox.classList.remove("is-open");
  }

  function showResults(html){
    resultsBox.innerHTML = html;
    resultsBox.style.display = "block";
    resultsBox.classList.add("is-open");
  }

  function render(qRaw){
    const q = norm(qRaw);
    if (clearBtn) clearBtn.style.display = q ? "inline-flex" : "none";
    if (!q) { hideResults(); return; }

    const hits = DOCS.filter(d =>
      norm(d.title + " " + d.section + " " + (d.keywords || "")).includes(q)
    );

    const head = `<div class="sr-title">Resultados para <b>${qRaw}</b> (${hits.length})</div>`;
    const rows = hits.slice(0, 30).map(it => {
      const isPdf = (it.url || "").toLowerCase().endsWith(".pdf");
      const target = isPdf ? ` target="_blank" rel="noopener"` : "";
      return `<a href="${it.url}"${target}><b>${it.title}</b><br><small>${it.section}</small></a>`;
    }).join("");

    showResults(head + (rows || `<div class="sr-title">No se encontraron coincidencias.</div>`));
  }

  input.addEventListener("input", () => render(input.value));
  input.addEventListener("focus", () => render(input.value));

  if (clearBtn){
    clearBtn.addEventListener("click", () => {
      input.value = "";
      clearBtn.style.display = "none";
      hideResults();
      input.focus();
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".searchwrap")) hideResults();
  });
})();
