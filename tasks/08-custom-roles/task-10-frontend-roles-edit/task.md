# Task 10 — UI editor de rol con matriz de permisos

**Épica:** 08 — Custom Roles · **Depende de:** task-07, task-09 · **Tamaño:** L

## Contexto

Pantalla del rol individual donde el admin edita name, description y la matriz de permisos. Roles del sistema se ven en read-only con explicación.

## Diseño

Ruta: `/[workspaceSlug]/settings/roles/[roleId]`

Layout:
- Header editable: input `name`, textarea `description`. Read-only si `is_system`.
- Banner amarillo si `is_system`: "This is a system role and cannot be modified".
- Acordeones por `Permission.category` (workspace, project, issue, intake, worklog, template, team).
- Cada acordeón:
  - Botón "Select all" / "Deselect all" (cabecera).
  - Lista de checkboxes con `permission.name` y `description` debajo.
- Footer fijo: "Save changes" (deshabilitado si no hay dirty state) y "Discard".
- Aviso al navegar fuera con cambios sin guardar.

Estado:
- `dirty: boolean`, `selected: Set<string>` (codes).
- Snapshot inicial vs actual para detectar cambios.

## Archivos afectados

- `apps/web/core/store/roles/role.store.ts` (extender con `fetchOne`, `update`, `setPermissions`)
- `apps/web/core/store/permissions/permission.store.ts` (nuevo: catálogo)
- `apps/web/core/components/roles/role-editor.tsx` (nuevo)
- `apps/web/core/components/roles/permission-matrix.tsx` (nuevo)
- `apps/web/app/[workspaceSlug]/settings/roles/[roleId]/page.tsx` (nuevo)
- `apps/web/core/hooks/use-unsaved-changes-warning.ts` (nuevo, reutilizable)

## Aceptación

- [ ] Marcar/desmarcar permisos refleja dirty state inmediato.
- [ ] Save persiste vía `RoleService.update()` + `setPermissions()` en orden.
- [ ] Roles del sistema renderizan read-only + banner.
- [ ] Cambios sin guardar: prompt al navegar fuera (router + window).
- [ ] Acordeones colapsables y persisten estado abierto/cerrado en sessionStorage.
- [ ] Responsive: en pantallas <768px los acordeones colapsan por defecto.

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Extender store: `fetchOne`, `update`, `setPermissions`](sub-01-extend-store.md) | S |
| 02 | [`PermissionStore` (catálogo)](sub-02-permission-store.md) | S |
| 03 | [`PermissionMatrix` (presentacional)](sub-03-permission-matrix.md) | M |
| 04 | [`RoleEditor` (header + save)](sub-04-role-editor.md) | M |
| 05 | [Read-only para is_system](sub-05-readonly-system.md) | S |
| 06 | [Hook `useUnsavedChangesWarning`](sub-06-unsaved-warning.md) | S |
| 07 | [Página `/settings/roles/[roleId]`](sub-07-page.md) | XS |
