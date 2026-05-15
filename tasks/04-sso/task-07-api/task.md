# Task 07 — API CRUD SSO config

**Épica:** 04 · **Tamaño:** S

## Contexto

Endpoint singular (no ViewSet) `/workspaces/{slug}/sso/`:
- GET → config actual (o 404 si no existe).
- PUT/PATCH → upsert (crea si no existe).
- DELETE → desactiva (`enabled=False`) o borra entry; preferimos toggle a borrar.

Permisos: solo Admin del workspace.

## Archivos

- `apps/api/plane/app/views/workspace_sso.py` (nuevo)
- `apps/api/plane/app/urls/workspace_sso.py` (nuevo)

## Sub-tareas

1. [sub-01 — View singular](./sub-01-view.md)
2. [sub-02 — URLs](./sub-02-urls.md)
3. [sub-03 — Tests](./sub-03-tests.md)
