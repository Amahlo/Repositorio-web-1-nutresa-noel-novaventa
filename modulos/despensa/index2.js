(function () {
    async function sincronizarSugerenciasRecetas() {
        const contenedorRecetas = document.getElementById("recetas-sugeridas-contenedor");
        const estadoRecetas = document.getElementById("recetas-estado");

        if (!contenedorRecetas) return;
    }

    try {
        if (estadoRecetas) {
            estadoRecetas.removeAttribute("role");
            estadoRecetas.textContent = "Recalculando coincidencia de recetas...";
        }

        const ingredientesActuales = await window.despensaServicio.listarTodos();

        if (!Array.isArray(ingredientesActuales) || ingredientesActuales.length === 0) {
            contenedorRecetas.innerHTML = `<div class="recetas-sugeridas-vacia">
                <p>No hay ingredientes en la despensa para calcular sugerencias de recetas.</p>
            </div>`;
            if (estadoRecetas) estadoRecetas.textContent = "Sin ingredientes para calcular sugerencias.";
            return;
        }
        const sugerencias = await window.recetasServicio.calcularSugerencias(ingredientesActuales);

        if (typeof window.renderizarSugerencias === "function") {
            window.renderizarSugerencias(sugerencias);
        }

        if (estadoRecetas) {
            estadoRecetas.textContent = `Sugerencias actualizadas (${sugerencias.length} recetas encontradas).`;
        }
        if (estadoRecetas) estadoRecetas.textContent = "Sin ingredientes para calcular sugerencias.";
        return;
    }

    } catch (error) {

}


document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("despensa:actualizada", sincronizarSugerenciasRecetas);

});
}) ();