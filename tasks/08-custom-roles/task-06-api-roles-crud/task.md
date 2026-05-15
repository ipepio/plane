# Task 06 — API CRUD de roles

**Épica:** 08 — Custom Roles · **Depende de:** task-04 · **Tamaño:** M

## Contexto

Endpoints REST en el módulo `app` para gestionar roles desde el frontend (settings de workspace). Se usa el patrón `ModelViewSet` ya existente en el proyecto.

## Diseño

Rutas:

```
GET    /api/v1/workspaces/{slug}/roles/                → list
POST   /api/v1/workspaces/{slug}/roles/                → create
GET    /api/v1/workspaces/{slug}/roles/{id}/           → retrieve
PATCH  /api/v1/workspaces/{slug}/roles/{id}/           → update
DELETE /api/v1/workspaces/{slug}/roles/{id}/           → destroy
```

Permiso requerido: `workspace.manage_roles` (DRF `HasWorkspacePermission`).

Restricciones:
- `is_system=True` → 403 en update y destroy.
- `level` solo modificable cuando `is_system=False` y se pasa explícito.

## Archivos afectados

- `apps/api/plane/app/serializers/role.py` (nuevo)
- `apps/api/plane/app/serializers/__init__.py` (export)
- `apps/api/plane/app/views/role.py` (nuevo)
- `apps/api/plane/app/views/__init__.py` (export)
- `apps/api/plane/app/urls/role.py` (nuevo)
- `apps/api/plane/app/urls/__init__.py` (registrar)
- `apps/api/plane/tests/api/test_roles.py` (nuevo)

## Aceptación

- [ ] CRUD completo funcionando con tests por endpoint.
- [ ] PATCH/DELETE sobre `is_system=True` → 403.
- [ ] Lista incluye contador de miembros por rol (`members_count` en respuesta).
- [ ] Schema OpenAPI generado incluye los 5 endpoints (verificar con `python manage.py spectacular`).

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Serializers `RoleSerializer` y `RoleDetailSerializer`](sub-01-serializers.md) | S |
| 02 | [`RoleViewSet`](sub-02-viewset.md) | M |
| 03 | [URLs y registro](sub-03-urls.md) | XS |
| 04 | [Tests por endpoint](sub-04-tests.md) | M |
