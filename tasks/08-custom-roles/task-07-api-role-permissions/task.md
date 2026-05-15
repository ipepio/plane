# Task 07 — API set/get permisos de un rol

**Épica:** 08 — Custom Roles · **Depende de:** task-06 · **Tamaño:** S

## Contexto

PATCH del rol entero es incómodo cuando hay 25+ permisos. Endpoint dedicado para sobreescribir el set completo.

## Diseño

```
GET  /api/v1/workspaces/{slug}/roles/{id}/permissions/   → lista codes
PUT  /api/v1/workspaces/{slug}/roles/{id}/permissions/   → reemplaza el set
     body: {"permission_codes": ["issue.create", ...]}
```

- Bloqueado en `is_system=True`.
- `permission_codes` se valida contra `Permission.code` (codes inexistentes → 400 con la lista de inválidos).
- Atómico: o se aplica todo o nada (`transaction.atomic`).

## Archivos afectados

- `apps/api/plane/app/views/role.py` (extender con `@action`)
- `apps/api/plane/app/urls/role.py` (nueva ruta)
- `apps/api/plane/tests/api/test_roles.py` (extender)

## Aceptación

- [ ] PUT con `["issue.create", "issue.comment"]` deja el rol con esos 2 exactamente, eliminando los previos.
- [ ] Code inválido → 400 con `{"invalid_codes": [...]}`.
- [ ] Sobre rol del sistema → 403.

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Action `permissions` en `RoleViewSet`](sub-01-action.md) | S |
| 02 | [Tests: replace, invalid, system](sub-02-tests.md) | S |
