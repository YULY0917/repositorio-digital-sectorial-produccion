(function () {
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".overlay");
  const search = document.getElementById("search");

  // Abrir/cerrar menú en móvil
  function openMenu() { document.body.classList.add("menu-open"); }
  function closeMenu(){ document.body.classList.remove("menu-open"); }

  if (burger) burger.addEventListener("click", () => {
    document.body.classList.contains("menu-open") ? closeMenu() : openMenu();
  });
  if (overlay) overlay.addEventListener("click", closeMenu);

  // Marcar link activo según URL
  function markActiveLinks() {
    const path = location.pathname.split("/").pop();
    document.querySelectorAll(".menu a").forEach(a => {
      const href = (a.getAttribute("href") || "").split("/").pop();
      if (href && href === path) a.classList.add("active");
      if ((!path || path === "") && href === "index.html") a.classList.add("active");
    });
  }

  // Buscador: filtra links del menú por texto y data-keywords
  function setupSearch() {
    if (!search) return;

    const links = Array.from(document.querySelectorAll(".menu a"));
    const norm = (s) => (s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"");

    search.addEventListener("input", () => {
      const q = norm(search.value.trim());
      links.forEach(a => {
        const text = norm(a.textContent);
        const kw = norm(a.getAttribute("data-keywords"));
        const show = !q || text.includes(q) || kw.includes(q);
        a.style.display = show ? "" : "none";
      });
    });
  }

  markActiveLinks();
  setupSearch();
})();
