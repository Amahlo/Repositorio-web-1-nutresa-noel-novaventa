/**
 * Sazón – Módulo Despensa
 * Funcionalidad: Historial de consumo
 *
 * Uso:
 *   <div id="historial-consumo"></div>
 *   <script src="historial-consumo.js"></script>
 *
 * Criterios de aceptación cubiertos:
 *  1. Visualizar historial  -> render() / tabla con producto, cantidad y fecha
 *  2. Consultar registros   -> filtrar() por nombre y/o rango de fechas
 *  3. Editar registros      -> editar() con edición en línea (producto, cantidad, fecha)
 *  4. Utilizar el historial -> frecuencia() y sugerenciasCompra()
 *  5. Guardar cambios       -> guardar() persiste en localStorage y re-renderiza
 */

(function () {
  "use strict";

  const STORAGE_KEY = "sazon_historial_consumo";

  /* ------------------------------------------------------------------ */
  /*  Capa de datos                                                      */
  /* ------------------------------------------------------------------ */

  class HistorialConsumo {
    constructor() {
      this.registros = this._cargar();
    }

    _cargar() {
      try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(datos)) return datos;
      } catch (e) {
        console.error("No se pudo leer el historial:", e);
      }
      return [];
    }

    // Criterio 5: guardar cambios
    guardar() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.registros));
        return true;
      } catch (e) {
        console.error("No se pudo guardar el historial:", e);
        return false;
      }
    }

    _validar({ producto, cantidad, fecha }) {
      if (!producto || !String(producto).trim()) return "El producto es obligatorio.";
      const n = Number(cantidad);
      if (!Number.isFinite(n) || n <= 0) return "La cantidad debe ser un número mayor a 0.";
      if (!fecha || isNaN(new Date(fecha + "T00:00:00"))) return "La fecha no es válida.";
      return null;
    }

    agregar({ producto, cantidad, fecha }) {
      const error = this._validar({ producto, cantidad, fecha });
      if (error) return { ok: false, error };
      const registro = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        producto: String(producto).trim(),
        cantidad: Number(cantidad),
        fecha,
      };
      this.registros.push(registro);
      this.guardar();
      return { ok: true, registro };
    }

    // Criterio 3: editar registros (producto, cantidad o fecha)
    editar(id, cambios) {
      const registro = this.registros.find((r) => r.id === id);
      if (!registro) return { ok: false, error: "Registro no encontrado." };
      const actualizado = { ...registro, ...cambios };
      const error = this._validar(actualizado);
      if (error) return { ok: false, error };
      registro.producto = String(actualizado.producto).trim();
      registro.cantidad = Number(actualizado.cantidad);
      registro.fecha = actualizado.fecha;
      this.guardar();
      return { ok: true, registro };
    }

    eliminar(id) {
      this.registros = this.registros.filter((r) => r.id !== id);
      this.guardar();
    }

    // Criterio 2: consultar por nombre y/o fecha (rango)
    filtrar({ texto = "", desde = "", hasta = "" } = {}) {
      const t = normalizar(texto);
      return this.registros
        .filter((r) => {
          if (t && !normalizar(r.producto).includes(t)) return false;
          if (desde && r.fecha < desde) return false;
          if (hasta && r.fecha > hasta) return false;
          return true;
        })
        .sort((a, b) => b.fecha.localeCompare(a.fecha)); // más recientes primero
    }

    // Criterio 4: productos más frecuentes
    frecuencia(registros = this.registros) {
      const mapa = new Map();
      registros.forEach((r) => {
        const clave = normalizar(r.producto);
        const item = mapa.get(clave) || {
          producto: r.producto,
          veces: 0,
          cantidadTotal: 0,
          ultimaFecha: r.fecha,
        };
        item.veces += 1;
        item.cantidadTotal += r.cantidad;
        if (r.fecha > item.ultimaFecha) item.ultimaFecha = r.fecha;
        mapa.set(clave, item);
      });
      return [...mapa.values()].sort(
        (a, b) => b.veces - a.veces || b.cantidadTotal - a.cantidadTotal
      );
    }

    // Criterio 4: apoyo a la planificación de compras
    // Estima el consumo promedio por día y sugiere la cantidad para `dias` días.
    sugerenciasCompra(dias = 7, limite = 5) {
      return this.frecuencia()
        .slice(0, limite)
        .map((p) => {
          const fechas = this.registros
            .filter((r) => normalizar(r.producto) === normalizar(p.producto))
            .map((r) => new Date(r.fecha + "T00:00:00").getTime());
          const rangoDias = Math.max(
            1,
            Math.round((Math.max(...fechas) - Math.min(...fechas)) / 86400000) + 1
          );
          const promedioDiario = p.cantidadTotal / rangoDias;
          return {
            producto: p.producto,
            veces: p.veces,
            sugerido: Math.ceil(promedioDiario * dias),
          };
        });
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Utilidades                                                         */
  /* ------------------------------------------------------------------ */

  function normalizar(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function escapar(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function formatearFecha(iso) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  function hoyISO() {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mes}-${dia}`;
  }

  /* ------------------------------------------------------------------ */
  /*  Interfaz                                                           */
  /* ------------------------------------------------------------------ */

  class HistorialConsumoUI {
    constructor(contenedor, modelo) {
      this.el = contenedor;
      this.modelo = modelo;
      this.filtros = { texto: "", desde: "", hasta: "" };
      this.editandoId = null;
      this.mensaje = null;
      this._estructura();
      this.render();
    }

    _estructura() {
      this.el.innerHTML = `
        <section class="sz-hc">
          <h2>Historial de consumo</h2>
          <p id="sz-msg" role="status" aria-live="polite"></p>

          <fieldset>
            <legend>Registrar consumo</legend>
            <input id="sz-nuevo-producto" placeholder="Producto" />
            <input id="sz-nuevo-cantidad" type="number" min="0" step="any" placeholder="Cantidad" />
            <input id="sz-nuevo-fecha" type="date" />
            <button id="sz-agregar" type="button">Agregar</button>
          </fieldset>

          <fieldset>
            <legend>Buscar y filtrar</legend>
            <input id="sz-f-texto" placeholder="Nombre del producto" />
            <label>Desde <input id="sz-f-desde" type="date" /></label>
            <label>Hasta <input id="sz-f-hasta" type="date" /></label>
            <button id="sz-limpiar" type="button">Limpiar</button>
          </fieldset>

          <table>
            <thead>
              <tr><th>Producto</th><th>Cantidad</th><th>Fecha</th><th>Acciones</th></tr>
            </thead>
            <tbody id="sz-tbody"></tbody>
          </table>

          <div id="sz-analisis"></div>
        </section>`;

      const $ = (id) => this.el.querySelector(id);
      $("#sz-nuevo-fecha").value = hoyISO();

      $("#sz-agregar").addEventListener("click", () => {
        const r = this.modelo.agregar({
          producto: $("#sz-nuevo-producto").value,
          cantidad: $("#sz-nuevo-cantidad").value,
          fecha: $("#sz-nuevo-fecha").value,
        });
        if (r.ok) {
          $("#sz-nuevo-producto").value = "";
          $("#sz-nuevo-cantidad").value = "";
          this._avisar("Registro agregado correctamente.");
        } else {
          this._avisar(r.error, true);
        }
        this.render();
      });

      const actualizarFiltros = () => {
        this.filtros = {
          texto: $("#sz-f-texto").value,
          desde: $("#sz-f-desde").value,
          hasta: $("#sz-f-hasta").value,
        };
        this.render();
      };
      ["#sz-f-texto", "#sz-f-desde", "#sz-f-hasta"].forEach((s) =>
        $(s).addEventListener("input", actualizarFiltros)
      );
      $("#sz-limpiar").addEventListener("click", () => {
        $("#sz-f-texto").value = $("#sz-f-desde").value = $("#sz-f-hasta").value = "";
        actualizarFiltros();
      });

      // Delegación de eventos para acciones por fila
      $("#sz-tbody").addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-accion]");
        if (!btn) return;
        const id = btn.dataset.id;
        const accion = btn.dataset.accion;

        if (accion === "editar") {
          this.editandoId = id;
        } else if (accion === "cancelar") {
          this.editandoId = null;
        } else if (accion === "guardar") {
          const fila = btn.closest("tr");
          const r = this.modelo.editar(id, {
            producto: fila.querySelector("[name=producto]").value,
            cantidad: fila.querySelector("[name=cantidad]").value,
            fecha: fila.querySelector("[name=fecha]").value,
          });
          if (r.ok) {
            this.editandoId = null;
            this._avisar("Cambios guardados.");
          } else {
            this._avisar(r.error, true);
          }
        } else if (accion === "eliminar") {
          if (confirm("¿Eliminar este registro?")) {
            this.modelo.eliminar(id);
            this._avisar("Registro eliminado.");
          }
        }
        this.render();
      });
    }

    _avisar(texto, esError = false) {
      this.mensaje = { texto, esError };
    }

    // Criterio 1: visualizar historial
    render() {
      const registros = this.modelo.filtrar(this.filtros);
      const tbody = this.el.querySelector("#sz-tbody");

      if (registros.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">No hay registros de consumo${
          this.filtros.texto || this.filtros.desde || this.filtros.hasta
            ? " que coincidan con la búsqueda"
            : " todavía"
        }.</td></tr>`;
      } else {
        tbody.innerHTML = registros
          .map((r) =>
            r.id === this.editandoId ? this._filaEdicion(r) : this._filaLectura(r)
          )
          .join("");
      }

      this._renderAnalisis(registros);

      const msg = this.el.querySelector("#sz-msg");
      if (this.mensaje) {
        msg.textContent = this.mensaje.texto;
        msg.style.color = this.mensaje.esError ? "#b00020" : "#1b6e2d";
        this.mensaje = null;
      } else {
        msg.textContent = "";
      }
    }

    _filaLectura(r) {
      return `
        <tr>
          <td>${escapar(r.producto)}</td>
          <td>${r.cantidad}</td>
          <td>${formatearFecha(r.fecha)}</td>
          <td>
            <button type="button" data-accion="editar" data-id="${r.id}">Editar</button>
            <button type="button" data-accion="eliminar" data-id="${r.id}">Eliminar</button>
          </td>
        </tr>`;
    }

    _filaEdicion(r) {
      return `
        <tr>
          <td><input name="producto" value="${escapar(r.producto).replace(/"/g, "&quot;")}" /></td>
          <td><input name="cantidad" type="number" min="0" step="any" value="${r.cantidad}" /></td>
          <td><input name="fecha" type="date" value="${r.fecha}" /></td>
          <td>
            <button type="button" data-accion="guardar" data-id="${r.id}">Guardar</button>
            <button type="button" data-accion="cancelar" data-id="${r.id}">Cancelar</button>
          </td>
        </tr>`;
    }

    // Criterio 4: utilizar el historial (frecuencia + sugerencias de compra)
    _renderAnalisis(registrosFiltrados) {
      const cont = this.el.querySelector("#sz-analisis");
      const top = this.modelo.frecuencia(registrosFiltrados).slice(0, 5);
      const sugerencias = this.modelo.sugerenciasCompra(7, 5);

      if (top.length === 0) {
        cont.innerHTML = "";
        return;
      }

      cont.innerHTML = `
        <h3>Productos que más consumes</h3>
        <ol>
          ${top
            .map(
              (p) =>
                `<li>${escapar(p.producto)} – ${p.veces} ${
                  p.veces === 1 ? "vez" : "veces"
                } (total: ${p.cantidadTotal}, último: ${formatearFecha(p.ultimaFecha)})</li>`
            )
            .join("")}
        </ol>
        <h3>Sugerencia para tu próxima compra (7 días)</h3>
        <ul>
          ${sugerencias
            .map((s) => `<li>${escapar(s.producto)}: aprox. ${s.sugerido} unidades</li>`)
            .join("")}
        </ul>`;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Inicialización                                                     */
  /* ------------------------------------------------------------------ */

  function iniciar() {
    const contenedor = document.getElementById("historial-consumo");
    if (!contenedor) {
      console.warn('Sazón: no se encontró el contenedor #historial-consumo');
      return;
    }
    const modelo = new HistorialConsumo();
    new HistorialConsumoUI(contenedor, modelo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }

  // Exponer la lógica para pruebas o integración con otros módulos de Despensa
  window.SazonHistorialConsumo = { HistorialConsumo, HistorialConsumoUI };
})();