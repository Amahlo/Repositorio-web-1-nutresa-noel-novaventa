(function () {
  
    function mostrarDespensa(ingredientes){
    var lista = document.getElementById("despensa-lista");
    if (!lista){
      return;

    }
    lista.textContent = "";

    for (var i = 0; i < ingredientes.length; i++) {
      var chip = document.createElement("li");
      chip.className = "despensa-chip";
      chip.textContent = ingredientes[i].nombreItem.normalize("NFC");
      lista.appendChild(chip);
    }
    }
    async function iniciarDespensa() {
    var estado = document.getElementById("despensa-estado");
    if (!estado) {
      return;
    }
    try {
      await window.despensaServicio.listarTodos();
    var ingredientes = await window.despensaServicio.listarDespensa();
      mostrarDespensa(ingredientes);
      estado.textContent = "Estructura base del módulo despensa cargada.";
    } catch (error) {
      estado.setAttribute("role", "alert");
      estado.textContent = "No fue posible cargar la base de despensa.";
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarDespensa);
})();
