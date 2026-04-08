const vesperProjectMedia = new URL('../../videos/videoVesper.gif', import.meta.url).href;

export const projects = [
  {
    slug: 'vesper-ecommerce',
    name: 'Ecommerce App',
    status: 'Proyecto ecommerce · Escalable',
    shortDescription:
      'Ecommerce desarrollado con foco en una navegación clara, gestión de productos y un flujo de compra simple y funcional, pensado para ofrecer una experiencia consistente de principio a fin.',
    description:
      'La aplicación fue desarrollada en el frontend con HTML, CSS y JavaScript vanilla, mientras que el backend está implementado con Java y Spring Boot. La seguridad se resuelve con Auth0 + JWT, la persistencia con MySQL + JPA, la gestión de imágenes con Cloudinary y los pagos con integración a Mercado Pago y Ualá. A nivel de despliegue, el sistema puede ejecutarse en contenedores gracias a Docker y Docker Compose',
    media: {
      src: vesperProjectMedia,
      alt: 'Vista previa animada del proyecto Vesper Ecommerce',
    },
    technologies: {
      frontend: ['HTML', 'CSS', 'JavaScript'],
      backend: [
        'Java 21',
        'Spring Boot',
        'Spring Web',
        'Spring Security',
        'Spring Data JPA',
        'Hibernate',
        'Bean Validation',
        'Lombok',
      ],
      dataAndIntegrations: ['MySQL', 'Auth0', 'Cloudinary', 'Mercado Pago SDK', 'Ualá'],
      deployment: ['Docker', 'Docker Compose'],
    },
    features: [
      'Catálogo público de productos',
      'Búsqueda de productos por término',
      'Filtros por tipo, género, marca y precio',
      'Carrito de compras',
      'Checkout con selección de método de pago',
      'Integración con Mercado Pago y Ualá',
      'Registro y autenticación de usuarios con Auth0',
      'Perfil de usuario editable',
      'Panel de administración protegido por roles',
      'Gestión de productos destacados',
      'Subida de imágenes para productos',
      'Diseño responsive para desktop y mobile',
    ],
    architectureDetails: [
      'Arquitectura por capas en backend: controller, service, repo, entity, dto, config.',
      'Autorización basada en roles usando JWT y claims personalizados de Auth0.',
      'Modelo de dominio extensible con herencia JPA',
      'Persistencia relacional con MySQL.',
      'Carga de imágenes externalizada en Cloudinary.',
      'Manejo global de errores con respuestas JSON uniformes.',
      'Containerización con Docker multi-stage y base de datos orquestada con Docker Compose.',
    ],
  },
];
