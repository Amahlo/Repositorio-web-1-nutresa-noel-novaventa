(function () {
  window.despensaServicio = {
    async listarTodos() {
      return Promise.resolve([]);
    },
    async listarDespensa(){
      var respuesta = await fetch("https://6ae0354c8e42963c8d5f1481.mockapi.io/despensa");
      if (!respuesta.ok) {
      throw new Error("Error de red: " + respuesta.status);
      }

      var datos = await respuesta.json();
      return datos;
    }
  };
})();
