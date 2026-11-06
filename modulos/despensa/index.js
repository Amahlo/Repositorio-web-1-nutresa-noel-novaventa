(function () {
  async function iniciarDespensa() {
    var estado = document.getElementById("despensa-estado");
    if (!estado) {
      return;
    }
    const contenedorChips = document.getElementById("despensa-chips-container");

    try {
      const resultado = await window.despensaServicio.listarTodos();
      const items = resultado.itemsDespensa || [];
      estado.textContent = "Estructura base del módulo despensa cargada.";
      if (contenedorChips) {
        contenedorChips.innerHTML = "";
        if (items.length === 0) {
          estado.textContent = "No hay ingredientes registrados en la despensa.";
          return;
        }
        items.forEach(item => {
          const chip = document.createElement("div");
          chip.className = "despensa-chip";
          chip.dataset.id = item.id; 
          
          chip.innerHTML = `
            <span class="despensa-chip-texto">${item.nombre || item.titulo}</span>
            <button type="button" class="despensa-chip-cerrar" aria-label="Eliminar ítem">&times;</button>
          `;

          contenedorChips.appendChild(chip);
        });
      }
    } catch (error) {
      estado.setAttribute("role", "alert");
      estado.textContent = "No fue posible cargar la base de despensa.";
      console.error(error);
    }
  }

  document.addEventListener("click", async (event) => {
    const botonCerrar = event.target.closest(".despensa-chip-cerrar");
    if (!botonCerrar) return;

    const chipElemento = botonCerrar.closest(".despensa-chip");
    if (!chipElemento) return;

    const itemId = chipElemento.dataset.id;
    const contenedorChips = document.getElementById("despensa-chips-container");
    const estado = document.getElementById("despensa-estado");

    try {
      botonCerrar.disabled = true;

      if (window.despensaServicio && typeof window.despensaServicio.eliminarItem === "function") {
        await window.despensaServicio.eliminarItem(itemId);
      }

      chipElemento.remove();

    } catch (error) {
      console.error("Error al eliminar el ítem de la despensa:", error);
      botonCerrar.disabled = false;
      alert("No se pudo eliminar el ingrediente.");
    }
  });

  document.addEventListener("DOMContentLoaded", iniciarDespensa);
})();