 HU-desp-001-sugerencia-recetas
 Gestión de Despensa Virtual y Sugerencia de Recetas 

COMO un usuario que tiene ingredientes en casa pero no sabe que cocinar 
QUIERO una sección interactiva de "Despensa Virtual" donde pueda añadir los ingredientes que tengo disponibles
PARA descubrir recetas adecuadas que pueda preparar con lo que tengo

Criterios de Aceptación 

Escenario 1: Agregar ingredientes a la Despensa Virtual
Dado que me encuentro en la sección "Despensa Virtual",
Cuando busco un ingrediente en la barra de búsqueda 
Entonces el sistema debe agregar el ingrediente a mi lista visible de "Tus ingredientes agregados" 
Y la barra de búsqueda debe quedar libre para ingresar otro ingrediente.


Escenario 2: Buscar y visualizar recetas recomendadas
que he agregado al menos un ingrediente a mi lista,
Cuando presiono el botón principal "¡Buscar Recetas!",
Entonces el sistema debe mostrarme un listado de recetas recomendadas ordenadas según el nivel de coincidencia con mis ingredientes.

Y cada tarjeta de receta debe mostrar:
El nombre y la foto de la receta.

El estado de coincidencia destacado de forma visual:
Verde ("¡Tienes todo! (3/3)") si cuento con todos los ingredientes necesarios.
Amarillo ("Te falta 1 ingrediente (3/4)") si me falta una cantidad mínima de ingredientes.
Una lista rápida de lo que me falta (ej. "✕ Falta: Pimiento") y de lo que tengo.

Un botón de acción "Ver Receta".

