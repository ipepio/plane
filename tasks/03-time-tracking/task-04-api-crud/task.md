# Task 04 — API CRUD worklogs por issue

**Épica:** 03 · **Tamaño:** M

## Contexto

Endpoints anidados bajo `/workspaces/{slug}/projects/{pid}/issues/{iid}/worklogs/`.

## Diseño

- `IssueWorklogViewSet(ModelViewSet)` con `logged_by` autoasignado.
- Permisos: cualquier miembro del proyecto crea su propio worklog; edita/elimina solo los propios. Admin del proyecto puede editar/eliminar de terceros.
- `queryset` filtra por `workspace`, `project`, `issue`.

## Archivos

- `apps/api/plane/app/views/worklog.py` (nuevo)
- `apps/api/plane/app/urls/worklog.py` (nuevo) + registro en `urls/__init__.py`

## Aceptación

- [ ] POST crea worklog con `logged_by=request.user`.
- [ ] PATCH/DELETE solo permitido al owner o admin del proyecto.
- [ ] GET lista paginada ordenada por `-started_at`.

## Sub-tareas

1. [sub-01 — ViewSet base](./sub-01-viewset.md)
2. [sub-02 — Permisos y owner enforcement](./sub-02-perms.md)
3. [sub-03 — URLs](./sub-03-urls.md)
4. [sub-04 — Tests](./sub-04-tests.md)
