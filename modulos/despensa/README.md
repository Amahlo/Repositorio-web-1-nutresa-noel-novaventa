# Módulo Despensa Virtual y Sugerencias

## Documentación de Historias de Usuario (HU)

---

### **Estudiante:** Hernán Darío Pérez Higuita  
* **Modelo asignado:** Despensa Virtual y Sugerencias.  
* **Historia de Usuario 1:** Buscador Virtual y Sugerencia de Recetas  
* **Código de Rama:** `feature/despensa/G1-DES-F01-buscador`  

#### **Descripción del entregable:**
Desarrollar la sección visual y lógica en JavaScript imperativo (Vanilla JS) que permita gestionar el buscador de ingredientes dentro de la interfaz "Mi despensa". La funcionalidad debe capturar la búsqueda ingresada por el usuario.

#### **Criterios de aceptación:**
1. **Consumo de datos y asincronía:** Los ingredientes disponibles se obtienen llamando a la función asíncrona del servicio local (`despensaServicio.listarIngredientes()`), gestionando la respuesta mediante `await` y bloques `try/catch` para un control óptimo de excepciones.
2. **Manipulación del DOM imperativa:** La selección y actualización de elementos visuales (campo de texto, lista desplegable de coincidencias y contenedor de chips) debe realizarse estrictamente mediante métodos nativos del DOM como `document.querySelector` y `document.getElementById`.
3. **Estructura y Maquetación del Buscador:** Implementación de marcado semántico HTML integrando la caja de búsqueda mediante la clase `.mk-input mb-2` y el ícono `bi bi-search`[cite: 2]. Las métricas de maquetación (Box Model) deben asegurar un padding interno de `11.2px 8px`, borde de `1px` y comportamiento flexible adaptado a la plantilla base[cite: 2].
4. **Gestión de caracteres especiales (UTF-8 y NFC):** La comparación y renderizado de los nombres de ingredientes con tildes o eñes (ej. *champiñones*, *jalapeño*) debe sanitizarse usando codificación UTF-8 y la normalización `.normalize('NFC')` para evitar discrepancias al filtrar.
5. **Estilos e Integración Modular:** Los estilos base provienen de `assets/css/sazon.css` (el cual se mantiene intacto). Toda personalización específica del buscador, botones de agregar (`+ Agregar`) y fichas verdes de ingredientes activos debe crearse e importarse desde el archivo local `modulos/despensa/despensa.css`.

* **Modelo asignado:** Despensa Virtual y Sugerencias.  
* **Historia de Usuario 3.3.3:** Manejo de equivalencias y nombres alternativos de ingredientes  
* **Código de Rama:** `feature/despensa/G3-BUS-F03-equivalencias`  

#### **Descripción del entregable:**
Integrar en el buscador la capacidad de reconocer nombres comunes o sinónimos de ingredientes (conectando con la lógica de equivalencias del back) para facilitar el registro en la despensa.

#### **Criterios de aceptación:**
1. **Consulta asíncrona:** Consulta a las reglas de equivalencia a través de la capa de servicios asíncronos.
2. **Mapeo de denominaciones:** Mapeo correcto de denominaciones alternativas hacia el ingrediente oficial del maestro corporativo.
3. **Integridad de los datos:** Pruebas de búsqueda con términos coloquiales sin alterar la integridad de los datos maestros.
4. **Delimitación de desarrollo:** Código escrito estrictamente dentro de la zona delimitada del estudiante en el archivo JavaScript compartido.