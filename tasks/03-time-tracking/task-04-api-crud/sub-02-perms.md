# Sub-02 — Permisos y owner enforcement

**Task:** 04 · **Tamaño:** S

## Cambio

Bloquear PATCH/DELETE de worklogs ajenos a menos que el actor sea admin del proyecto.

```python
from rest_framework.exceptions import PermissionDenied
from plane.db.models import ProjectMember


def _is_project_admin(self, project_id):
    return ProjectMember.objects.filter(
        project_id=project_id, member=self.request.user, role=20, is_active=True
    ).exists()


def perform_update(self, serializer):
    instance = self.get_object()
    if instance.logged_by_id != self.request.user.id and not self._is_project_admin(instance.project_id):
        raise PermissionDenied("Cannot edit other users' worklogs.")
    serializer.save()


def perform_destroy(self, instance):
    if instance.logged_by_id != self.request.user.id and not self._is_project_admin(instance.project_id):
        raise PermissionDenied("Cannot delete other users' worklogs.")
    instance.delete()
```

## Aceptación

- [ ] Member edita el propio (200), ajeno (403).
- [ ] Admin del proyecto edita cualquiera (200).
