# Task 04 — API CRUD properties

**Épica:** 05 · **Tamaño:** M

## Contexto

Endpoints bajo issue type para gestionar properties.

URL: `/workspaces/<slug>/projects/<pid>/issue-types/<itid>/properties/`

## Diseño

- `IssuePropertyViewSet(ModelViewSet)`.
- Permiso: `project.manage_issue_types` (épica 08); legacy: rol ≥ Admin de proyecto.

## Sub-tareas

1. [sub-01 — ViewSet](./sub-01-viewset.md)
2. [sub-02 — URLs](./sub-02-urls.md)
3. [sub-03 — Permisos](./sub-03-perms.md)
4. [sub-04 — Tests CRUD](./sub-04-tests.md)
