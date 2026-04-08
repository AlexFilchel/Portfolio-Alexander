Desarrolla una actualización completa de la aplicación “Mis proyectos” dentro del portfolio, manteniendo la estética, arquitectura y comportamiento visual actual.

 Objetivo

Reemplazar los proyectos existentes por un único proyecto tipo ecommerce, incorporando una vista interactiva con navegación entre listado y detalle.

 Cambios iniciales
Eliminar todos los proyectos actuales.
Agregar un único proyecto (por ahora), preparado para escalar a múltiples proyectos en el futuro.
 Vista principal (Listado de proyectos)
Contenido:
Mostrar una tarjeta de proyecto destacada.
El elemento principal debe ser un GIF animado ubicado en:
videos/videoVesper.gif
Diseño:
El GIF debe ser el foco visual principal.
Mantener estilos existentes (bordes, sombras, tipografía, espaciado).
Debajo del GIF agregar un botón:

Botón: Detalles

Interacción (muy importante)

Al hacer clic en “Detalles”:

Se debe reemplazar completamente todo el contenido debajo del contenedor “Mis proyectos”.
No debe haber navegación a otra página (todo ocurre dentro de la misma vista/app).
Debe ocultarse el listado de proyectos.
 Vista de detalle del proyecto
Estructura:
1. Navegación
Agregar una flecha en la esquina superior izquierda, justo debajo del header “Mis proyectos”.
Esta flecha permite volver al listado de proyectos.
2. Contenido principal
Mostrar el GIF (videoVesper.gif) en un tamaño más grande que en la vista anterior.
3. Descripción (IMPORTANTE: dejar espacio editable)

Incluir secciones bien estructuradas para completar posteriormente:

Descripción del proyecto:
La aplicación fue desarrollada en el frontend con HTML, CSS y JavaScript vanilla, mientras que el backend está implementado con Java y Spring Boot. La seguridad se resuelve con Auth0 + JWT, la persistencia con MySQL + JPA, la gestión de imágenes con Cloudinary y los pagos con integración a Mercado Pago y Ualá. A nivel de despliegue, el sistema puede ejecutarse en contenedores gracias a Docker y Docker Compose
Tecnologías utilizadas:



Frontend
- HTML
- CSS
- JavaScript 



Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- Bean Validation
- Lombok

Base de datos e integraciones
- MySQL
- Auth0
- Cloudinary
- Mercado Pago SDK
- Ualá


Despliegue
- Docker
- Docker Compose

Características principales:


- Catálogo público de productos
- Búsqueda de productos por término
- Filtros por tipo, género, marca y precio
- Carrito de compras
- Checkout con selección de método de pago
- Integración con Mercado Pago y Ualá
- Registro y autenticación de usuarios con Auth0
- Perfil de usuario editable
- Panel de administración protegido por roles
- Gestión de productos destacados
- Subida de imágenes para productos
- Diseño responsive para desktop y mobile


Detalles técnicos / arquitectura (opcional):


- Arquitectura por capas en backend: controller, service, repo, entity, dto, config.
- Autorización basada en roles usando JWT y claims personalizados de Auth0.
- Modelo de dominio extensible con herencia JPA 
- Persistencia relacional con MySQL.
- Carga de imágenes externalizada en Cloudinary.
- Manejo global de errores con respuestas JSON uniformes.
- Containerización con Docker multi-stage y base de datos orquestada con Docker Compose.


 Diseño y UX
Mantener consistencia total con la estética actual:
Colores
Tipografía
Espaciados
Componentes UI
Transiciones suaves entre vista listado y detalle.
Jerarquía visual clara (GIF → info).
📱 Responsive
Debe adaptarse correctamente a:
Desktop
Tablet
Mobile
El GIF debe escalar adecuadamente sin romper layout.
Botones y navegación accesibles en pantallas pequeñas.
⚙️ Requisitos técnicos
Arquitectura preparada para agregar más proyectos en el futuro.
Separar lógica de:
Vista listado
Vista detalle
Evitar recargas de página (SPA behavior).

recuerda utilizar la skill de react que agregue anteriormente.