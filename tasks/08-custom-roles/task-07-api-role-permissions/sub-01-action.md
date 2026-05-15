# Sub-01 — Action `permissions` en `RoleViewSet`

**Task:** 07 · **Tamaño:** S

## Cambio

Añadir endpoint dedicado que reemplaza el set de permisos.

## Cómo

En `apps/api/plane/app/views/role.py`:

```python
from django.db import transaction
from rest_framework.decorators import action
from plane.db.models import Permission, RolePermission

class RoleViewSet(viewsets.ModelViewSet):
    # ... lo de task-06 ...

    @action(detail=True, methods=["get", "put"], url_path="permissions")
    def permissions(self, request, slug=None, pk=None):
        role = self.get_object()
        if request.method == "GET":
            codes = list(role.permissions.values_list("code", flat=True))
            return Response({"permission_codes": codes})

        if role.is_system:
            raise PermissionDenied("System roles cannot be modified")

        codes = request.data.get("permission_codes", [])
        if not isinstance(codes, list):
            return Response({"detail": "permission_codes must be a list"}, status=400)

        valid = set(Permission.objects.filter(code__in=codes).values_list("code", flat=True))
        invalid = [c for c in codes if c not in valid]
        if invalid:
            return Response({"invalid_codes": invalid}, status=400)

        with transaction.atomic():
            RolePermission.objects.filter(role=role).delete()
            perms = Permission.objects.filter(code__in=codes)
            RolePermission.objects.bulk_create([
                RolePermission(role=role, permission=p) for p in perms
            ])
        return Response({"permission_codes": codes})
```

Y registrar la URL en `apps/api/plane/app/urls/role.py`:

```python
path(
    "workspaces/<str:slug>/roles/<uuid:pk>/permissions/",
    RoleViewSet.as_view({"get": "permissions", "put": "permissions"}),
    name="role-permissions",
),
```

## Aceptación

- [ ] PUT con set válido reemplaza atómicamente.
- [ ] Race con request concurrente no deja estado inconsistente.
- [ ] GET devuelve los codes ordenados estables.
