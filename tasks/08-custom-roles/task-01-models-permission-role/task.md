# Task 01 — Modelos `Permission`, `Role`, `RolePermission`

**Épica:** 08 — Custom Roles · **Depende de:** — · **Tamaño:** S

## Contexto

La tabla actual no tiene noción de rol como entidad: `WorkspaceMember.role` es un `IntegerField` con `ROLE_CHOICES = ((20, "Admin"), (15, "Member"), (5, "Guest"))` (ver `apps/api/plane/db/models/workspace.py:19`). Esta tarea añade los modelos relacionales que permitirán roles custom.

## Diseño

```python
# Permission
code: CharField(max_length=64, unique=True)   # p.ej. "issue.create"
name: CharField(max_length=128)
description: TextField(blank=True)
category: CharField(max_length=32)             # workspace|project|issue|intake|worklog|template|team

# Role  (workspace-level)
workspace: FK(Workspace, on_delete=CASCADE, related_name="roles")
name: CharField(max_length=64)
description: TextField(blank=True)
is_system: BooleanField(default=False)
level: PositiveSmallIntegerField(null=True, blank=True)  # 20/15/5 para sistemas, null para custom
permissions: M2M(Permission, through="RolePermission", related_name="roles")
# unique_together: (workspace, name, deleted_at)
# constraint: nombre único activo "(workspace, name) WHERE deleted_at IS NULL"

# RolePermission
role: FK(Role, on_delete=CASCADE)
permission: FK(Permission, on_delete=CASCADE)
# unique_together: (role, permission)
```

`Role.delete()` lanza `ProtectedError` si `is_system=True` (impedir borrado vía ORM directo).

## Archivos afectados

- `apps/api/plane/db/models/role.py` (nuevo)
- `apps/api/plane/db/models/__init__.py` (exports)
- `apps/api/plane/db/migrations/00XX_role_permission.py` (auto-generada)
- `apps/api/plane/tests/db/test_role_models.py` (nuevo)

## Aceptación

- [ ] `python manage.py migrate` aplica limpia.
- [ ] `Permission.code` rechaza duplicados.
- [ ] Borrar un `Role` con `is_system=True` lanza `ProtectedError`.
- [ ] Tests cubren happy path + constraints.

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Crear `Permission`](sub-01-create-permission-model.md) | XS |
| 02 | [Crear `Role` + protección is_system](sub-02-create-role-model.md) | S |
| 03 | [Crear `RolePermission` (through M2M)](sub-03-create-rolepermission-model.md) | XS |
| 04 | [Exports en `db/models/__init__.py`](sub-04-export-models.md) | XS |
| 05 | [Generar y revisar migración](sub-05-generate-migration.md) | XS |
| 06 | [Tests de los 3 modelos](sub-06-model-tests.md) | S |
