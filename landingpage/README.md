# Gimnasio Carrie

Landing page con panel de administración, autenticación por sesión y persistencia en Turso.

## Requisitos

- Node.js 20+
- Variables de entorno para Turso si quieres usar la base remota:
  - `TURSO_DATABASE_URL`
  - `TURSO_AUTH_TOKEN`
- Variable de entorno para el frontend si el backend vive en otro dominio:
  - `VITE_API_BASE_URL`

Si no defines esas variables, el backend usa una base SQLite local en `data/local.db`.

Para subida de imágenes en el panel admin, define además:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

## Scripts

- `npm run dev`
  - levanta frontend y backend en desarrollo
- `npm run build`
  - compila el frontend
- `npm run start`
  - sirve `dist/` y la API desde Express
- `npm run migrate`
  - crea tablas y contenido inicial
- `npm run create-admin -- --email admin@colegio.com --password TuClaveSegura`
  - crea el usuario administrador

## Rutas

- Sitio público: `/`
- Panel admin: `/admin`

## Qué se administra

- Información general del sitio
- Hero principal
- Tarjetas de metodología
- Sección nosotros
- Galería
- Bloque de padres y contacto
- Footer
- Encabezado de noticias y eventos
- Noticias y eventos
- Subida de imágenes a Cloudinary desde el panel admin

## Cache

- `GET /api/public/site` usa cache en memoria para evitar consultar Turso en cada recarga.
- La cache se invalida cuando se guarda una sección del sitio o cuando se crea, actualiza o elimina una noticia/evento.
- La respuesta incluye la cabecera `X-Cache` con `MISS` o `HIT`.

## Patrón de navegación: lista → detalle

Todos los módulos que muestran colecciones (noticias, eventos, programas, galería, etc.) deben seguir este flujo:

1. **Vista de lista** — se muestra por defecto. Cada ítem muestra solo información mínima: imagen, título y extracto.
2. **Vista de detalle** — se activa al seleccionar un ítem de la lista. Muestra el contenido completo.
3. El usuario puede volver a la lista desde el detalle (botón "Volver" o equivalente).

No se debe mostrar el detalle directamente al cargar la sección. Este patrón aplica a:

- Noticias
- Eventos
- Cualquier otro módulo con listado que se agregue en el futuro

## Notas

- Si no defines `VITE_API_BASE_URL`, el frontend usa rutas relativas como `/api/...`.
- En desarrollo eso funciona con el proxy configurado en [vite.config.js](/home/juan/Documentos/Dev/Proyectos/gimnasiocarrie/landingpage/vite.config.js:1).
- Si despliegas frontend y backend por separado, usa algo como `VITE_API_BASE_URL=https://api.tudominio.com`.
- El login usa cookie `httpOnly` de sesión.
- El formulario público de contacto guarda mensajes en la tabla `contacts`.
- Las noticias y eventos se almacenan en la tabla `posts` y el admin los consulta con paginación desde el servidor.
- Si Cloudinary no está configurado, el panel sigue funcionando pero solo con URLs manuales.
