# Task 03 — Serializers

**Épica:** 03 · **Tamaño:** S

## Contexto

Serializers para CRUD de worklogs por issue y para el agregado de reporte.

## Diseño

- `IssueWorklogSerializer`: campos de entrada/salida del CRUD por issue. `logged_by` se asigna desde `request.user` en la view (read_only).
- `WorkspaceWorklogReadSerializer`: hidrata `user`, `project`, `issue` (nombres + ids) para listar en reportes.

## Archivos

- `apps/api/plane/app/serializers/worklog.py` (nuevo)
- `apps/api/plane/app/serializers/__init__.py`

## Aceptación

- [ ] `IssueWorklogSerializer().data` incluye todos los campos relevantes.
- [ ] `duration` rechaza < 0.

## Sub-tareas

1. [sub-01 — IssueWorklogSerializer](./sub-01-issue-serializer.md)
2. [sub-02 — WorkspaceWorklogReadSerializer](./sub-02-workspace-read.md)
3. [sub-03 — Re-exports](./sub-03-reexports.md)
