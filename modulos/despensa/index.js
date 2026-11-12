(function () {
  async function iniciarDespensa() {
    const estado = document.getElementById("despensa-estado");
    const contenedorDespensa = document.getElementById("despensa-contenedor");

    if (!estado) {
      return;
    }

    try {

    if (contenedorDespensa && !contenedorDespensa.dataset.eventoEliminacionConfigurado) {
  contenedorDespensa.dataset.eventoEliminacionConfigurado = "true";

  contenedorDespensa.addEventListener("click", async (event) => {
    const botonCerrar = event.target.closest(".despensa-chip-cerrar");
    if (!botonCerrar) return;

    const chip = botonCerrar.closest(".despensa-chip");
    if (!chip) return;

    const itemId = chip.dataset.id;
    if (!itemId) {
      console.warn("El chip no contiene un ID de ingrediente válido.");
      return;
    }
  })






      await window.despensaServicio.listarTodos();
      estado.textContent = "Estructura base del módulo despensa cargada.";

    } catch (error) {
      estado.setAttribute("role", "alert");
      estado.textContent = "No fue posible cargar la base de despensa.";
      console.error("Error en la inicialización:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarDespensa);
})();