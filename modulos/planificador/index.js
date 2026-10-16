(function () {
  async function iniciarPlanificador() {
    var estado = document.getElementById("planificador-estado");
    if (!estado) {
      return;
    }
    try {
      await window.planificadorServicio.listarTodos();
      estado.textContent = "Estructura base del módulo planificador cargada.";
    } catch (error) {
      estado.setAttribute("role", "alert");
      estado.textContent = "No fue posible cargar la base de planificador.";
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarPlanificador);
})();
