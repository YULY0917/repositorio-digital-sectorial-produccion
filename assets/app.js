// assets/app.js
(() => {
  const body = document.body;
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".overlay");
  const sidebar = document.querySelector(".sidebar");

  // Si alguna página no tiene estos elementos, no hacemos nada.
  if (!burger || !overlay || !sidebar) return;

  function openMenu() {
    body.classList.add("menu-open");
  }

  function closeMenu() {
    body.classList.remove("menu-open");
  }

  function toggleMenu() {
    body.classList.toggle("menu-open");
  }

  // Click en hamburguesa
  burger.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Click en overlay cierra
  overlay.addEventListener("click", closeMenu);

  // Click en un link del menú cierra (solo en móvil)
  sidebar.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    // Solo cerrar en pantallas pequeñas
    if (window.matchMedia("(max-width: 900px)").matches) {
      closeMenu();
    }
  });

  // Tecla ESC cierra
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Si se agranda la pantalla, aseguramos que no quede overlay abierto
  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 900px)").matches) {
      closeMenu();
    }
  });
})();
