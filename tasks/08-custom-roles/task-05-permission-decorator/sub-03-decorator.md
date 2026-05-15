# Sub-03 — Decorador `@require_permission`

**Task:** 05 · **Tamaño:** XS

## Cambio

Decorator para FBVs y endpoints sueltos donde no se quiere usar `permission_classes`.

## Cómo

```python
from functools import wraps
from rest_framework.exceptions import PermissionDenied

def require_permission(code: str, slug_kwarg: str = "slug"):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            slug = kwargs.get(slug_kwarg)
            from plane.db.models import Workspace
            try:
                ws = Workspace.objects.get(slug=slug)
            except Workspace.DoesNotExist:
                raise PermissionDenied("Workspace not found")
            if not has_permission(request, ws, code):
                raise PermissionDenied(f"Missing permission: {code}")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

## Aceptación

- [ ] Decorador aplicado a una FBV de prueba devuelve 403 si falta el permiso.
- [ ] Acepta `slug_kwarg` custom para views con `workspace_slug`.
