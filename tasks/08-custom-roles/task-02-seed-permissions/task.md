# Task 02 — Seed del catálogo de permisos

**Épica:** 08 — Custom Roles · **Depende de:** task-01 · **Tamaño:** S

## Contexto

Tras task-01 la tabla `permissions` existe vacía. Hay que poblarla con el catálogo canónico (~40 entradas) de forma idempotente, para que cualquier instalación (dev, staging, prod) tenga los mismos `code`s disponibles.

## Diseño

- Lista canónica `PERMISSIONS` en `apps/api/plane/seeds/permissions.py` como código (no fixture YAML/JSON, para que cambios pasen por code review).
- Función `seed_permissions()` con `Permission.objects.update_or_create(code=...)` → idempotente.
- Data migration que la invoca para distribuirla en cualquier deploy.

## Catálogo

```python
PERMISSIONS = [
    # workspace
    {"code": "workspace.invite_members", "category": "workspace", "name": "Invite members"},
    {"code": "workspace.manage_settings", "category": "workspace", "name": "Manage workspace settings"},
    {"code": "workspace.manage_roles", "category": "workspace", "name": "Manage roles"},
    {"code": "workspace.view_billing", "category": "workspace", "name": "View billing"},
    # project
    {"code": "project.create", "category": "project", "name": "Create project"},
    {"code": "project.archive", "category": "project", "name": "Archive project"},
    {"code": "project.delete", "category": "project", "name": "Delete project"},
    {"code": "project.manage_members", "category": "project", "name": "Manage project members"},
    {"code": "project.manage_settings", "category": "project", "name": "Manage project settings"},
    # issue
    {"code": "issue.create", "category": "issue", "name": "Create issue"},
    {"code": "issue.edit_own", "category": "issue", "name": "Edit own issue"},
    {"code": "issue.edit_any", "category": "issue", "name": "Edit any issue"},
    {"code": "issue.delete_own", "category": "issue", "name": "Delete own issue"},
    {"code": "issue.delete_any", "category": "issue", "name": "Delete any issue"},
    {"code": "issue.comment", "category": "issue", "name": "Comment on issues"},
    {"code": "issue.change_state", "category": "issue", "name": "Change issue state"},
    {"code": "issue.change_assignee", "category": "issue", "name": "Change issue assignee"},
    # intake
    {"code": "intake.submit", "category": "intake", "name": "Submit intake ticket"},
    {"code": "intake.triage", "category": "intake", "name": "Triage intake tickets"},
    {"code": "intake.manage_forms", "category": "intake", "name": "Manage intake forms"},
    # worklog
    {"code": "worklog.log_own", "category": "worklog", "name": "Log own time"},
    {"code": "worklog.view_others", "category": "worklog", "name": "View others' worklog"},
    {"code": "worklog.edit_others", "category": "worklog", "name": "Edit others' worklog"},
    # template
    {"code": "template.manage", "category": "template", "name": "Manage project templates"},
    # team
    {"code": "team.manage", "category": "team", "name": "Manage teams"},
]
```

## Archivos afectados

- `apps/api/plane/seeds/__init__.py` (asegurar que existe)
- `apps/api/plane/seeds/permissions.py` (nuevo)
- `apps/api/plane/db/migrations/00XX_seed_permissions.py` (nuevo)
- `apps/api/plane/tests/seeds/test_permissions.py` (nuevo)

## Aceptación

- [ ] Migración aplica y crea las 25+ filas.
- [ ] Re-aplicar (rollback + migrate) no duplica.
- [ ] Cambiar `name` de un permiso en código + migración → actualiza la fila existente.

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Definir constante `PERMISSIONS`](sub-01-permissions-constant.md) | XS |
| 02 | [Función `seed_permissions()`](sub-02-seed-function.md) | XS |
| 03 | [Data migration que la invoca](sub-03-data-migration.md) | XS |
| 04 | [Tests de idempotencia y actualización](sub-04-idempotence-tests.md) | S |
