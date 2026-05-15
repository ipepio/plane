# Sub-03 — Permisos

**Task:** 04 · **Tamaño:** XS

## Cambio

Hasta que épica 08 esté lista, usar el check legacy. Después, sustituir.

```python
from plane.app.permissions import WorkspaceUserPermission, ROLE  # legacy

class TeamViewSet(ModelViewSet):
    permission_classes = [WorkspaceUserPermission]
    required_role = ROLE.ADMIN  # mientras no haya épica 08
```

> Cuando exista épica 08: `required_permission = "workspace.manage_teams"`.

## Aceptación

- [ ] Guest no puede crear/editar/borrar teams (403).
- [ ] Admin puede.
