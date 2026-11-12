(function () {
  async function iniciarDespensa() {
    const estado = document.getElementById("despensa-estado");

    if (!estado) {
      return;
    }

    try {
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