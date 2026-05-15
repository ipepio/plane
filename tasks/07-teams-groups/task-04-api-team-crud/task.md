# Task 04 — API CRUD Team

**Épica:** 07 · **Tamaño:** M

## Contexto

CRUD de teams a nivel workspace: list, retrieve, create, update, destroy.

## Diseño

- ViewSet `TeamViewSet(ModelViewSet)` con `permission_classes` integrando épica 08 (`workspace.manage_teams`).
- Mientras épica 08 no esté lista, exigir rol ≥ Admin via `WorkspaceUserPermission`.
- URL base: `/workspaces/<slug>/teams/`.
- Queryset: filtra por workspace y `deleted_at__isnull=True`, anota `member_count`.

## Archivos

- Crear: `apps/api/plane/app/views/workspace/team.py`
- Editar: `apps/api/plane/app/views/__init__.py`
- Editar: `apps/api/plane/app/urls/workspace.py`

## Aceptación

- [ ] `GET /workspaces/<slug>/teams/` lista teams del workspace con `member_count`.
- [ ] `POST` crea team validando nombre.
- [ ] `PATCH` actualiza name/description/logo_props.
- [ ] `DELETE` soft-delete (sets `deleted_at`).

## Sub-tareas

1. [sub-01 — ViewSet base](./sub-01-viewset.md)
2. [sub-02 — Queryset con annotate](./sub-02-queryset.md)
3. [sub-03 — Permisos (legacy + futuro código)](./sub-03-permissions.md)
4. [sub-04 — URLs y registro](./sub-04-urls.md)
