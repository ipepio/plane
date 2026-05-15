# Épica 08 — Roles y permisos personalizables

## Objetivo

Permitir al admin crear roles propios con permisos granulares, en lugar de los tres fijos `Admin / Member / Guest`.

## Por qué

`apps/api/plane/db/models/workspace.py:19` define `ROLE_CHOICES = ((20, "Admin"), (15, "Member"), (5, "Guest"))` hard-coded. La autorización en views compara con esos enteros (`role >= 15`). GoGuest necesita roles intermedios (p. ej. "Triador", "Cliente externo solo lectura", "PM"). Sin esto, todos los Members pueden hacer demasiado o demasiado poco.

## Scope

- Modelo `Role` (workspace-level): `name`, `description`, `is_system` (Admin/Member/Guest siguen como roles del sistema, inmutables).
- Modelo `Permission`: catálogo seedeado con ~40 permisos atómicos (`issue.create`, `issue.delete`, `project.archive`, `worklog.view_others`, etc.).
- Modelo `RolePermission` (M2M).
- `WorkspaceMember.role` y `ProjectMember.role` cambian de `IntegerField` a `ForeignKey(Role)` — **migración no trivial**.
- Decorador / mixin de Django que reemplace los `if request.user.role >= 15` por checks por permiso.
- UI: Settings de workspace → "Roles" → CRUD + matriz de permisos.

## Fuera de scope

- Permisos a nivel issue concreto (ACL fina) — fase 2.
- Roles a nivel project con permisos distintos a los del workspace — fase 2.
- Auditoría de cambios de permisos — fase 2.

## Decisiones de diseño tomadas

- [x] **D1** — Mantener `WorkspaceMember.role` (int legacy) + añadir `role_id` FK nullable. Migración de datos mapea int→Role del sistema. El código existente que lee `role >= 15` sigue funcionando hasta que se sustituya por checks de permiso (task-12).
- [x] **D2** — Catálogo de permisos atómicos (~40):
  - `workspace.*`: invite_members, manage_settings, manage_roles, view_billing
  - `project.*`: create, archive, delete, manage_members, manage_settings
  - `issue.*`: create, edit_own, edit_any, delete_own, delete_any, comment, change_state, change_assignee
  - `intake.*`: submit, triage, manage_forms
  - `worklog.*`: log_own, view_others, edit_others
  - `template.*`: manage
  - `team.*`: manage
- [x] **D3** — Roles del sistema (Admin/Member/Guest) marcados `is_system=True`, no editables ni borrables.
- [x] **D4** — Empezamos por la base estructural (modelos + endpoints + UI). La sustitución de chequeos `role >= 15` en views existentes se hace incrementalmente al final (task-12).

## Áreas de código afectadas

- `apps/api/plane/db/models/workspace.py`, `project.py`
- `apps/api/plane/db/migrations/` (migración de datos)
- `apps/api/plane/app/permissions/` (nuevo paquete o extender existente)
- `apps/api/plane/app/views/**` (cambiar checks de rol entero por checks de permiso)
- `apps/api/plane/seeds/` (seed del catálogo de permisos)
- `apps/web/app/[workspaceSlug]/settings/roles/` (nueva ruta)
- `packages/types/src/role.ts`
- `packages/i18n/src/locales/*/translations.json`

## Criterios de aceptación

- [ ] Admin crea rol "Triador" con permisos `intake.triage`, `issue.create`, `issue.comment`.
- [ ] Usuario con rol "Triador" puede triar tickets de intake pero no puede archivar proyecto ni cambiar settings.
- [ ] Migración aplica sobre BD existente sin perder datos: los miembros existentes quedan con su rol del sistema equivalente.
- [ ] Tests cubren: creación de rol, asignación, denegación de acción no permitida, edición de rol del sistema rechazada.

## Tareas atómicas

| # | Tarea | Depende de | Tamaño |
|---|---|---|---|
| 01 | [Modelos `Permission`, `Role`, `RolePermission` + migración](task-01-models-permission-role.md) | — | S |
| 02 | [Seed del catálogo de permisos](task-02-seed-permissions.md) | 01 | S |
| 03 | [Seed de roles del sistema (Admin/Member/Guest)](task-03-seed-system-roles.md) | 02 | S |
| 04 | [`role_id` FK en `WorkspaceMember` y `ProjectMember` + data migration](task-04-link-member-role.md) | 03 | M |
| 05 | [Decorador `@require_permission` + DRF mixin](task-05-permission-decorator.md) | 04 | M |
| 06 | [API CRUD de roles](task-06-api-roles-crud.md) | 04 | M |
| 07 | [API asignar/quitar permisos a un rol](task-07-api-role-permissions.md) | 06 | S |
| 08 | [Tipos TS de Role/Permission](task-08-frontend-types.md) | — | S |
| 09 | [UI lista de roles en settings de workspace](task-09-frontend-roles-list.md) | 06, 08 | M |
| 10 | [UI editor de rol con matriz de permisos](task-10-frontend-roles-edit.md) | 07, 09 | L |
| 11 | [Keys i18n nuevas en todos los locales](task-11-frontend-i18n.md) | 10 | S |
| 12 | [Reemplazar `role >= 15` por `@require_permission` en views existentes](task-12-migrate-existing-checks.md) | 05, 11 | L |
