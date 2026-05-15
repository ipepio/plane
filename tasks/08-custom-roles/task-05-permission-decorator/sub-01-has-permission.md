# Sub-01 — Función `has_permission` con cache

**Task:** 05 · **Tamaño:** S

## Cambio

Resolución eficiente de permiso con cache por request.

## Cómo

`apps/api/plane/app/permissions/role_permission.py`:

```python
from plane.db.models import WorkspaceMember

def has_permission(request, workspace, code: str) -> bool:
    user = getattr(request, "user", None)
    if not user or user.is_anonymous:
        return False

    cache = getattr(request, "_permission_cache", None)
    if cache is None:
        cache = {}
        setattr(request, "_permission_cache", cache)

    key = (workspace.id, code)
    if key in cache:
        return cache[key]

    member = (
        WorkspaceMember.objects
        .filter(workspace=workspace, member=user, deleted_at__isnull=True)
        .select_related("role_obj")
        .first()
    )
    if not member or not member.role_obj:
        cache[key] = False
        return False

    granted = member.role_obj.permissions.filter(code=code).exists()
    cache[key] = granted
    return granted
```

## Aceptación

- [ ] 2ª llamada con misma `(workspace, code)` no genera queries SQL extra (`assertNumQueries`).
- [ ] Funciona aunque `member.role_obj` sea `None`.
