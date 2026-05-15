# Task 05 — Decorador `@require_permission` + DRF mixin

**Épica:** 08 — Custom Roles · **Depende de:** task-04 · **Tamaño:** M

## Contexto

Punto único de chequeo de permisos. Hoy las views revisan `member.role >= 15`. Tras esta tarea existirá un decorador y una `BasePermission` de DRF que consultan `RolePermission`. Las views existentes se migran en task-12, pero estos artefactos deben existir antes.

## Diseño

- `has_permission(user, workspace, code)` — booleano. Resuelve el FK `WorkspaceMember.role_obj` → `RolePermission` → match `Permission.code`.
- Cache por request: `request._permission_cache: dict[(ws_id, code), bool]`.
- Permiso especial implícito `*` para Admin (ya garantizado en task-03).
- DRF `HasWorkspacePermission(BasePermission)`: lee `view.required_permission`.
- `@require_permission(code)`: para FBVs. Devuelve 403 si no autorizado.

## Archivos afectados

- `apps/api/plane/app/permissions/__init__.py`
- `apps/api/plane/app/permissions/role_permission.py` (nuevo)
- `apps/api/plane/tests/permissions/test_role_permission.py` (nuevo)

## Aceptación

- [ ] `has_permission(admin_user, ws, "issue.delete_any")` → `True`.
- [ ] `has_permission(guest_user, ws, "project.delete")` → `False`.
- [ ] Usuario fuera del workspace → `False` (sin excepción).
- [ ] Cache evita queries duplicadas en el mismo request (test con `assertNumQueries`).
- [ ] DRF mixin devuelve 403 con el mensaje `"Missing permission: {code}"`.

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Función `has_permission` con cache](sub-01-has-permission.md) | S |
| 02 | [DRF `HasWorkspacePermission`](sub-02-drf-permission-class.md) | XS |
| 03 | [Decorador `@require_permission` para FBVs](sub-03-decorator.md) | XS |
| 04 | [Tests](sub-04-tests.md) | M |
