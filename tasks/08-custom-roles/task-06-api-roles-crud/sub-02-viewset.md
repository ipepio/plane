# Sub-02 — `RoleViewSet`

**Task:** 06 · **Tamaño:** M

## Cambio

ViewSet completo con bloqueos de roles del sistema y annotation de `members_count`.

## Cómo

`apps/api/plane/app/views/role.py`:

```python
from django.db.models import Count, Q
from rest_framework import viewsets, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from plane.db.models import Role, Workspace
from plane.app.serializers.role import RoleSerializer, RoleDetailSerializer
from plane.app.permissions.role_permission import HasWorkspacePermission

class RoleViewSet(viewsets.ModelViewSet):
    permission_classes = [HasWorkspacePermission]
    required_permission = "workspace.manage_roles"

    def get_queryset(self):
        slug = self.kwargs["slug"]
        return (
            Role.objects.filter(workspace__slug=slug, deleted_at__isnull=True)
            .annotate(members_count=Count("workspace_members", filter=Q(workspace_members__deleted_at__isnull=True)))
        )

    def get_serializer_class(self):
        return RoleDetailSerializer if self.action == "retrieve" else RoleSerializer

    def perform_create(self, serializer):
        workspace = Workspace.objects.get(slug=self.kwargs["slug"])
        serializer.save(workspace=workspace, is_system=False)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_system:
            raise PermissionDenied("System roles cannot be modified")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_system:
            raise PermissionDenied("System roles cannot be deleted")
        return super().destroy(request, *args, **kwargs)
```

## Aceptación

- [ ] List anota `members_count` correcto.
- [ ] Create siempre fuerza `is_system=False` aunque el cliente lo mande `True`.
- [ ] PATCH/DELETE en is_system → 403.
