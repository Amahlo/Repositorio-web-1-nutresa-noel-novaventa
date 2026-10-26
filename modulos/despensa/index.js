(function () {
  let catalogoIngredientes = [];
  let ingredientesSeleccionados = ["Pasta", "Ranchera", "Huevos", "Arroz"];

  let inputIngrediente;
  let listaSugerencias;
  let contenedorChips;

  function normalizarTexto(texto) {
    if (!texto) return "";
    return texto
      .normalize("NFC")
      .toLowerCase()
      .trim();
  }

  function renderizarChips() {
    if (!contenedorChips) return;
    contenedorChips.innerHTML = "";

    ingredientesSeleccionados.forEach((ingrediente, index) => {
      const chip = document.createElement("span");
      chip.className = "despensa-chip";
      chip.innerHTML = `
        ${ingrediente}
        <button type="button" class="despensa-chip-btn-remove" data-index="${index}" aria-label="Eliminar ${ingrediente}">×</button>
      `;
      contenedorChips.appendChild(chip);
    });

    const btnAgregar = document.createElement("button");
    btnAgregar.type = "button";
    btnAgregar.className = "despensa-btn-agregar";
    btnAgregar.textContent = "+ Agregar";
    btnAgregar.addEventListener("click", () => {
      if (inputIngrediente) inputIngrediente.focus();
    });
    contenedorChips.appendChild(btnAgregar);

    const botonesEliminar = contenedorChips.querySelectorAll(".despensa-chip-btn-remove");
    botonesEliminar.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.getAttribute("data-index"), 10);
        ingredientesSeleccionados.splice(idx, 1);
        renderizarChips();
      });
    });
  }

  async function manejarBusqueda(e) {
    const termino = normalizarTexto(e.target.value);

    if (!termino || termino.length < 2) {
      if (listaSugerencias) listaSugerencias.classList.add("d-none");
      return;
    }

    const coincidenciasNormales = catalogoIngredientes
      .filter((item) => normalizarTexto(item).includes(termino))
      .map(nombre => ({ textoVisual: nombre, nombreOficial: nombre}));

    let equivalencia = null;
    if (window.despensaServicio && typeof window.despensaServicio.buscarEquivalencia === "function") {
      equivalencia = await window.despensaServicio.buscarEquivalencia(termino);
    }

    let resultados = [...coincidenciasNormales];

    if (equivalencia) {
      resultados.unshift({
        textoVisual: `<strong>${equivalencia.terminoColoquial}</strong> <span style="color: gray; font-size: 0.9em;">→ ${equivalencia.ingredienteOficialNombre}</span>`,
        nombreOficial: equivalencia.ingredienteOficialNombre
      });
    }

    renderizarSugerencias(resultados);
  }

  function renderizarSugerencias(coincidencias) {
    if (!listaSugerencias) return;
    listaSugerencias.innerHTML = "";

    if (coincidencias.length === 0) {
      listaSugerencias.classList.add("d-none");
      return;
    }

    const unicos = [];
    const vistos = new Set();

    coincidencias.forEach(item => {
      const nomNorm = normalizarTexto(item.nombreOficial);
      if (!vistos.has(nomNorm)) {
        vistos.add(nomNorm);
        unicos.push(item);
      }
    });

    unicos.forEach((item) => {
      const li = document.createElement("li");
      li.style.cursor = "pointer";
      li.style.padding = "8px";
      li.style.borderBottom = "1px solid #eee";
      li.innerHTML = item.textoVisual;

      li.addEventListener("click", () => {
        const existe = ingredientesSeleccionados.some(
          (ing) => normalizarTexto(ing) === normalizarTexto(item.nombreOficial)
        );

        if (!existe) {
          ingredientesSeleccionados.push(item.nombreOficial);
          renderizarChips();
        }

        if (inputIngrediente) inputIngrediente.value = "";
        listaSugerencias.classList.add("d-none");
      });

      listaSugerencias.appendChild(li);
    });

    listaSugerencias.classList.remove("d-none");
  }

  async function iniciarDespensa() {
    const estado = document.getElementById("despensa-estado");

    inputIngrediente = document.getElementById("inputIngrediente");
    listaSugerencias = document.querySelector("#listaSugerencias");
    contenedorChips = document.getElementById("contenedorChips");

    try {
      if (window.despensaServicio && typeof window.despensaServicio.listarIngredientes === "function") {
        catalogoIngredientes = await window.despensaServicio.listarIngredientes();
      } else if (window.despensaServicio && typeof window.despensaServicio.listarTodos === "function") {
        await window.despensaServicio.listarTodos();
      }

      if (estado) {
        estado.textContent = "Estructura base del módulo despensa cargada correctamente.";
      }

      renderizarChips();

      if (inputIngrediente) {
        inputIngrediente.addEventListener("input", manejarBusqueda);
      }

      document.addEventListener("click", (e) => {
        const contenedorBuscador = document.getElementById("contenedorBuscador");
        if (
          contenedorBuscador &&
          !contenedorBuscador.contains(e.target) &&
          listaSugerencias &&
          !listaSugerencias.contains(e.target)
        ) {
          listaSugerencias.classList.add("d-none");
        }
      });

    } catch (error) {
      if (estado) {
        estado.setAttribute("role", "alert");
        estado.textContent = "No fue posible cargar la base de despensa.";
      }
      console.error("Error al inicializar la despensa:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarDespensa);
})();