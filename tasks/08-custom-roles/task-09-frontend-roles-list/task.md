# Task 09 — UI lista de roles

**Épica:** 08 — Custom Roles · **Depende de:** task-06, task-08 · **Tamaño:** M

## Contexto

Pantalla en settings del workspace donde el admin ve todos los roles, distingue los del sistema con badge y crea/elimina los custom.

## Diseño

Ruta: `/[workspaceSlug]/settings/roles`

Contenido:
- Header: título + botón "New role" (abre modal).
- Tabla:
  - Columna Nombre + badge "System" si `is_system`.
  - Columna Descripción (truncada).
  - Columna Miembros (`members_count`).
  - Columna Acciones: editar (link a `/settings/roles/[id]`) y eliminar (deshabilitado en system).
- Modal create: campos `name` (req) + `description`.
- Tras crear → redirige al editor (task-10).

Stack:
- MobX store `RoleStore` con `roles: Map<string, TRole>`, `fetchAll()`, `create()`, `destroy()`.
- Acceso restringido a usuarios con permiso `workspace.manage_roles` (gate).

## Archivos afectados

- `apps/web/core/store/roles/role.store.ts` (nuevo)
- `apps/web/core/store/index.ts` (registrar)
- `apps/web/core/components/roles/roles-list.tsx` (nuevo)
- `apps/web/core/components/roles/create-role-modal.tsx` (nuevo)
- `apps/web/app/[workspaceSlug]/settings/roles/page.tsx` (nuevo)
- `apps/web/app/[workspaceSlug]/settings/layout.tsx` (añadir entrada al sidebar)

## Aceptación

- [ ] La lista carga vía `RoleService.list()` al entrar en la ruta.
- [ ] Badge "System" en `Admin / Member / Guest`.
- [ ] Botón eliminar deshabilitado en system; en custom muestra confirmación y elimina.
- [ ] Crear rol abre modal, valida `name` no vacío, persiste y aparece en la tabla.
- [ ] Usuario sin permiso `workspace.manage_roles` ve "404" o redirección al dashboard del workspace.

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [`RoleStore` Mobx](sub-01-store.md) | S |
| 02 | [Componente `RolesList` (tabla)](sub-02-list-component.md) | S |
| 03 | [Modal de creación](sub-03-create-modal.md) | S |
| 04 | [Página `/settings/roles`](sub-04-page.md) | XS |
| 05 | [Entrada en sidebar de settings](sub-05-sidebar-entry.md) | XS |
| 06 | [Permission gate del usuario actual](sub-06-permission-gate.md) | S |
