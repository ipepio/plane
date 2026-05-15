# Sub-03 — Restricción "solo míos" para Guest

**Task:** 05 · **Tamaño:** S

## Cambio

Si el usuario es Guest a nivel workspace (épica 08 → permiso `worklog.view_others` falso), forzar `logged_by=request.user` en el queryset.

```python
from plane.db.models import WorkspaceMember

is_full = WorkspaceMember.objects.filter(
    workspace__slug=slug, member=request.user, role__in=(15, 20), is_active=True
).exists()
if not is_full:
    qs = qs.filter(logged_by=request.user)
```

## Aceptación

- [ ] Guest solo ve sus worklogs.
- [ ] Admin/Member ven todos.
