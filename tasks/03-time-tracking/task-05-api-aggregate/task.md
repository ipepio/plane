# Task 05 — API agregado workspace

**Épica:** 03 · **Tamaño:** M

## Contexto

Endpoint para reportes en `/workspaces/{slug}/worklogs/` con filtros `from`, `to`, `user[]`, `project[]`, `billable`, `group_by`.

## Diseño

- `WorkspaceWorklogView` (no ViewSet) con dos modos:
  - **Sin** `group_by`: lista paginada de worklogs hidratados (con nombres de user/project/issue).
  - **Con** `group_by` ∈ `{day, week, month, user, project}`: devuelve agregados `[{key, total_seconds, billable_seconds}]`.
- Permiso: cualquier miembro del workspace; el filtro restringe a *propios* a menos que el actor sea Admin/Member del workspace (épica 08).

## Archivos

- `apps/api/plane/app/views/worklog.py` (extender)
- `apps/api/plane/app/urls/worklog.py` (extender)

## Aceptación

- [ ] `?group_by=day` agrupa correctamente cruzando timezone del workspace.
- [ ] Sin filtros, paginación de 50 por defecto.

## Sub-tareas

1. [sub-01 — Vista list + filtros](./sub-01-list-filters.md)
2. [sub-02 — Agregado group_by](./sub-02-group-by.md)
3. [sub-03 — Restricción "solo míos" para Guest](./sub-03-self-only.md)
4. [sub-04 — Tests](./sub-04-tests.md)
