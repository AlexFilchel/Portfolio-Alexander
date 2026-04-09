Quiero que ajustes el comportamiento responsive de la barra de tareas de mi página estilo escritorio.

PROBLEMA ACTUAL:
Actualmente, cuando la pantalla se achica, parece que toda la interfaz o la barra de tareas se reduce usando `scale` o un comportamiento similar. Eso NO es lo que quiero.

COMPORTAMIENTO DESEADO:
Quiero que la barra de tareas mantenga su tamaño visual normal y que se adapte achicando sus espacios internos de forma progresiva, no escalando todo el componente. Sin tocar el estilo mobile, ese esta bien

OBJETIVO PRINCIPAL:
Cuando el ancho de la pantalla disminuya:
1. La barra de tareas NO debe achicarse con `transform: scale(...)`.
2. La barra debe seguir teniendo una distancia constante respecto al borde inferior de la pantalla.
3. También debe mantener, en lo posible, una distancia constante respecto a los costados.
4. Si la pantalla se vuelve más chica, primero debe reducirse el ancho útil interno de la barra, no escalar toda la barra.
5. El bloque de la derecha donde está la hora debe ir desplazándose progresivamente hacia el centro.
6. En consecuencia, los extremos vacíos izquierdo y derecho de la barra deben ir reduciéndose.
7. Los iconos centrales deben mantenerse centrados visualmente dentro de la barra.
8. Solo cuando el ancho sea realmente muy pequeño, se puede reducir un poco el margen lateral externo, pero recién después de haber comprimido el espacio interno de la barra. sin tocar el estilo mobile, ese esta bien
9. No quiero que el contenido se vea “miniaturizado”; quiero reflujo de layout, no escalado.

REQUERIMIENTOS DE IMPLEMENTACIÓN:
- Revisar y eliminar cualquier uso de `transform: scale()`, `zoom`, o lógica similar aplicada a la barra de tareas o a su contenedor principal.
- Implementar un layout responsive real usando Flexbox o Grid.
- La barra de tareas debe tener:
  - un contenedor principal fijo o absoluto abajo
  - ancho responsive real
  - padding horizontal adaptable
  - distribución interna flexible
- El sector derecho (hora, wifi, volumen, etc.) debe estar dentro de un contenedor independiente que pueda acercarse al centro a medida que disminuye el ancho disponible.
- El grupo central de iconos debe permanecer estable y visualmente centrado.
- El ancho de la barra debe adaptarse con `width`, `max-width`, `min-width`, `clamp()`, `calc()` o media queries, pero NO con scale.
- Mantener una separación inferior constante.
- Mantener separación lateral constante mientras haya espacio suficiente.
- En pantallas pequeñas, priorizar:
  1. reducir espacios internos vacíos,
  2. acercar el bloque derecho al centro,
  3. recién después reducir márgenes laterales externos.

ESTRUCTURA ESPERADA:
Quiero que analices la estructura actual y la refactors si hace falta para que la barra tenga una lógica parecida a esta:
- contenedor exterior alineado abajo
- barra de tareas con ancho fluido
- zona izquierda flexible o vacía
- zona central con iconos
- zona derecha con hora y estado
La idea es que las zonas laterales sean las que cedan espacio cuando se achique la pantalla, no que se reduzca toda la barra visualmente.

IMPORTANTE:
- No romper el diseño actual.
- No cambiar el estilo visual general.
- No tocar tamaños de iconos salvo que sea estrictamente necesario en breakpoints muy chicos.
- Priorizar una solución limpia, responsive y mantenible.
- Si actualmente hay wrappers que fuerzan escalado, eliminarlos o reemplazarlos por una solución de layout real.
- Quiero que el resultado se comporte como una barra de tareas real: conserva su presencia visual, pero reorganiza sus espacios internos cuando falta ancho.
No cambiar el diseño mobile (es a partir de cuando cambia la imagen del fondo)

