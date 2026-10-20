Módulo Despensa Virtual y Sugerencias
Documentación de Historias de Usuario (HU)

Estudiante: Catalina Lombana
Modelo asignado: Despensa Virtual y Sugerencias.
Historia de Usuario 2: Recetas posibles según la despensa
Código de rama: feature/despensa/G1-DES-F02-recetas
Descripción del entregable: Desarrollar la sección visual y lógica en JavaScript imperativo (Vanilla JS) que muestre, dentro de la interfaz "Puedes cocinar hoy", una tarjeta por cada receta disponible, con su nombre, sus porciones y sus minutos de preparación. En esta primera versión no se calcula el porcentaje de coincidencia, porque aún no existen los ingredientes por receta.
Criterios de aceptación:
1.	Consumo de datos y asincronía: Las recetas se obtienen llamando a la función asíncrona del servicio local (despensaServicio.listarRecetas()), gestionando la respuesta mediante await y bloques try/catch. Si el servicio falla, se informa en el elemento de estado con role="alert".
2.	Manipulación del DOM imperativa: El contenedor de tarjetas se selecciona con document.getElementById("lista-recetas-despensa") y se agrega una tarjeta por cada receta recibida, usando métodos nativos como document.createElement y appendChild.
3.	Estructura y maquetación: Cada receta se presenta con marcado semántico (article con un título h3 y los datos de porciones y minutos), dentro de la sección "Puedes cocinar hoy".
4.	Gestión de caracteres especiales (UTF-8 y NFC): Los nombres de receta con tildes o eñes se renderizan normalizados con .normalize('NFC'), y los archivos se guardan en UTF-8.
5.	Estilos e integración modular: Los estilos de las tarjetas se crean en modulos/despensa/despensa.css. El archivo assets/css/sazon.css se mantiene intacto.
