(function () {
  window.despensaServicio = {
    async listarTodos() {
      return Promise.resolve(
        window.despensaMockData || {
          despensas: [],
          itemsDespensa: [],
          sugerencias: [],
          historialConsumo: [],
          alertasVencimiento: []
        }
      );
    },
    async eliminarItem(id) {
      if (window.despensaMockData && window.despensaMockData.itemsDespensa) {
        window.despensaMockData.itemsDespensa = window.despensaMockData.itemsDespensa.filter(
          item => String(item.id) !== String(id)
        );
      }
      return Promise.resolve({ success: true, id });
    }
  };
})();