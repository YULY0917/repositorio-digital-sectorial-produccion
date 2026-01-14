document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     MENU HAMBURGUESA
  ========================= */
  const burger = document.querySelector(".burger");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");

  if (burger) {
    burger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("show");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    });
  }

  /* =========================
     BUSCADOR DE DOCUMENTOS
  ========================= */
  const searchInput = document.getElementById("search");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    /* Busca en TODAS las tablas */
    document.querySelectorAll("table tbody tr").forEach(row => {
      const rowText = row.innerText.toLowerCase();

      if (rowText.includes(query)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });

});
