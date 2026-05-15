# Task 04 — `role_id` FK en `WorkspaceMember` y `ProjectMember`

**Épica:** 08 — Custom Roles · **Depende de:** task-03 · **Tamaño:** M

## Contexto

`WorkspaceMember` y `ProjectMember` guardan el rol como entero (`role = PositiveSmallIntegerField`). Toda la base de código existente lee ese entero. Esta tarea añade un FK al nuevo `Role` **sin romper** nada: el campo entero queda como legacy y se sincroniza vía signal en task-12.

## Diseño

- Añadir `role_id` (FK nullable a `Role`) en ambos modelos.
- Migración de schema (los dos FK).
- Migración de datos: para cada miembro, encontrar el `Role` del sistema del workspace cuyo `level` coincide con el `role` int actual y enlazar.
- Edge case: workspaces sin roles del sistema todavía (no debería pasar tras task-03 pero se valida).

## Archivos afectados

- `apps/api/plane/db/models/workspace.py` (línea 198 — `WorkspaceMember`)
- `apps/api/plane/db/models/project.py` (`ProjectMember`)
- `apps/api/plane/db/migrations/00XX_member_role_fk.py`
- `apps/api/plane/db/migrations/00XX_member_role_data.py`
- `apps/api/plane/tests/db/test_member_role_link.py`

## Aceptación

- [ ] Tras migrar: `WorkspaceMember.objects.filter(role_id__isnull=True).count() == 0`.
- [ ] Idem `ProjectMember`.
- [ ] El campo `role` int sigue inalterado (no se borra todavía).
- [ ] Cambiar `role_id` a un Role custom no rompe el `role` int (queda desincronizado a propósito; sincronización en task-12).

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Schema migration: `role_id` en `WorkspaceMember`](sub-01-fk-workspacemember.md) | S |
| 02 | [Schema migration: `role_id` en `ProjectMember`](sub-02-fk-projectmember.md) | S |
| 03 | [Data migration: int → Role del sistema](sub-03-data-migration.md) | M |
| 04 | [Tests de la migración](sub-04-tests.md) | S |
