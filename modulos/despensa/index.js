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

  function manejarBusqueda(e) {
    const termino = normalizarTexto(e.target.value);

    if (!termino) {
      if (listaSugerencias) listaSugerencias.classList.add("d-none");
      return;
    }

    const coincidencias = catalogoIngredientes.filter((item) =>
      normalizarTexto(item).includes(termino)
    );

    renderizarSugerencias(coincidencias);
  }

  function renderizarSugerencias(coincidencias) {
    if (!listaSugerencias) return;
    listaSugerencias.innerHTML = "";

    if (coincidencias.length === 0) {
      listaSugerencias.classList.add("d-none");
      return;
    }

    coincidencias.forEach((nombreIngrediente) => {
      const li = document.createElement("li");
      li.textContent = nombreIngrediente;

      li.addEventListener("click", () => {
        const existe = ingredientesSeleccionados.some(
          (item) => normalizarTexto(item) === normalizarTexto(nombreIngrediente)
        );

        if (!existe) {
          ingredientesSeleccionados.push(nombreIngrediente);
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