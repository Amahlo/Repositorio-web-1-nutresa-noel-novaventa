(function () {
  window.despensaServicio = {
    async listarTodos() {
      return Promise.resolve([]);
    },
    async listarRecetas(){
      return Promise.resolve(window.recetasData || []);
    }
  };
})();
