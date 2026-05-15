# Sub-01 — `seed_system_roles_for_workspace(workspace)`

**Task:** 03 · **Tamaño:** S

## Cambio

Función idempotente que asegura los 3 roles del sistema en un workspace.

## Cómo

`apps/api/plane/seeds/system_roles.py`:

```python
SYSTEM_ROLE_PERMISSIONS = { ... }          # ver task.md
LEVEL_BY_ROLE = {"Admin": 20, "Member": 15, "Guest": 5}

def seed_system_roles_for_workspace(workspace, apps=None):
    Role = _model("Role", apps)
    Permission = _model("Permission", apps)
    RolePermission = _model("RolePermission", apps)

    for name, codes in SYSTEM_ROLE_PERMISSIONS.items():
        role, _ = Role.objects.update_or_create(
            workspace=workspace,
            name=name,
            defaults={"is_system": True, "level": LEVEL_BY_ROLE[name]},
        )
        if codes == "*":
            permissions = list(Permission.objects.all())
        else:
            permissions = list(Permission.objects.filter(code__in=codes))
        existing = set(role.role_permissions.values_list("permission_id", flat=True))
        target = set(p.id for p in permissions)
        for pid in target - existing:
            RolePermission.objects.create(role=role, permission_id=pid)
        for pid in existing - target:
            RolePermission.objects.filter(role=role, permission_id=pid).delete()

def _model(name, apps):
    if apps:
        return apps.get_model("db", name)
    from plane.db import models as m
    return getattr(m, name)
```

## Aceptación

- [ ] Llamada en workspace nuevo crea 3 roles + sus M2M.
- [ ] Quitar un permiso del mapeo y re-llamar lo elimina del rol.
- [ ] Añadir un permiso al mapeo y re-llamar lo añade.
