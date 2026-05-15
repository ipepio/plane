# Sub-02 — `HasWorkspacePermission` (DRF)

**Task:** 05 · **Tamaño:** XS

## Cambio

`BasePermission` para usar en `permission_classes`.

## Cómo

En el mismo `role_permission.py`:

```python
from rest_framework.permissions import BasePermission
from plane.db.models import Workspace

class HasWorkspacePermission(BasePermission):
    message = "Missing permission"

    def has_permission(self, request, view):
        code = getattr(view, "required_permission", None)
        slug = view.kwargs.get("slug") or view.kwargs.get("workspace_slug")
        if not code or not slug:
            return True  # views sin required_permission no son afectadas
        try:
            workspace = Workspace.objects.get(slug=slug)
        except Workspace.DoesNotExist:
            return False
        granted = has_permission(request, workspace, code)
        if not granted:
            self.message = f"Missing permission: {code}"
        return granted
```

## Aceptación

- [ ] View con `required_permission = "issue.create"` y `permission_classes = [HasWorkspacePermission]` deniega 403 a Guest sin ese permiso.
- [ ] El mensaje de la respuesta incluye el code.
