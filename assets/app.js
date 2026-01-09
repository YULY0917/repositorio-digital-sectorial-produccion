document.addEventListener("DOMContentLoaded", () => {
  // Buscador SOLO en Inicio
  const input = document.getElementById("homeSearch");
  const list = document.getElementById("homeList");
  if (!input || !list) return;

  const items = Array.from(list.querySelectorAll(".search-item"));

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    items.forEach(a => {
      const ok = a.textContent.toLowerCase().includes(q);
      a.style.display = ok ? "" : "none";
    });
  });
});
