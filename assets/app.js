document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const overlay = document.getElementById("overlay");

  const closeMenu = () => document.body.classList.remove("menu-open");

  if (burger) {
    burger.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
});
