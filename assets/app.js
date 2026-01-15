(function () {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");
  const burger = document.querySelector(".burger");

  const input = document.getElementById("search");
  const clearBtn = document.querySelector(".search-clear");
  const resultsBox = document.getElementById("searchResults");

  // ====== Menú móvil ======
  function openMenu() {
    if (!sidebar) return;
    sidebar.classList.add("open");
    if (overlay) overlay.classList.add("show");
  }
  function closeMenu() {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
  }

  if (burger) burger.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) closeMenu();
    else openMenu();
  });

  if (overlay) overlay.addEventListener("click", closeMenu);

  // ====== Activar link del menú ======
  const current = location.pathname.split("/").pop();
  document.querySelectorAll(".menu a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href && href === current) a.classList.add("active");
  });

  // ====== Buscador global ======
  // Agrega aquí todo lo que quieres que el buscador encuentre (páginas + PDFs)
  const DOCS = [
    // Páginas
    { title: "Convenio de Adhesión", section: "Página", url: "convenio.html", keywords: "convenio adhesión" },
    { title: "Anexos Técnicos", section: "Página", url: "anexos-tecnicos.html", keywords: "anexos técnicos anexo 1 anexo 2 anexo 3 anexo 4" },
    { title: "Anexos de Provisión de Datos", section: "Página", url: "anexos-provision-datos.html", keywords: "provisión provision datos anexo 1 anexo 2 sp dt ips suseso" },
    { title: "Anexos de Consumo de Datos", section: "Página", url: "anexos-consumo-datos.html", keywords: "consumo datos anexo 3 anexo 4 sp dt ips suseso" },
    { title: "Reglas de Uso", section: "Página", url: "reglas-uso.html", keywords: "reglas uso" },

    // PDFs principales
    { title: "Convenio Sectorial Nodo Laboral y Previsional", section: "Convenio", url: "../docs/Convenio-Sectorial-Nodo.pdf", keywords: "convenio sectorial nodo laboral previsional" },
    { title: "Reglas de Uso del Repositorio Digital Sectorial", section: "Reglas de Uso", url: "../docs/Reglas_de_uso.pdf", keywords: "reglas uso repositorio digital sectorial" },

    // Provisión (Anexo 1 y 2)
    { title: "SP - Anexo 1 (Provisión de Datos)", section: "Provisión de Datos", url: "../docs/SP_Anexo1.pdf", keywords: "sp superintendencia pensiones anexo 1 provision" },
    { title: "SP - Anexo 2 (Provisión de Datos)", section: "Provisión de Datos", url: "../docs/SP_Anexo2.pdf", keywords: "sp superintendencia pensiones anexo 2 provision" },

    { title: "DT - Anexo 1 (Provisión de Datos)", section: "Provisión de Datos", url: "../docs/DT_Anexo1.pdf", keywords: "dt dirección trabajo anexo 1 provision" },
    { title: "DT - Anexo 2 (Provisión de Datos)", section: "Provisión de Datos", url: "../docs/DT_Anexo2.pdf", keywords: "dt dirección trabajo anexo 2 provision" },

    { title: "SUSESO - Anexo 1 (Provisión de Datos)", section: "Provisión de Datos", url: "../docs/SUSESO_Anexo1.pdf", keywords: "suseso seguridad social anexo 1 provision" },
    { title: "SUSESO - Anexo 2 (Provisión de Datos)", section: "Provisión de Datos", url: "../docs/SUSESO_Anexo2.pdf", keywords: "suseso seguridad social anexo 2 provision" },

    { title: "IPS - Anexo 1 (Provisión de Datos)", section: "Provisión de Datos", url: "../docs/IPS_Anexo1.pdf", keywords: "ips instituto previsión social anexo 1 provision" },
    { title: "IPS - Anexo 2 (Provisión de Datos)", section: "Provisión de Datos", url: "../docs/IPS_Anexo2.pdf", keywords: "ips instituto previsión social anexo 2 provision" },

    // Consumo (Anexo 3 y 4)
    { title: "SP - Anexo 3 (Consumo de Datos)", section: "Consumo de Datos", url: "../docs/SP_Anexo3.pdf", keywords: "sp superintendencia pensiones anexo 3 consumo" },
    { title: "SP - Anexo 4 (Consumo de Datos)", section: "Consumo de Datos", url: "../docs/SP_Anexo4.pdf", keywords: "sp superintendencia pensiones anexo 4 consumo" },

    { title: "DT - Anexo 3 (Consumo de Datos)", section: "Consumo de Datos", url: "../docs/DT_Anexo3.pdf", keywords: "dt dirección trabajo anexo 3 consumo" },
    { title: "DT - Anexo 4 (Consumo de Datos)", section: "Consumo de Datos", url: "../docs/DT_Anexo4.pdf", keywords: "dt dirección trabajo anexo 4 consumo" },

    { title: "SUSESO - Anexo 3 (Consumo de Datos)", section: "Consumo de Datos", url: "../docs/SUSESO_Anexo3.pdf", keywords: "suseso seguridad social anexo 3 consumo" },
    { title: "SUSESO - Anexo 4 (Consumo de Datos)", section: "Consumo de Datos", url: "../docs/SUSESO_Anexo4.pdf", keywords: "suseso seguridad social anexo 4 consumo" },

    { title: "IPS - Anexo 3 (Consumo de Datos)", section: "Consumo de Datos", url: "../docs/IPS_Anexo3.pdf", keywords: "ips instituto previsión social anexo 3 consumo" },
    { title: "IPS - Anexo 4 (Consumo de Datos)", section: "Consumo de Datos", url: "../docs/IPS_Anexo4.pdf", keywords: "ips instituto previsión social anexo 4 consumo" }
  ];

  function norm(s){
    return (s||"")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .trim();
  }

  function isExternalPdf(url){
    return url.includes("../docs/");
  }

  function resolveUrl(url){
    // Si ya viene como ../docs/... lo dejamos.
    if (url.startsWith("../docs/")) return url;

    // Si estamos en /paginas/, los links a páginas son directos (convenio.html, etc)
    // Si algún día lo llamas desde index.html, igual funcionará porque index no tiene buscador global aquí.
    return url;
  }

  function hideResults(){
    if (!resultsBox) return;
    resultsBox.style.display = "none";
    resultsBox.innerHTML = "";
  }

  function renderResults(items, q){
    if (!resultsBox) return;

    if (!q){
      hideResults();
      return;
    }

    const head = `<div class="sr-head">Resultados para <b>${q}</b> (${items.length})</div>`;
    const rows = items.slice(0, 12).map(it => {
      const u = resolveUrl(it.url);
      const target = isExternalPdf(u) ? ` target="_blank" rel="noopener"` : "";
      return `
        <a href="${u}" ${target}>
          <div class="sr-title">${it.title}</div>
          <div class="sr-sub">${it.section}</div>
        </a>
      `;
    }).join("");

    resultsBox.innerHTML = head + (rows || `<div class="sr-head">No se encontraron coincidencias.</div>`);
    resultsBox.style.display = "block";
  }

  function setupSearch(){
    if (!input || !resultsBox) return;

    const onChange = () => {
      const qRaw = input.value;
      const q = norm(qRaw);

      if (clearBtn){
        clearBtn.style.display = q ? "inline-flex" : "none";
      }

      if (!q){
        hideResults();
        return;
      }

      const hits = DOCS.filter(d => {
        const hay = norm(d.title + " " + d.section + " " + d.keywords);
        return hay.includes(q);
      });

      renderResults(hits, qRaw.trim());
    };

    input.addEventListener("input", onChange);
    input.addEventListener("focus", onChange);

    // cerrar resultados al hacer click fuera
    document.addEventListener("click", (e) => {
      const inside = e.target.closest(".searchwrap");
      if (!inside) hideResults();
    });

    if (clearBtn){
      clearBtn.addEventListener("click", () => {
        input.value = "";
        clearBtn.style.display = "none";
        hideResults();
        input.focus();
      });
    }
  }

  setupSearch();
})();
