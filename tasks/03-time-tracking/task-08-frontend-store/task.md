# Task 08 — Frontend store

**Épica:** 03 · **Tamaño:** S

## Contexto

MobX store para worklogs por issue + cache del reporte.

## Archivos

- `apps/web/core/store/worklog/worklog.store.ts` (nuevo)
- `apps/web/core/store/root.store.ts` (registrar)

## Aceptación

- [ ] `worklogStore.fetchByIssue(issueId)` puebla `byIssue[issueId]`.
- [ ] `worklogStore.create(...)` añade al map y refresca derivado.

## Sub-tareas

1. [sub-01 — Store base con observable maps](./sub-01-store.md)
2. [sub-02 — Acciones CRUD](./sub-02-actions.md)
3. [sub-03 — Reporte y filtros](./sub-03-report.md)
