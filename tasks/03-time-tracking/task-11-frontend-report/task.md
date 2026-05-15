# Task 11 — Pantalla reporte (workspace settings)

**Épica:** 03 · **Tamaño:** L

## Contexto

Nueva ruta `app/[workspaceSlug]/settings/reports/time-tracking/` con filtros, tabla y export.

## Diseño

- Filtros: rango de fechas (presets: This week, Last week, This month, Last month, Custom), multi-select de usuarios y proyectos, toggle billable, selector `group_by`.
- Vista: tabla cuando `group_by` no está; gráfico bar/line cuando hay agrupación temporal; tabla cuando agrupa por user/project.
- Botón "Export CSV" dispara descarga del endpoint del task-06.

## Archivos

- `apps/web/app/[workspaceSlug]/settings/reports/time-tracking/page.tsx` (nuevo)
- `apps/web/core/components/reports/time-tracking/filters.tsx`
- `apps/web/core/components/reports/time-tracking/table.tsx`
- `apps/web/core/components/reports/time-tracking/chart.tsx`
- `apps/web/core/components/reports/time-tracking/export-button.tsx`

## Aceptación

- [ ] Filtros sincronizan con store.
- [ ] Tabla muestra rows hidratados (nombres).
- [ ] Export descarga CSV con filtros actuales.

## Sub-tareas

1. [sub-01 — Ruta + layout](./sub-01-page.md)
2. [sub-02 — Filtros](./sub-02-filters.md)
3. [sub-03 — Tabla lista](./sub-03-table.md)
4. [sub-04 — Gráfico agrupado](./sub-04-chart.md)
5. [sub-05 — Botón export](./sub-05-export.md)
6. [sub-06 — Permiso de acceso](./sub-06-permission.md)
