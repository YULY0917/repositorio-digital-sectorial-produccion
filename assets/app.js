// ==== Menú (estructura solicitada) ====
const MENU = [
  {
    title: "", // sin título arriba
    items: [
      { label: "Inicio", href: "index.html" },
    ]
  },
  {
    title: "CONVENIO DE ADHESIÓN",
    items: [
      { label: "Convenio de Adhesión", href: "paginas/convenio.html" },
    ]
  },
  {
    title: "ANEXOS TÉCNICOS",
    items: [
      { label: "Anexos Técnicos", href: "paginas/anexos-tecnicos.html" },
      { label: "Anexos de provisión de datos", href: "paginas/anexos-provision.html", sub: true },
      { label: "Anexos de consumo de datos", href: "paginas/anexos-consumo.html", sub: true },
    ]
  },
  {
    title: "REGLAS DE USO",
    items: [
      { label: "Reglas de Uso", href: "paginas/reglas-uso.html" },
    ]
  }
];

function buildMenu() {
  const menuEl = document.getElementById("menu");
  if (!menuEl) return;

  // Detecta si estamos dentro de /paginas/ para ajustar rutas relativas
  const inPaginas = window.location.pathname.includes("/paginas/");
  const fixHref = (href) => {
    // desde paginas/* => index.html está en ../index.html y assets en ../assets/
    if (inPaginas) {
      if (href === "index.html") return "../index.html";
      if (href.startsWith("paginas/")) return "../" + href;
      return href;
    }
    // desde raíz
    return href;
  };

  menuEl.innerHTML = "";

  MENU.forEach(section => {
    const wrap = document.createElement("div");
    wrap.className = "section";

    if (section.title) {
      const t = document.createElement("div");
      t.className = "sectionTitle";
      t.textContent = section.title;
      wrap.appendChild(t);
    }

    // items
    const subWrap = document.createElement("div");
    section.items.forEach(item => {
      const a = document.createElement("a");
      a.textContent = item.label;
      a.href = fixHref(item.href);

      if (item.sub) {
        subWrap.classList.add("sub");
      }

      // active
      const current = window.location.pathname.replace(/\/$/, "");
      const aPath = new URL(a.href, window.location.origin).pathname.replace(/\/$/, "");
      if (current.endsWith(aPath)) {
        a.classList.add("active");
      }

      // si es sub, lo metemos en contenedor sub
      if (item.sub) {
        // crea sub si no existe al final
        let sub = wrap.querySelector(".sub");
        if (!sub) {
          sub = document.createElement("div");
          sub.className = "sub";
          wrap.appendChild(sub);
        }
        sub.appendChild(a);
      } else {
        wrap.appendChild(a);
      }
    });

    menuEl.appendChild(wrap);
  });
}

// ==== Buscador (solo en index.html) ====
function setupSearch() {
  const input = document.getElementById("searchInput");
  const list = document.getElementById("searchResults");
  if (!input || !list) return;

  const items = Array.from(list.querySelectorAll("li"));

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    items.forEach(li => {
      const text = li.innerText.toLowerCase();
      li.style.display = text.includes(q) ? "" : "none";
    });
  });
}

// ==== Menú móvil (hamburguesa) ====
function setupMobileMenu(){
  const btn = document.getElementById("btnMenu");
  const sidebar = document.getElementById("sidebar");
  if (!btn || !sidebar) return;

  const close = () => {
    sidebar.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // cierra al hacer click en un link
  sidebar.addEventListener("click", (e) => {
    if (e.target && e.target.tagName === "A") close();
  });

  // cierra con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

buildMenu();
setupSearch();
setupMobileMenu();
