# Gamarrito – Frontend Web

Aplicación web de gestión para MYPES textiles de Gamarra. Permite administrar catálogo, stock, compras, ventas, clientes y proveedores, y consultar reportes en lenguaje natural con un asistente de IA.

**Curso:** CS 2031 Desarrollo Basado en Plataforma

## Integrantes

- Javier Alonso Bravo Chávez
- Gabriel Murillo Machicao
- Indira Shian Yabar Ramos
- Rafael Antonio Vargas Portocarrero

## Enlaces

| Componente | URL |
|---|---|
| Web (producción) | <http://localhost:3000/> |
| Backend (API) | <URL del backend desplegado> |
| Repositorio backend | <https://github.com/rafavp03/dbp-project-backend.git> |
| Aplicación móvil | <URL o enlace de Expo> |

## Funcionalidades

- **Autenticación:** inicio de sesión, registro de empresa y renovación automática del token.
- **Dashboard:** indicadores de ventas, gráfico de ventas por periodo, productos más vendidos y alertas de stock bajo.
- **Catálogo:** productos, categorías y variantes (talla y color) con stock inicial y cambio rápido de precio.
- **Compras y ventas:** creación con múltiples líneas, detalle de cada orden y ajuste automático de stock.
- **Clientes y proveedores:** altas, edición y listados.
- **Asistente IA:** consultas en lenguaje natural sobre el negocio, con historial y contador de consultas diarias.
- **Roles:** `ADMIN` accede a reportes y operaciones sensibles; `EMPLEADO` tiene acceso operativo.

## Tecnologías

React 19 · Vite · Tailwind CSS v4 · React Router · Axios · React Hook Form · Recharts · React Hot Toast · Lucide React · PropTypes · ESLint

## Requisitos

- Node.js 20 o superior
- npm
- Backend en ejecución (local o desplegado)

## Instalación y ejecución local

```bash
git clone <URL del repositorio>
cd dpb-project-frontend-web
npm install
cp .env.example .env
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:8080/api/v1` |

El archivo `.env` no se versiona; usa `.env.example` como plantilla.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Análisis estático con ESLint |

## Estructura del proyecto

```text
src/
├── components/   Componentes reutilizables (tablas, formularios, diálogos, layout)
├── pages/        Vistas de cada módulo
├── hooks/        Hooks personalizados (useAuth, useFetch, usePageParams, useDebounce)
├── services/     Capa de acceso a la API (un servicio por recurso)
├── contexts/     Estado global de autenticación
├── routes/       Rutas y configuración de navegación
└── utils/        Utilidades (errores, formato, fechas, paginación, tokens)
```

## Decisiones de diseño

- **Cliente HTTP centralizado:** una única instancia de Axios con `baseURL`, interceptor de autorización, reintentos automáticos en errores de red o 5xx (solo GET) y renovación del token ante un 401.
- **Sesión:** el access token vive en memoria; el refresh token se guarda en `localStorage`. Si la renovación falla, se emite un evento y se cierra la sesión.
- **Cancelación de peticiones:** `useFetch` usa `AbortController` para evitar actualizar estado de componentes desmontados.
- **Paginación en la URL:** `usePageParams` guarda `page`, `size`, `sort` y `search` en los query params, de modo que cualquier vista se puede compartir o recargar.
- **Carga diferida:** todas las páginas se cargan con `React.lazy` y `Suspense`.
- **Manejo de errores:** `ErrorBoundary` para errores de renderizado y mensajes amigables por código HTTP.
- **Rutas protegidas:** `ProtectedRoute` redirige a `/login` y la interfaz se adapta según el rol.

## Rutas principales

| Ruta | Vista |
|---|---|
| `/login`, `/register` | Acceso y registro |
| `/` | Dashboard |
| `/products`, `/products/:id/variants` | Productos y variantes |
| `/categories` | Categorías |
| `/sales`, `/sales/:id` | Ventas y detalle |
| `/purchases`, `/purchases/:id` | Compras y detalle |
| `/clients`, `/suppliers` | Clientes y proveedores |
| `/assistant` | Asistente IA |

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| ADMIN | <prueba@test.com> | <Prueba123> |
| EMPLEADO | <empleado@test.com> | <Empleado123> |

## Notas

- El asistente IA tiene un límite de 30 consultas diarias por usuario y depende de la cuota del proveedor de IA configurado en el backend.