(function () {
  function mostrarRecetas(recetas) {
  var lista = document.getElementById("lista-recetas-despensa");
  if (!lista){
    return;
  }
  lista.textContent = "";

  for (var i = 0; i < recetas.length; i++){
    var tarjeta = document.createElement("article");
    var titulo = document.createElement("h3");
    titulo.textContent = recetas[i].nombreReceta.normalize("NFC");
      tarjeta.appendChild(titulo);
      lista.appendChild(tarjeta);
  }
  }
  async function iniciarDespensa() {
    var estado = document.getElementById("despensa-estado");
    if (!estado) {
      return;
    }
    try {
      await window.despensaServicio.listarTodos();
      var recetas = await window.despensaServicio.listarRecetas();
      mostrarRecetas(recetas);
      estado.textContent = "Estructura base del módulo despensa cargada.";
    } catch (error) {
      estado.setAttribute("role", "alert");
      estado.textContent = "No fue posible cargar la base de despensa.";
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarDespensa);
})();
