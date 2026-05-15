# Task 12 — Migrar `role >= 15` a `@require_permission` en views existentes

**Épica:** 08 — Custom Roles · **Depende de:** task-05, task-11 · **Tamaño:** L

## Contexto

Hasta aquí el sistema de permisos existe y funciona en aislado, pero las views existentes siguen usando `request.user.role >= 15`. Esta tarea cierra el ciclo: la API completa pasa a usar el sistema nuevo. Sin esto, los roles custom **no tienen efecto real** sobre el acceso.

## Diseño

Mapa orientativo `int → permiso`:

| Check actual | Permiso requerido |
|---|---|
| `role == 20` (admin) | depende del endpoint: `workspace.manage_settings` / `manage_members` / `manage_roles` |
| `role >= 15` (member+) | depende: `issue.create`, `project.create`, `worklog.log_own`, etc. |
| `role >= 5` (cualquiera) | sin chequeo extra; el middleware de membership ya filtra |

Estrategia:
1. Audit: grep todos los puntos.
2. Sustituir uno por uno con tests de regresión (los tests existentes deben seguir pasando).
3. Sincronizar `WorkspaceMember.role` (int) ↔ `role_obj.level` con un signal `post_save` (mientras el campo entero exista).
4. Endpoint `GET /me/permissions/` para que el frontend sepa qué puede hacer.

## Archivos afectados

- Audit en `apps/api/plane/app/views/` (probablemente ~30-50 vistas).
- `apps/api/plane/app/permissions/` (extender con módulo `legacy.py` si hace falta helper de migración).
- `apps/api/plane/db/signals.py` (sync `role` int).
- `apps/api/plane/app/views/me.py` (endpoint nuevo).
- Tests existentes en `apps/api/plane/tests/` (actualizar mocks de `role`).

## Aceptación

- [ ] Grep `role\s*>=\s*\d+` en `apps/api/plane/app/views/` → 0 resultados.
- [ ] Toda la suite de tests pasa.
- [ ] Smoke E2E: usuario con rol custom "Triador" puede triar intake pero NO puede archivar proyecto.
- [ ] `GET /api/v1/workspaces/{slug}/me/permissions/` devuelve los codes correctamente.

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Audit: lista de puntos a migrar](sub-01-audit.md) | S |
| 02 | [Migrar views de workspace](sub-02-migrate-workspace-views.md) | M |
| 03 | [Migrar views de project](sub-03-migrate-project-views.md) | M |
| 04 | [Migrar views de issue](sub-04-migrate-issue-views.md) | M |
| 05 | [Migrar views de intake](sub-05-migrate-intake-views.md) | S |
| 06 | [Signal sync `role` int ↔ `role_obj.level`](sub-06-sync-signal.md) | S |
| 07 | [Endpoint `me/permissions/`](sub-07-me-permissions.md) | XS |
| 08 | [Actualizar tests existentes](sub-08-update-tests.md) | M |
