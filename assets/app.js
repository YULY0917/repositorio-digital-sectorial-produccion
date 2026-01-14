(() => {
  const body = document.body;
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".overlay");
  const sidebar = document.querySelector(".sidebar");
  const search = document.getElementById("search");

  function openMenu(){ body.classList.add("menu-open"); }
  function closeMenu(){ body.classList.remove("menu-open"); }
  function toggleMenu(){ body.classList.toggle("menu-open"); }

  if (burger && overlay && sidebar) {
    burger.addEventListener("click", (e) => { e.preventDefault(); toggleMenu(); });
    overlay.addEventListener("click", closeMenu);

    // Cierra al tocar un link del menú (solo móvil)
    sidebar.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      if (window.matchMedia("(max-width: 900px)").matches) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 900px)").matches) closeMenu();
    });
  }

  // Activo según URL
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === path) a.classList.add("active");
  });

  // Buscador de menú (si existe)
  if (search) {
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
})();
