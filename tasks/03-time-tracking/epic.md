# Épica 03 — Time tracking

## Objetivo

Registrar tiempo dedicado a cada issue (worklogs): entradas con duración, fecha, comentario y usuario. Reportes agregados por proyecto / usuario / cliente.

## Por qué

Time tracking en Plane CE no existe (es feature de Cloud, ver `apps/web/core/constants/plans.tsx`). GoGuest factura por horas y necesita el dato para clientes.

## Scope

- Modelo `IssueWorklog`: `issue_id`, `user_id`, `duration` (segundos o ISO 8601), `started_at`, `description`, `is_billable`.
- API REST: CRUD de worklogs por issue + agregados (`GET /workspaces/{slug}/worklogs/?from=&to=&user=&project=`).
- UI:
  - Botón "Log time" en detalle de issue → modal con duración, fecha, descripción.
  - Tab "Worklog" en issue mostrando entradas.
  - Vista de reporte en workspace settings → Reports → Time tracking, con filtros.
- Permisos: cualquier miembro registra su propio tiempo; solo Admin/Member ven el de otros (configurable, ver épica 08).
- Export CSV del reporte.

## Fuera de scope

- Cronómetro en vivo (start/stop) — fase 2 si se pide.
- Aprobación de horas — fase 2.
- Integración con facturación externa.

## Decisiones de diseño cerradas

- [X] **D1** — `duration` como **entero en segundos** (`PositiveIntegerField`). Portable, queryable, sumable trivialmente.
- [X] **D2** — **Una entrada por sesión** (cada bloque de trabajo independiente). El reporte agrega por día/semana/mes según filtros.
- [X] **D3** — `is_billable` **flag por entrada** (booleano). Default `True`. Permite excluir reuniones internas, debug, etc. sin necesidad de proyectos billables/no-billables separados.

## Áreas de código afectadas

- `apps/api/plane/db/models/issue.py` (o nuevo `worklog.py`)
- `apps/api/plane/db/migrations/`
- `apps/api/plane/app/{serializers,views,urls}/`
- `apps/api/plane/api/` (API pública si aplica)
- `apps/web/core/components/issues/issue-detail/worklog/` (nuevo)
- `apps/web/app/[workspaceSlug]/settings/reports/time-tracking/` (nueva ruta)
- `packages/types/src/issues/worklog.ts`
- `packages/i18n/src/locales/*/translations.json`

## Criterios de aceptación

- [X] Usuario registra 30 min en un issue; aparece en el tab "Worklog" del issue y en el reporte del workspace.
- [X] Filtro por rango de fechas + usuario + proyecto funciona.
- [X] Export CSV genera un archivo con columnas `date, user, project, issue, duration_minutes, billable, description`.
- [X] Tests del agregado (suma correcta cruzando filtros).

## Tareas atómicas

1. [task-01 — Modelo IssueWorklog](./task-01-model/task.md)
2. [task-02 — Migraciones](./task-02-migrations/task.md)
3. [task-03 — Serializers](./task-03-serializers/task.md)
4. [task-04 — API CRUD worklogs por issue](./task-04-api-crud/task.md)
5. [task-05 — API agregado workspace](./task-05-api-aggregate/task.md)
6. [task-06 — Export CSV](./task-06-export-csv/task.md)
7. [task-07 — Frontend types + service](./task-07-frontend-types/task.md)
8. [task-08 — Frontend store](./task-08-frontend-store/task.md)
9. [task-09 — Modal "Log time" en issue](./task-09-frontend-log-modal/task.md)
10. [task-10 — Tab "Worklog" en issue detail](./task-10-frontend-tab/task.md)
11. [task-11 — Pantalla reporte (workspace settings)](./task-11-frontend-report/task.md)
12. [task-12 — i18n + permisos](./task-12-i18n/task.md)
