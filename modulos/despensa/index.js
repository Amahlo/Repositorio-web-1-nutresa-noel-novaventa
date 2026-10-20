(function () {
  var ingredientes = ["Tomate", "Cebolla", "Huevos", "Pollo"];
  var catalogoIngredientes = [];
  var recetas = [];
  var nodos = {};

  function normalizar(texto) {
    return texto
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function crearElemento(tag, clase, texto) {
    var elemento = document.createElement(tag);
    if (clase) {
      elemento.className = clase;
    }
    if (texto !== undefined) {
      elemento.textContent = texto;
    }
    return elemento;
  }

  function actualizarChips() {
    nodos.listaIngredientes.replaceChildren();
    ingredientes.forEach(function (ingrediente) {
      var item = crearElemento("li", "chip-ingrediente");
      var nombre = crearElemento("span", "", ingrediente);
      var quitar = crearElemento("button", "", "×");
      quitar.type = "button";
      quitar.setAttribute("aria-label", "Quitar " + ingrediente);
      quitar.dataset.ingrediente = ingrediente;
      item.append(nombre, quitar);
      nodos.listaIngredientes.appendChild(item);
    });

    nodos.botonBuscar.disabled = ingredientes.length === 0;
    nodos.ayudaBusqueda.textContent = ingredientes.length
      ? "Puedes agregar o quitar ingredientes para actualizar las sugerencias."
      : "Agrega al menos un ingrediente para comenzar.";

    if (ingredientes.length === 0) {
      nodos.resumenRecetas.textContent = "";
      nodos.listaRecetas.replaceChildren();
      nodos.listaRecetas.appendChild(
        crearElemento("p", "estado-vacio-recetas", "Tu despensa está vacía. Agrega algún ingrediente para descubrir recetas.")
      );
    } else {
      renderizarRecetas();
    }
  }

  function ocultarSugerencias() {
    nodos.sugerencias.hidden = true;
    nodos.busqueda.setAttribute("aria-expanded", "false");
  }

  function mostrarSugerencias() {
    var consulta = normalizar(nodos.busqueda.value);
    nodos.sugerencias.replaceChildren();

    if (!consulta) {
      ocultarSugerencias();
      return;
    }

    var coincidencias = catalogoIngredientes.filter(function (ingrediente) {
      return normalizar(ingrediente).indexOf(consulta) !== -1 &&
        !ingredientes.some(function (agregado) {
          return normalizar(agregado) === normalizar(ingrediente);
        });
    }).slice(0, 6);

    if (coincidencias.length === 0) {
      ocultarSugerencias();
      return;
    }

    coincidencias.forEach(function (ingrediente) {
      var item = crearElemento("li");
      var opcion = crearElemento("button", "", ingrediente);
      opcion.type = "button";
      opcion.setAttribute("role", "option");
      opcion.dataset.ingrediente = ingrediente;
      item.appendChild(opcion);
      nodos.sugerencias.appendChild(item);
    });

    nodos.sugerencias.hidden = false;
    nodos.busqueda.setAttribute("aria-expanded", "true");
  }

  function agregarIngrediente(nombre) {
    var valor = nombre.trim();
    nodos.mensajeDespensa.textContent = "";

    if (!valor) {
      nodos.mensajeDespensa.textContent = "Escribe un ingrediente para agregarlo a tu despensa.";
      nodos.busqueda.focus();
      return;
    }

    var existente = ingredientes.some(function (ingrediente) {
      return normalizar(ingrediente) === normalizar(valor);
    });
    if (existente) {
      nodos.mensajeDespensa.textContent = valor + " ya está en tu despensa.";
      nodos.busqueda.value = "";
      ocultarSugerencias();
      nodos.busqueda.focus();
      return;
    }

    var sugerencia = catalogoIngredientes.find(function (ingrediente) {
      return normalizar(ingrediente) === normalizar(valor);
    });
    ingredientes.push(sugerencia || valor.charAt(0).toLocaleUpperCase("es") + valor.slice(1));
    nodos.busqueda.value = "";
    ocultarSugerencias();
    actualizarChips();
    nodos.busqueda.focus();
  }

  function crearTarjeta(receta, coincidencias, faltantes) {
    var tarjeta = crearElemento("article", "tarjeta-receta");
    var imagen = crearElemento("img", "tarjeta-receta-imagen");
    imagen.src = receta.imagen;
    imagen.alt = receta.nombre;
    imagen.loading = "lazy";
    tarjeta.appendChild(imagen);

    var contenido = crearElemento("div", "tarjeta-receta-contenido");
    contenido.appendChild(crearElemento("h3", "", receta.nombre));

    var estadoCompleto = faltantes.length === 0;
    var estado = crearElemento(
      "span",
      "estado-coincidencia " + (estadoCompleto ? "completa" : "parcial"),
      estadoCompleto
        ? "¡Tienes todo! (" + coincidencias.length + "/" + receta.ingredientes.length + ")"
        : "Te falta " + faltantes.length + " ingrediente" + (faltantes.length === 1 ? "" : "s") +
          " (" + coincidencias.length + "/" + receta.ingredientes.length + ")"
    );
    contenido.appendChild(estado);

    var ingredientesInfo = crearElemento("div", "ingredientes-receta");
    ingredientesInfo.appendChild(
      crearElemento(
        "p",
        faltantes.length ? "ingredientes-faltantes" : "ingredientes-disponibles",
        faltantes.length ? "× Falta: " + faltantes.join(", ") : "✓ " + receta.ingredientes.join(", ")
      )
    );
    if (faltantes.length) {
      ingredientesInfo.appendChild(
        crearElemento("p", "ingredientes-disponibles", "✓ " + coincidencias.join(", "))
      );
    }
    contenido.appendChild(ingredientesInfo);

    var verReceta = crearElemento("button", "boton-ver-receta", "Ver Receta");
    verReceta.type = "button";
    verReceta.dataset.recetaId = receta.id;
    contenido.appendChild(verReceta);
    tarjeta.appendChild(contenido);
    return tarjeta;
  }

  function renderizarRecetas() {
    var disponibles = ingredientes.map(normalizar);
    var resultados = recetas.map(function (receta) {
      var coincidencias = receta.ingredientes.filter(function (ingrediente) {
        return disponibles.indexOf(normalizar(ingrediente)) !== -1;
      });
      var faltantes = receta.ingredientes.filter(function (ingrediente) {
        return disponibles.indexOf(normalizar(ingrediente)) === -1;
      });
      return {
        receta: receta,
        coincidencias: coincidencias,
        faltantes: faltantes,
        porcentaje: coincidencias.length / receta.ingredientes.length
      };
    }).filter(function (resultado) {
      return resultado.coincidencias.length > 0;
    }).sort(function (a, b) {
      return b.porcentaje - a.porcentaje ||
        b.coincidencias.length - a.coincidencias.length ||
        a.receta.nombre.localeCompare(b.receta.nombre, "es");
    });

    nodos.listaRecetas.replaceChildren();
    nodos.resumenRecetas.textContent = resultados.length
      ? resultados.length + " receta" + (resultados.length === 1 ? "" : "s") + " para ti"
      : "";

    if (resultados.length === 0) {
      nodos.listaRecetas.appendChild(
        crearElemento("p", "estado-vacio-recetas", "Aún no encontramos recetas con esos ingredientes. Prueba agregando alguno más.")
      );
      return;
    }

    resultados.forEach(function (resultado) {
      nodos.listaRecetas.appendChild(
        crearTarjeta(resultado.receta, resultado.coincidencias, resultado.faltantes)
      );
    });
  }

  function abrirReceta(id) {
    var receta = recetas.find(function (elemento) {
      return elemento.id === id;
    });
    if (!receta) {
      return;
    }

    var detalle = crearElemento("div", "detalle-receta");
    var imagen = crearElemento("img", "detalle-receta-imagen");
    imagen.src = receta.imagen;
    imagen.alt = receta.nombre;
    detalle.appendChild(imagen);

    var contenido = crearElemento("div", "detalle-receta-contenido");
    contenido.appendChild(crearElemento("h2", "", receta.nombre));
    contenido.appendChild(
      crearElemento("p", "detalle-receta-meta", receta.minutos + " min · " + receta.porciones + " porciones")
    );
    contenido.appendChild(crearElemento("h3", "", "Ingredientes"));

    var listaIngredientes = crearElemento("ul");
    receta.ingredientes.forEach(function (ingrediente) {
      listaIngredientes.appendChild(crearElemento("li", "", ingrediente));
    });
    contenido.appendChild(listaIngredientes);
    contenido.appendChild(crearElemento("h3", "", "Preparación"));

    var pasos = crearElemento("ol");
    receta.pasos.forEach(function (paso) {
      pasos.appendChild(crearElemento("li", "", paso));
    });
    contenido.appendChild(pasos);
    detalle.appendChild(contenido);
    nodos.detalleReceta.replaceChildren(detalle);
    nodos.dialogo.showModal();
  }

  function conectarEventos() {
    nodos.formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      agregarIngrediente(nodos.busqueda.value);
    });

    nodos.busqueda.addEventListener("input", mostrarSugerencias);
    nodos.busqueda.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") {
        ocultarSugerencias();
      }
    });

    nodos.sugerencias.addEventListener("click", function (evento) {
      var opcion = evento.target.closest("button[data-ingrediente]");
      if (opcion) {
        agregarIngrediente(opcion.dataset.ingrediente);
      }
    });

    nodos.listaIngredientes.addEventListener("click", function (evento) {
      var boton = evento.target.closest("button[data-ingrediente]");
      if (!boton) {
        return;
      }
      ingredientes = ingredientes.filter(function (ingrediente) {
        return normalizar(ingrediente) !== normalizar(boton.dataset.ingrediente);
      });
      nodos.mensajeDespensa.textContent = "";
      actualizarChips();
    });

    nodos.botonBuscar.addEventListener("click", function () {
      if (ingredientes.length > 0) {
        renderizarRecetas();
      }
    });

    nodos.listaRecetas.addEventListener("click", function (evento) {
      var boton = evento.target.closest("button[data-receta-id]");
      if (boton) {
        abrirReceta(boton.dataset.recetaId);
      }
    });

    nodos.cerrarDialogo.addEventListener("click", function () {
      nodos.dialogo.close();
    });

    document.addEventListener("click", function (evento) {
      if (!nodos.formulario.contains(evento.target)) {
        ocultarSugerencias();
      }
    });
  }

  async function iniciarDespensa() {
    nodos = {
      formulario: document.getElementById("form-ingredientes"),
      busqueda: document.getElementById("busqueda-ingrediente"),
      sugerencias: document.getElementById("sugerencias-ingredientes"),
      listaIngredientes: document.getElementById("lista-ingredientes"),
      mensajeDespensa: document.getElementById("mensaje-despensa"),
      botonBuscar: document.getElementById("buscar-recetas"),
      ayudaBusqueda: document.getElementById("ayuda-busqueda"),
      listaRecetas: document.getElementById("lista-recetas"),
      resumenRecetas: document.getElementById("resumen-recetas"),
      dialogo: document.getElementById("dialogo-receta"),
      detalleReceta: document.getElementById("detalle-receta"),
      cerrarDialogo: document.getElementById("cerrar-dialogo")
    };

    try {
      var resultados = await Promise.all([
        window.despensaServicio.listarIngredientes(),
        window.despensaServicio.listarTodos()
      ]);
      catalogoIngredientes = resultados[0];
      recetas = resultados[1];
      conectarEventos();
      actualizarChips();
    } catch (error) {
      nodos.mensajeDespensa.textContent = "No fue posible cargar las recetas. Intenta recargar la página.";
      nodos.mensajeDespensa.setAttribute("role", "alert");
      console.error("Error al cargar la despensa virtual:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarDespensa);
})();
