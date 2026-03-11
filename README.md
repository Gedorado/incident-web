# Incident Manager - Frontend

Aplicacion web para la gestion de incidentes. Permite visualizar, crear y gestionar incidentes de infraestructura con seguimiento de estado y linea de tiempo de eventos.

## Stack tecnologico

- **React 19** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **React Router** para navegacion SPA
- **Vitest** + Testing Library para tests
- CSS puro (sin librerias de UI externas)

## Funcionalidades

- **Listado de incidentes**: tabla con filtros por estado, severidad y busqueda de texto. Paginacion integrada.
- **Creacion de incidentes**: formulario con validacion de campos requeridos (titulo, descripcion, severidad, servicio).
- **Detalle de incidente**: vista completa con informacion del incidente, cambio de estado y linea de tiempo de eventos.
- **Badges visuales**: indicadores de color para severidad (CRITICAL/HIGH/MEDIUM/LOW) y estado (OPEN/IN_PROGRESS/RESOLVED).

## Variables de entorno

| Variable | Descripcion | Default |
|---|---|---|
| `VITE_API_URL` | URL base de la API de incidentes | `http://localhost:3000` |

## Ejecucion local

```bash
npm install
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`.

Para apuntar a una API diferente:

```bash
VITE_API_URL=http://mi-api:3000 npm run dev
```

## Ejecucion con Docker

### Build de la imagen

```bash
docker build -t incident-web --build-arg VITE_API_URL=http://localhost:3000 .
docker run -p 80:80 incident-web
```

### Con Docker Compose

Si se tiene un archivo `docker-compose.yml` en el repositorio principal:

```bash
docker compose up incident-web
```

## Tests

```bash
npm test
```

Los tests usan Vitest con jsdom y Testing Library. Actualmente cubren el componente de listado de incidentes (renderizado, manejo de errores, controles de filtro).

## Build de produccion

```bash
npm run build
```

Genera los archivos estaticos en el directorio `dist/`.

## Decisiones de arquitectura

- **React + Vite**: combinacion moderna y rapida para SPAs. Vite ofrece tiempos de compilacion significativamente menores que webpack, con HMR instantaneo en desarrollo.
- **CSS puro**: para un proyecto de este tamanio, CSS plano mantiene la simplicidad sin agregar dependencias innecesarias. El disenio es limpio y responsive.
- **Sin estado global**: al ser una aplicacion con pocas vistas, el estado local con `useState` y `useEffect` es suficiente. No se requiere Redux ni Context complejo.
- **Fetch nativo**: se usa la API `fetch` del navegador directamente, sin axios ni librerias adicionales.

## Estructura del proyecto

```
src/
  api/           # Cliente HTTP para la API de incidentes
  pages/         # Componentes de pagina (List, Create, Detail)
  test/          # Configuracion de tests
  types.ts       # Tipos TypeScript compartidos
  App.tsx        # Rutas principales
  main.tsx       # Punto de entrada
  index.css      # Estilos globales
```

## Pendientes

- Agregar mas tests (paginas de creacion y detalle)
- Agregar manejo de reconexion/retry en llamadas a la API
- Implementar notificaciones en tiempo real (WebSocket)
- Agregar autenticacion de usuario
