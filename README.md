# incident-web

Frontend para el sistema de gestión de incidentes productivos.

## Stack

| Tecnología | Propósito |
|-----------|-----------|
| Angular 19 | Framework frontend |
| PrimeNG | Componentes UI (tabla, dropdowns, timeline, toast) |
| PrimeFlex | Utilidades CSS |
| PrimeIcons | Iconografía |
| Nginx | Servidor web en producción |

### ¿Por qué Angular?

Angular es el framework frontend que domino con mayor profundidad. La decisión prioriza:

- **Standalone components** (Angular 19) para una arquitectura modular y limpia.
- **Reactive Forms** para validación robusta del formulario de creación.
- **PrimeNG** como librería de componentes UI, con tabla paginada,
  timeline y notificaciones out-of-the-box.

## Pantallas

### 1. Listado de incidentes (`/incidents`)
- Tabla con columnas: Title, Severity, Status, Service, Created
- Filtros por Status y Severity (dropdowns)
- Búsqueda por título (input + Enter)
- Paginación real con selector de page size
- Click en el ícono de ojo para ver detalle

### 2. Crear incidente (`/incidents/create`)
- Formulario con validación:
  - Title (requerido, max 255 caracteres)
  - Description (opcional)
  - Severity (requerido, dropdown)
  - Service (requerido, dropdown)
- Al crear, redirige al detalle del incidente

### 3. Detalle (`/incidents/:id`)
- Card con info del incidente (severity, status, service, fechas)
- Dropdown para cambiar status directamente
- Timeline de eventos desde MongoDB (con íconos y colores por tipo)
- Payload de cada evento en formato JSON

## Arquitectura
```
src/app/
  models/             → Interfaces TypeScript (tipado)
  services/           → IncidentService (HTTP client)
  components/
    incident-list/    → Tabla + filtros + paginación
    incident-create/  → Formulario reactivo
    incident-detail/  → Info + cambio de status + timeline
```

**Decisiones clave:**

- Cada componente es standalone e importa solo los módulos PrimeNG
  que necesita.
- El servicio centraliza todas las llamadas HTTP y recibe parámetros
  tipados.
- En Docker, nginx hace proxy reverso: `/incidents` a backend Django.
  Así el frontend no necesita saber la URL del backend.

## Cómo correr (desarrollo local)
```bash
# 1. Instalar dependencias
npm install

# 2. Levantar servidor de desarrollo
ng serve

# 3. Abrir en navegador
http://localhost:4200
```

Requiere que el backend esté corriendo en `http://localhost:8000`.

## Cómo correr (Docker)
```bash
# Desde incident-infra/
docker compose up --build
```

La app queda disponible en `http://localhost:4200`.

## Tests
```bash
ng test
```

Los tests incluyen:
- Creación del componente de listado
- Carga de incidentes al inicializar
- Reset de página al filtrar
- Mapeo correcto de colores por severity/status
- Formateo de status

## Variables de entorno

| Archivo | apiUrl | Uso |
|---------|--------|-----|
| `environment.ts` | `http://localhost:8000` | Desarrollo local |
| `environment.prod.ts` | `''` (vacío) | Docker (nginx proxy) |
