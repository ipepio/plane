# Task 05 — API submit (cualquier miembro abre ticket)

**Épica:** 01 · **Tamaño:** S

## Contexto

Endpoint para que cualquier workspace member abra un ticket en un intake.

URL: `/workspaces/<slug>/intakes/<intake_id>/tickets/`

## Diseño

- POST crea `WorkspaceIntakeIssue(status=Pending, submitter=request.user)`.
- GET lista los tickets del intake (paginados, filtros por status).
- Permiso submit: ser workspace member (no requiere permiso especial). Listar tickets: por defecto solo los propios; ver todos requiere `intake.triage`.

## Sub-tareas

1. [sub-01 — ViewSet tickets](./sub-01-viewset.md)
2. [sub-02 — Listado con filtro por status](./sub-02-list-filter.md)
3. [sub-03 — Permisos diferenciados (own vs all)](./sub-03-perms.md)
4. [sub-04 — URLs](./sub-04-urls.md)
