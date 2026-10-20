(function () {
  var ingredientes = [
    "Tomate", "Cebolla", "Huevos", "Pollo", "Ajo", "Pimiento",
    "Zanahoria", "Papa", "Limón", "Cilantro", "Aceite", "Sal",
    "Pasta", "Queso", "Arroz", "Leche", "Champiñones", "Crema"
  ];

  var recetas = [
    {
      id: "tortilla-tomate",
      nombre: "Tortilla de Tomate y Cebolla",
      ingredientes: ["Tomate", "Cebolla", "Huevos"],
      imagen: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=720&q=85",
      minutos: 20,
      porciones: 2,
      pasos: [
        "Bate los huevos con una pizca de sal.",
        "Sofríe la cebolla y el tomate picados hasta que estén tiernos.",
        "Agrega los huevos y cocina a fuego bajo hasta que la tortilla cuaje."
      ]
    },
    {
      id: "pollo-encebollado",
      nombre: "Pollo Encebollado al Pimiento",
      ingredientes: ["Pollo", "Cebolla", "Huevos", "Pimiento"],
      imagen: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=720&q=85",
      minutos: 35,
      porciones: 3,
      pasos: [
        "Corta el pollo en piezas y sazónalo con sal.",
        "Dora el pollo en una sartén y añade la cebolla y el pimiento.",
        "Cocina tapado hasta que el pollo esté bien cocido."
      ]
    },
    {
      id: "sopa-pollo-verduras",
      nombre: "Sopa de Pollo y Vegetales",
      ingredientes: ["Pollo", "Cebolla", "Tomate", "Zanahoria", "Papa"],
      imagen: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=720&q=85",
      minutos: 45,
      porciones: 4,
      pasos: [
        "Pon el pollo y la cebolla en una olla con agua y una pizca de sal.",
        "Añade el tomate, la zanahoria y la papa en trozos.",
        "Cocina a fuego medio hasta que el pollo y las verduras estén suaves."
      ]
    },
    {
      id: "pasta-champinones",
      nombre: "Pasta Cremosa con Champiñones",
      ingredientes: ["Pasta", "Champiñones", "Crema", "Queso"],
      imagen: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=720&q=85",
      minutos: 25,
      porciones: 2,
      pasos: [
        "Cocina la pasta siguiendo las instrucciones del empaque.",
        "Saltea los champiñones y agrega la crema.",
        "Mezcla con la pasta y termina con queso rallado."
      ]
    },
    {
      id: "huevos-tomate",
      nombre: "Huevos con Tomate y Cilantro",
      ingredientes: ["Huevos", "Tomate", "Cilantro"],
      imagen: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=720&q=85",
      minutos: 15,
      porciones: 2,
      pasos: [
        "Pica el tomate y sofríelo hasta que suelte sus jugos.",
        "Añade los huevos y cocina revolviendo suavemente.",
        "Sirve con cilantro fresco por encima."
      ]
    }
  ];

  window.despensaServicio = {
    async listarIngredientes() {
      return Promise.resolve(ingredientes.slice());
    },
    async listarTodos() {
      return Promise.resolve(recetas.slice());
    }
  };
})();
