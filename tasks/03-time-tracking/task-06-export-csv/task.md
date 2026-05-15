# Task 06 — Export CSV

**Épica:** 03 · **Tamaño:** S

## Contexto

Mismo endpoint del reporte aceptando `?format=csv` o ruta dedicada `/workspaces/{slug}/worklogs/export/`.

## Diseño

- Endpoint dedicado `WorkspaceWorklogCSVExportView` reutilizando filtros del task-05.
- Devuelve `text/csv` con `Content-Disposition: attachment; filename=worklogs_{slug}_{from}_{to}.csv`.
- Columnas: `date, user, project, issue, duration_minutes, billable, description`.

## Archivos

- `apps/api/plane/app/views/worklog.py` (extender)
- `apps/api/plane/app/urls/worklog.py` (registrar)

## Aceptación

- [ ] Archivo CSV bien formado, sin BOM, separador `,`.
- [ ] `duration_minutes` redondeo a 2 decimales.
- [ ] Headers en primera línea.

## Sub-tareas

1. [sub-01 — Vista CSV streaming](./sub-01-csv-view.md)
2. [sub-02 — Tests](./sub-02-tests.md)
