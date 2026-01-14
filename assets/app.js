// assets/app.js
(() => {
  /* =========================
     1) ÍNDICE GLOBAL DE DOCUMENTOS
     Edita aquí cuando subas nuevos PDFs
  ========================= */
  const DOCS = [
    // Páginas
    { title: "Convenio de Adhesión", type: "Página", url: "../paginas/convenio.html", keywords: ["convenio", "adhesión", "adhesion"] },
    { title: "Reglas de Uso", type: "Página", url: "../paginas/reglas-uso.html", keywords: ["reglas", "uso"] },
    { title: "Anexos Técnicos", type: "Página", url: "../paginas/anexos-tecnicos.html", keywords: ["anexos", "técnicos", "tecnicos"] },
    { title: "Anexos de Provisión de Datos", type: "Página", url: "../paginas/anexos-provision-datos.html", keywords: ["provisión", "provision", "datos"] },
    { title: "Anexos de Consumo de Datos", type: "Página", url: "../paginas/anexos-consumo-datos.html", keywords: ["consumo", "datos"] },

    // PDFs base
    { title: "Convenio Sectorial Nodo Laboral y Previsional", type: "PDF", url: "../docs/Convenio-Sectorial-Nodo.pdf", keywords: ["convenio", "sectorial", "nodo", "laboral", "previsional"] },
    { title: "Reglas de Uso del Repositorio Digital Sectorial", type: "PDF", url: "../docs/Reglas_de_uso.pdf", keywords: ["reglas", "uso", "repositorio", "digital", "sectorial"] },

    // Provisión (Anexo 1 y 2)
    { title: "SP — Anexo 1 (Provisión)", type: "PDF", url: "../docs/SP_Anexo1.pdf", keywords: ["sp", "superintendencia", "pensiones", "anexo 1", "anexo1", "provisión", "provision"] },
    { title: "SP — Anexo 2 (Provisión)", type: "PDF", url: "../docs/SP_Anexo2.pdf", keywords: ["sp", "superintendencia", "pensiones", "anexo 2", "anexo2", "provisión", "provision"] },

    { title: "DT — Anexo 1 (Provisión)", type: "PDF", url: "../docs/DT_Anexo1.pdf", keywords: ["dt", "dirección", "direccion", "trabajo", "anexo 1", "anexo1", "provisión", "provision"] },
    { title: "DT — Anexo 2 (Provisión)", type: "PDF", url: "../docs/DT_Anexo2.pdf", keywords: ["dt", "dirección", "direccion", "trabajo", "anexo 2", "anexo2", "provisión", "provision"] },

    { title: "SUSESO — Anexo 1 (Provisión)", type: "PDF", url: "../docs/SUSESO_Anexo1.pdf", keywords: ["suseso", "superintendencia", "seguridad", "social", "anexo 1", "anexo1", "provisión", "provision"] },
    { title: "SUSESO — Anexo 2 (Provisión)", type: "PDF", url: "../docs/SUSESO_Anexo2.pdf", keywords: ["suseso", "superintendencia", "seguridad", "social", "anexo 2", "anexo2", "provisión", "provision"] },

    // Consumo (Anexo 3 y 4)
    { title: "SUSESO — Anexo 3 (Consumo)", type: "PDF", url: "../docs/SUSESO_Anexo3.pdf", keywords: ["suseso", "anexo 3", "anexo3", "consumo", "datos"] },
    { title: "SUSESO — Anexo 4 (Consumo)", type: "PDF", url: "../docs/SUSESO_Anexo4.pdf", keywords: ["suseso", "anexo 4", "anexo4", "consumo", "datos"] },
  ];

  /* =========================
     2) Helpers
  ========================= */
  const norm = (s) => (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  function isPagesFolder() {
    // Si estamos en /paginas/ el path suele contener "/paginas/"
    return window.location.pathname.includes("/paginas/");
  }

  function fixUrl(url) {
    // Si estás en index.html (raíz), los enlaces "../paginas/..." y "../docs/..."
    // quedan mal. Entonces ajustamos:
    // - En raíz: "../paginas/xxx" => "paginas/xxx"
    // - En raíz: "../docs/xxx" => "docs/xxx"
    if (!isPagesFolder()) {
      return url.replace("../paginas/", "paginas/").replace("../docs/", "docs/");
    }
    return url;
  }

  /* =========================
     3) Menú hamburguesa
  ========================= */
  const body = document.body;
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".overlay");
  const sidebar = document.querySelector(".sidebar");

  function closeMenu() { body.classList.remove("menu-open"); }
  function toggleMenu() { body.classList.toggle("menu-open"); }

  if (burger && overlay && sidebar) {
    burger.addEventListener("click", (e) => { e.preventDefault(); toggleMenu(); });
    overlay.addEventListener("click", closeMenu);

    sidebar.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      if (window.matchMedia("(max-width: 900px)").matches) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* =========================
     4) Buscador global con resultados
  ========================= */
  const search = document.getElementById("search") || document.querySelector(".searchwrap input[type='search']");
  if (!search) return;

  // Crear contenedor resultados (una sola vez)
  let panel = document.querySelector(".search-results");
  if (!panel) {
    panel = document.createElement("div");
    panel.className = "search-results";
    panel.innerHTML = `
      <div class="sr-head">
        <strong>Resultados</strong>
        <button class="sr-close" type="button" aria-label="Cerrar">✕</button>
      </div>
      <div class="sr-list"></div>
    `;
    // lo montamos dentro del searchwrap si existe
    const wrap = document.querySelector(".searchwrap") || search.parentElement;
    wrap.style.position = "relative";
    wrap.appendChild(panel);

    panel.querySelector(".sr-close").addEventListener("click", () => {
      panel.classList.remove("open");
    });
  }

  const list = panel.querySelector(".sr-list");

  function renderResults(items, q) {
    if (!q) {
      panel.classList.remove("open");
      list.innerHTML = "";
      return;
    }

    panel.classList.add("open");

    if (!items.length) {
      list.innerHTML = `<div class="sr-empty">Sin resultados para “${q}”.</div>`;
      return;
    }

    list.innerHTML = items.slice(0, 12).map((d) => {
      const url = fixUrl(d.url);
      return `
        <a class="sr-item" href="${url}" target="${d.type === "PDF" ? "_blank" : "_self"}" rel="noopener">
          <div class="sr-title">${d.title}</div>
          <div class="sr-meta">${d.type}</div>
        </a>
      `;
    }).join("");
  }

  function searchDocs(q) {
    const nq = norm(q);
    if (!nq) return [];

    return DOCS.filter(d => {
      const haystack = norm(d.title + " " + (d.keywords || []).join(" "));
      return haystack.includes(nq);
    });
  }

  // Buscar mientras escribes
  search.addEventListener("input", () => {
    const q = search.value.trim();
    const results = searchDocs(q);
    renderResults(results, q);
  });

  // Enter abre el primer resultado
  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = search.value.trim();
      const results = searchDocs(q);
      if (results.length) {
        window.location.href = fixUrl(results[0].url);
      }
    }
  });

  // Click fuera cierra panel
  document.addEventListener("click", (e) => {
    const wrap = document.querySelector(".searchwrap") || search.parentElement;
    if (!wrap.contains(e.target)) panel.classList.remove("open");
  });
})();
