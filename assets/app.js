<script>
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    // Buscar en menú
    document.querySelectorAll(".sidebar a").forEach(link => {
      const text = link.textContent.toLowerCase();
      link.style.display = text.includes(term) ? "block" : "none";
    });

    // Buscar en contenido
    document.querySelectorAll("main h1, main h2, main p").forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(term) ? "" : "none";
    });
  });
});
</script>
