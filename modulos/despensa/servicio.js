(function () {
  window.despensaServicio = {
    async listarIngredientes() {
      try {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              'Pasta',
              'Ranchera',
              'Huevos',
              'Arroz',
              'Cebolla',
              'Papa',
              'Champiñones',
              'Jalapeño',
              'Tomate',
              'Queso'
            ]);
          }, 100);
        });
      } catch (error) {
        console.error('Error al obtener los ingredientes:', error);
        throw error;
      }
    },
    async listarTodos() {
      return Promise.resolve([]);
    }
  };
})();
