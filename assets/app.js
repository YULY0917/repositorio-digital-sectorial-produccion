(function () {
  const body = document.body;
    /* =========================
     FIX 404 ANEXOS (GitHub Pages subpath + evitar /paginas/paginas/)
     - Calcula la raíz real del sitio (incluye /repositorio-digital-sectorial/)
     - Reescribe href del menú a URLs correctas
     ========================= */
  (function fixMenuHrefs() {
    const path = window.location.pathname; // ej: /repositorio-digital-sectorial/paginas/anexos-tecnicos.html

    // Raíz del sitio = todo antes de "/paginas/" si existe; si no, carpeta actual
    let siteRoot = "/";
    if (path.includes("/paginas/")) {
      siteRoot = path.split("/paginas/")[0] + "/";
    } else {
      // en raíz (index.html o /repo/)
      // si termina en .html -> quita el archivo; si termina en / -> queda igual
      siteRoot = path.endsWith(".html") ? path.replace(/[^/]+$/, "") : (path.endsWith("/") ? path : path + "/");
    }

    // Normaliza para no duplicar slashes
    siteRoot = siteRoot.replace(/\/{2,}/g, "/");

    // Reescribe SOLO links internos del menú
    document.querySelectorAll(".sidebar .menu a[href]").forEach(a => {
      let href = (a.getAttribute("href") || "").trim();
      if (!href || href === "#") return;

      // No tocar links externos
      if (/^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      // Quita ./ inicial
      href = href.replace(/^\.\//, "");

      // Caso 1: Inicio
      if (href === "index.html" || href === "../index.html") {
        a.setAttribute("href", siteRoot + "index.html");
        return;
      }

      // Caso 2: Links que ya vienen como paginas/xxx.html (desde index)
      if (href.startsWith("paginas/")) {
        a.setAttribute("href", siteRoot + href);
        return;
      }

      // Caso 3: Links dentro de /paginas/ (ej: "anexos-tecnicos.html")
      // Los convertimos a siteRoot + "paginas/" + archivo.html
      if (/\.html$/i.test(href) && !href.includes("/")) {
        a.setAttribute("href", siteRoot + "paginas/" + href);
        return;
      }

      // Caso 4: Cualquier otro relativo (por si acaso)
      a.setAttribute("href", siteRoot + href);
    });
  })();

  /* =========================
     MENU MOVIL
     ========================= */
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

  document.querySelectorAll(".menu a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 980px)").matches) closeMenu();
    });
  });

  /* =========================
     UTIL: NORMALIZAR URLS
     - elimina query/hash
     - elimina ./ inicial
     - deja solo ruta limpia
     ========================= */
  function normalizeUrl(url) {
    if (!url) return "";
    let u = url.split("#")[0].split("?")[0].trim();
    u = u.replace(/^\.\//, ""); // quita "./"
    return u;
  }

  function isInPaginas() {
    // más robusto que includes("/paginas/") cuando estás en GitHub Pages con subpath
    const parts = window.location.pathname.split("/").filter(Boolean);
    return parts.includes("paginas");
  }

  /* =========================
     ITEM ACTIVO EN MENU (ÚNICO)
     ========================= */
  (function setActiveMenu() {
    const currentFile = (normalizeUrl(window.location.pathname).split("/").pop()) || "index.html";

    const menuLinks = document.querySelectorAll(".sidebar .menu a[href]");
    menuLinks.forEach(a => {
      a.classList.remove("active", "is-active");
      a.removeAttribute("aria-current");
    });

    let exactActive = null;
    menuLinks.forEach(a => {
      const hrefFile = normalizeUrl(a.getAttribute("href")).split("/").pop();
      if (hrefFile && hrefFile === currentFile) exactActive = a;
    });

    if (exactActive) {
      exactActive.classList.add("is-active");
      exactActive.setAttribute("aria-current", "page");
    }

    // Si estás en provisión/consumo, también resalta el padre "Anexos Técnicos"
    if (currentFile === "anexos-provision-datos.html" || currentFile === "anexos-consumo-datos.html") {
      menuLinks.forEach(a => {
        const hrefFile = normalizeUrl(a.getAttribute("href")).split("/").pop();
        if (hrefFile === "anexos-tecnicos.html") a.classList.add("is-active");
      });
    }
  })();

  /* =========================
     VERSIONAMIENTO (FECHA+HORA)
     ========================= */
  (function () {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    let box = sidebar.querySelector(".site-version");
    if (!box) {
      box = document.createElement("div");
      box.className = "site-version";
      box.innerHTML = `
        <div class="version-title">Última Actualización</div>
        <div class="version-date" id="siteVersion">Cargando…</div>
      `;
      sidebar.appendChild(box);
    }

    const el = sidebar.querySelector("#siteVersion");
    if (!el) return;

    const inPaginas = isInPaginas();
    const VERSION_URL = (inPaginas ? "../" : "") + "assets/version.json?v=" + Date.now();

    fetch(VERSION_URL, { cache: "no-store" })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(v => {
        if (v && v.label) {
          el.textContent = v.label;
          return;
        }
        throw new Error("no label");
      })
      .catch(() => {
        const owner  = "yuly0917";
        const repo   = "repositorio-digital-sectorial";
        const branch = "main";

        fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${branch}`, { cache: "no-store" })
          .then(r => r.json())
          .then(data => {
            const iso = data?.commit?.committer?.date;
            if (!iso) { el.textContent = "No disponible"; return; }

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
      });
  })();

  /* =========================
     BUSCADOR GLOBAL (URLs SIN 404)
     - Normaliza links del menú
     - Genera páginas con prefijo correcto
     ========================= */
  const input =
    document.getElementById("search") ||
    document.querySelector('input[type="search"]');

  const resultsBox =
    document.getElementById("searchResults") ||
    document.querySelector(".search-results");

  const clearBtn =
    document.querySelector(".search-clear") ||
    document.querySelector(".clear-btn");

  if (!input || !resultsBox) return;

  const inPaginas = isInPaginas();

  // Si estás en /paginas => las páginas se llaman "archivo.html"
  // Si estás en raíz       => las páginas son "paginas/archivo.html"
  const PAGE_PREFIX = inPaginas ? "" : "paginas/";
  const DOC_PREFIX  = inPaginas ? "../docs/" : "docs/";
  const HOME_URL    = inPaginas ? "../index.html" : "index.html";

  const DOCS = [];

  DOCS.push(
    { title:"Inicio", section:"Página", url: HOME_URL, keywords:"inicio home repositorio" },
    { title:"Convenio de Adhesión", section:"Página", url: PAGE_PREFIX + "convenio.html", keywords:"convenio adhesion" },
    { title:"Anexos Técnicos", section:"Página", url: PAGE_PREFIX + "anexos-tecnicos.html", keywords:"anexos tecnicos anexo 1 anexo 2 anexo 3 anexo 4" },
    { title:"Anexos de Provisión de Datos", section:"Página", url: PAGE_PREFIX + "anexos-provision-datos.html", keywords:"provision datos proveedor ips dt suseso sp" },
    { title:"Anexos de Consumo de Datos", section:"Página", url: PAGE_PREFIX + "anexos-consumo-datos.html", keywords:"consumo datos consumidor ips dt suseso sp" },
    { title:"Reglas de Uso", section:"Página", url: PAGE_PREFIX + "reglas-uso.html", keywords:"reglas uso" },
    { title:"Datos disponibles", section:"Página", url: PAGE_PREFIX + "datos-disponibles.html", keywords:"datos disponibles catalogo sets" },
    { title:"Documentos Nodo", section:"Página", url: PAGE_PREFIX + "documentos-nodo.html", keywords:"documentos nodo reportes presentaciones" },

    { title:"Lanzamiento – Nodo Laboral y Previsional", section:"PDF", url: DOC_PREFIX + "251214_Lanzamiento_NODO_LP_V3.pdf", keywords:"lanzamiento nodo pdf" },
    { title:"Reporte de Avance OAEs", section:"PDF", url: DOC_PREFIX + "260113_Reporte_de_Avance_OAEs.pdf", keywords:"reporte avance oaes 2026 pdf" }
  );

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

  // Agrega items del menú, pero NORMALIZADOS para que no queden "./paginas/..." mezclados
  document.querySelectorAll(".menu a").forEach(a => {
    const title = (a.textContent || "").trim();
    const rawUrl = a.getAttribute("href");
    const url = normalizeUrl(rawUrl);

    if (url && url !== "#") {
      DOCS.push({
        title,
        section:"Menú",
        url,
        keywords: a.getAttribute("data-keywords") || title
      });
    }
  });

  // Quita duplicados por URL normalizada
  const seen = new Set();
  const INDEX = DOCS.filter(d => {
    const u = normalizeUrl(d.url);
    if (!u || seen.has(u)) return false;
    seen.add(u);
    d.url = u;
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
/* =========================================================
   MENU COLAPSABLE: muestra solo padres, hijos al desplegar
   (Pegar al final de assets/app.js)
   ========================================================= */
(function () {
  const blocks = document.querySelectorAll(".sidebar .menu .menu-block");
  if (!blocks.length) return;

  // Cierra todos
  function closeAll() {
    blocks.forEach(b => b.classList.remove("is-open"));
  }

  // Abre el bloque que contiene el link activo (si existe)
  (function openActiveParent() {
    const activeLink =
      document.querySelector(".sidebar .menu a[aria-current='page']") ||
      document.querySelector(".sidebar .menu a.is-active") ||
      document.querySelector(".sidebar .menu a.active");

    if (!activeLink) return;

    const parentBlock = activeLink.closest(".menu-block");
    if (parentBlock) parentBlock.classList.add("is-open");
  })();

  // Toggle al hacer click en el título padre
  blocks.forEach(block => {
    const title = block.querySelector(".menu-block-title");
    if (!title) return;

    title.addEventListener("click", () => {
      const wasOpen = block.classList.contains("is-open");
      closeAll(); // comportamiento acordeón (solo 1 abierto)
      if (!wasOpen) block.classList.add("is-open");
    });
  });

})();
