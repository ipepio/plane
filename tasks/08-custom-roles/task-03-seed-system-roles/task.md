# Task 03 — Seed de roles del sistema

**Épica:** 08 — Custom Roles · **Depende de:** task-02 · **Tamaño:** S

## Contexto

Cada workspace existente (y los futuros) deben tener tres roles base inmutables: `Admin`, `Member`, `Guest`. Estos preservan la semántica del enum legacy y son el target de la data migration de task-04.

## Diseño

Mapeo de permisos por rol del sistema:

```python
SYSTEM_ROLE_PERMISSIONS = {
    "Admin": "*",   # todos
    "Member": [
        "project.create",
        "project.manage_members",
        "issue.create", "issue.edit_own", "issue.edit_any",
        "issue.delete_own", "issue.comment",
        "issue.change_state", "issue.change_assignee",
        "intake.submit", "intake.triage",
        "worklog.log_own", "worklog.view_others",
        "team.manage",
    ],
    "Guest": [
        "issue.create", "issue.edit_own", "issue.delete_own",
        "issue.comment", "intake.submit", "worklog.log_own",
    ],
}

LEVEL_BY_ROLE = {"Admin": 20, "Member": 15, "Guest": 5}
```

`seed_system_roles_for_workspace(workspace)` crea/actualiza los 3 roles + sus `RolePermission`. Conectado a `post_save` de `Workspace` para auto-crear en workspaces nuevos.

## Archivos afectados

- `apps/api/plane/seeds/system_roles.py` (nuevo)
- `apps/api/plane/db/signals.py` (extender o nuevo handler)
- `apps/api/plane/db/apps.py` (registro del signal)
- `apps/api/plane/db/migrations/00XX_seed_system_roles.py` (nuevo)
- `apps/api/plane/tests/seeds/test_system_roles.py` (nuevo)

## Aceptación

- [ ] Tras la migración, **todos** los workspaces existentes tienen `Admin`, `Member`, `Guest` con `is_system=True` y los permisos correctos.
- [ ] Crear un workspace nuevo dispara el seed automáticamente.
- [ ] Re-ejecutar seed no duplica ni desordena permisos.

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Definir mapeo + función `seed_system_roles_for_workspace`](sub-01-seed-function.md) | S |
| 02 | [Signal `post_save` en Workspace](sub-02-signal.md) | XS |
| 03 | [Data migration para workspaces existentes](sub-03-data-migration.md) | XS |
| 04 | [Tests](sub-04-tests.md) | S |
