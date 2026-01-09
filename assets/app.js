// ===== MENU =====
const menu = document.getElementById("menu");

const NAV = [
  { type: "item", label: "Inicio", href: "../index.html" },

  { type: "section", label: "CONVENIO DE ADHESIÓN" },
  { type: "item", label: "Convenio de Adhesión", href: "./convenio.html" },

  { type: "section", label: "ANEXOS TÉCNICOS" },
  { type: "item", label: "Anexos Técnicos", href: "./anexos-tecnicos.html" },
  { type: "subitem", label: "Anexos de provisión de datos", href: "./anexos-provision-datos.html" },
  { type: "subitem", label: "Anexos de consumo de datos", href: "./anexos-consumo-datos.html" },

  { type: "section", label: "REGLAS DE USO" },
  { type: "item", label: "Reglas de Uso", href: "./reglas-uso.html" },
];

function renderMenu() {
  if (!menu) return;

  const current = location.pathname.split("/").pop(); // ej: convenio.html

  const html = NAV.map((x) => {
    if (x.type === "section") {
      return `<div class="menu-section">${x.label}</div>`;
    }

    const isActive = x.href.endsWith(current);
    const cls =
      x.type === "subitem"
        ? `menu-link menu-link--sub ${isActive ? "is-active" : ""}`
        : `menu-link ${isActive ? "is-active" : ""}`;

    return `<a class="${cls}" href="${x.href}">${x.label}</a>`;
  }).join("");

  menu.innerHTML = html;
}

renderMenu();
