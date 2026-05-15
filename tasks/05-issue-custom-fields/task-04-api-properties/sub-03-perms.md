# Sub-03 — Permisos

**Task:** 04 · **Tamaño:** XS

## Cambio

Mientras épica 08 no esté lista:
```python
permission_classes = [ProjectMemberPermission]
required_role = ROLE.ADMIN
```

Después: `required_permission = "project.manage_issue_types"`.

## Aceptación

- [ ] Member sin permiso → 403.
- [ ] Admin → 200.
