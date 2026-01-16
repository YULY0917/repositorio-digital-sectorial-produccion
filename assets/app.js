(function () {
  const body = document.body;

  // ===== MENU MOVIL =====
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

  // ===== ACTIVO EN MENU =====
  const current = location.pathname.split("/").pop();
  document.querySelectorAll(".menu a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href && href === current) a.classList.add("active");
  });

  // ===== BUSCADOR GLOBAL (estable) =====
  const input = document.getElementById("search");
  const clearBtn = document.querySelector(".search-clear") || document.querySelector(".clear-btn");
  const resultsBox = document.getElementById("searchResults") || document.querySelector(".search-results");

  if (!input || !resultsBox) return;

  const inPaginas = location.pathname.includes("/paginas/");
  const PAGE_PREFIX = inPaginas ? "" : "paginas/";
  const DOC_PREFIX  = inPaginas ? "../docs/" : "docs/";
  const HOME_URL    = inPaginas ? "../index.html" : "index.html";

  const STATIC_DOCS = [
    // Páginas
    { title:"Inicio", section:"Página", url: HOME_URL, keywords:"inicio home" },
    { title:"Convenio de Adhesión", section:"Página", url: PAGE_PREFIX + "convenio.html", keywords:"convenio adhesion" },

    { title:"Anexos Técnicos", section:"Página", url: PAGE_PREFIX + "anexos-tecnicos.html", keywords:"anexos tecnicos anexo 1 anexo 2 anexo 3 anexo 4" },
    { title:"Anexos de Provisión de Datos", section:"Página", url: PAGE_PREFIX + "anexos-provision-datos.html", keywords:"provision datos proveedor anexo 1 anexo 2 ips dt suseso sp" },
    { title:"Anexos de Consumo de Datos", section:"Página", url: PAGE_PREFIX + "anexos-consumo-datos.html", keywords:"consumo datos consumidor anexo 3 anexo 4 ips dt suseso sp" },

    { title:"Reglas de Uso", section:"Página", url: PAGE_PREFIX + "reglas-uso.html", keywords:"reglas uso" },

    { title:"Datos disponibles", section:"Página", url: PAGE_PREFIX + "datos-disponibles.html", keywords:"datos disponibles sets catalogo ips dt suseso sp fase 1" },
    { title:"Documentos Nodo", section:"Página", url: PAGE_PREFIX + "documentos-nodo.html", keywords:"documentos nodo manual procedimiento soporte" },

    // PDFs
    { title:"Sets de datos disponibles (4 OAEs) – Fase 1", section:"PDF", url: DOC_PREFIX + "Sets_datos_disponibles_4_OAEs_Fase1.pdf", keywords:"sets datos disponibles dt ips suseso sp fase 1" }
  ];

  // Indexa también el menú (y sus data-keywords)
  const menuDocs = Array.from(document.querySelectorAll(".menu a")).map(a => {
    const title = (a.textContent || "").trim();
    const url = a.getAttribute("href") || "#";
    const keywords = a.getAttribute("data-keywords") || title;
    return { title, section:"Menú", url, keywords };
  });

  const DOCS = [...STATIC_DOCS, ...menuDocs];

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

    const hits = DOCS.filter(d => norm(d.title + " " + d.section + " " + d.keywords).includes(q));

    const head = `<div class="sr-title">Resultados para <b>${qRaw}</b> (${hits.length})</div>`;
    const rows = hits.slice(0, 20).map(it => {
      const isPdf = it.url.toLowerCase().endsWith(".pdf");
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
