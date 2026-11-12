(function () {
  async function sincronizarSugerenciasRecetas() {
    const contenedorRecetas = document.getElementById("recetas-sugeridas-contenedor");
    const estadoRecetas = document.getElementById("recetas-estado");

    if (!contenedorRecetas) return;
     }

  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("despensa:actualizada", sincronizarSugerenciasRecetas);
    
  });
})();