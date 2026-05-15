# Task 01 — Modelo IssueWorklog

**Épica:** 03 · **Tamaño:** S

## Contexto

Necesitamos persistir registros de tiempo asociados a un `Issue`. Cada registro: usuario, duración (segundos), `started_at`, descripción opcional, flag `is_billable`.

## Diseño

- Nuevo archivo `apps/api/plane/db/models/worklog.py`.
- `IssueWorklog(ProjectBaseModel)` con FKs a `Issue` y `User`.
- Index combinado en `(workspace, started_at)` para queries de reporte; `(issue, started_at)` para tab.
- `duration` = `PositiveIntegerField` (segundos).

## Archivos

- `apps/api/plane/db/models/worklog.py` (nuevo)
- `apps/api/plane/db/models/__init__.py` (re-export)

## Aceptación

- [ ] `IssueWorklog.objects.create(...)` funciona en shell.
- [ ] `worklog.duration` admite 0 y enteros positivos; rechaza negativos.

## Sub-tareas

1. [sub-01 — Crear archivo worklog.py](./sub-01-create-file.md)
2. [sub-02 — Definir IssueWorklog](./sub-02-issue-worklog.md)
3. [sub-03 — Re-export en __init__.py](./sub-03-reexport.md)
