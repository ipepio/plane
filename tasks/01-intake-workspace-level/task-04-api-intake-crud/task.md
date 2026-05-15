# Task 04 — API CRUD WorkspaceIntake

**Épica:** 01 · **Tamaño:** S

## Diseño

- `WorkspaceIntakeViewSet(ModelViewSet)`.
- URL: `/workspaces/<slug>/intakes/`.
- Permiso (mientras épica 08 no): rol Admin para crear/editar/borrar. Member para list (necesita para submit en task-05).
- Queryset annotate `pending_count`.

## Sub-tareas

1. [sub-01 — ViewSet + queryset annotate](./sub-01-viewset.md)
2. [sub-02 — Default flip on create](./sub-02-default.md)
3. [sub-03 — URLs](./sub-03-urls.md)
