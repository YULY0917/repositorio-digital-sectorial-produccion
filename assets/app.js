(function () {
  const body = document.body;

  /* =====================================================
     MENU MOVIL
     ===================================================== */
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

  // Cierra menú al navegar en móvil
  document.querySelectorAll(".menu a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 980px)").matches) closeMenu();
    });
  });

  /* =====================================================
     ITEM ACTIVO EN MENU
     ===================================================== */
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href && href === current) a.classList.add("active");
  });

  /* =====================================================
     VERSIONAMIENTO AUTOMATICO (ULTIMO COMMIT)
     FECHA + HORA (Chile)
     ===================================================== */
  (function () {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    // Insertar bloque si no existe
    let box = sidebar.querySelector(".site-version");
    if (!box) {
      box = document.createElement("div");
      box.className = "site-version";
      box.innerHTML = `
        <div class="version-title">Última actualización</div>
        <div class="version-date" id="siteVersion">Cargando…</div>
      `;
      sidebar.appendChild(box);
    }

    const el = sidebar.querySelector("#siteVersion");
    if (!el) return;

    const owner  = "yuly0917";
    const repo   = "repositorio-digital-sectorial";
    const branch = "main";

    fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${branch}`, {
      cache: "no-store"
    })
      .then(r => r.json())
      .then(data => {
        const iso = data?.commit?.committer?.date;
        if (!iso) {
          el.textContent = "No disponible";
          return;
        }

        const date = new Date(iso);

        const fecha = date.toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "America/Santiago"
        });

        const hora = date.toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Santiago"
        });

        el.textContent = `${fecha} · ${hora}`;
      })
      .catch(() => {
        el.textContent = "No disponible";
      });
  })();

  /* =====================================================
     BUSCADOR GLOBAL
     ===================================================== */
  const input =
    document.getElementById("search") ||
    document.querySelector('input[type="search"]');

  const resultsBox =
    document.getElementById("searchResults") ||
    document.querySelector(".search-results");

  const clearBtn =
    document.querySelector(".search-clear") ||
    document.querySelector(".clear-btn");

  // Si una página no tiene buscador, no hacemos nada más
  if (!input || !resultsBox) return;

  const inPaginas = location.pathname.includes("/paginas/");
  const PAGE_PREFIX = inPaginas ? "" : "paginas/";
  const DOC_PREFIX  = inPaginas ? "../docs/" : "docs/";
  const HOME_URL    = inPaginas ? "../index.html" : "index.html";

  const DOCS = [];

  /* ---------- PAGINAS ---------- */
  DOCS.push(
    { title:"Inicio", section:"Página", url: HOME_URL, keywords:"inicio home repositorio" },
    { title:"Convenio de Adhesión", section:"Página", url: PAGE_PREFIX + "convenio.html", keywords:"convenio adhesion" },
    { title:"Anexos Técnicos", section:"Página", url: PAGE_PREFIX + "anexos-tecnicos.html", keywords:"anexos tecnicos anexo 1 anexo 2 anexo 3 anexo 4" },
    { title:"Anexos de Provisión de Datos", section:"Página", url: PAGE_PREFIX + "anexos-provision-datos.html", keywords:"provision datos proveedor ips dt suseso sp" },
    { title:"Anexos de Consumo de Datos", section:"Página", url: PAGE_PREFIX + "anexos-consumo-datos.html", keywords:"consumo datos consumidor ips dt suseso sp" },
    { title:"Reglas de Uso", section:"Página", url: PAGE_PREFIX + "reglas-uso.html", keywords:"reglas uso" },
    { title:"Datos disponibles", section:"Página", url: PAGE_PREFIX + "datos-disponibles.html", keywords:"datos disponibles catalogo sets" },
    { title:"Documentos Nodo", section:"Página", url: PAGE_PREFIX + "documentos-nodo.html", keywords:"documentos nodo reportes presentaciones" }
  );

  /* ---------- DOCUMENTOS NODO (PDF) ---------- */
  DOCS.push(
    {
      title:"Lanzamiento – Nodo Laboral y Previsional (V3)",
      section:"PDF",
      url: DOC_PREFIX + "251214_Lanzamiento_NODO_L%26P_V3.pdf",
      keywords:"lanzamiento nodo v3 pdf"
    },
    {
      title:"Reporte de Avance OAEs (13-01-2026)",
      section:"PDF",
      url: DOC_PREFIX + "260113_Reporte_de_Avance_OAEs.pdf",
      keywords:"reporte avance oaes 2026 pdf"
    }
  );

  /* ---------- ANEXOS POR OAE ---------- */
  ["SP","SUSESO","DT","IPS"].forEach(oae => {
    ["1","2","3","4"].forEach(n => {
      DOCS.push({
        title:`${oae} – Anexo ${n}`,
        section:"PDF",
        url: DOC_PREFIX + `${oae}_Anexo${n}.pdf`,
        keywords:`${oae} anexo ${n} provisión consumo datos pdf`
      });
    });
  });

  /* ---------- INDEXA MENU (fallback) ---------- */
  document.querySelectorAll(".menu a").forEach(a => {
    const title = (a.textContent || "").trim();
    const url = a.getAttribute("href");
    if (url && url !== "#") {
      DOCS.push({
        title,
        section:"Menú",
        url,
        keywords: a.getAttribute("data-keywords") || title
      });
    }
  });

  // Eliminar duplicados por URL
  const seen = new Set();
  const INDEX = DOCS.filter(d => {
    if (!d.url || seen.has(d.url)) return false;
    seen.add(d.url);
    return true;
  });

  function norm(s){
    return (s || "")
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

    const hits = INDEX.filter(d =>
      norm(d.title + " " + d.section + " " + (d.keywords || "")).includes(q)
    );

    const head = `<div class="sr-title">Resultados para <b>${qRaw}</b> (${hits.length})</div>`;
    const rows = hits.slice(0, 30).map(it => {
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

  document.addEventListener("click", e => {
    if (!e.target.closest(".searchwrap")) hideResults();
  });

})();
