# Sub-03 — URLs y registro

**Task:** 06 · **Tamaño:** XS

## Cambio

Router DRF para `RoleViewSet` y registro en el `urls.py` raíz del módulo `app`.

## Cómo

`apps/api/plane/app/urls/role.py`:

```python
from django.urls import path
from plane.app.views.role import RoleViewSet

urlpatterns = [
    path(
        "workspaces/<str:slug>/roles/",
        RoleViewSet.as_view({"get": "list", "post": "create"}),
        name="role-list",
    ),
    path(
        "workspaces/<str:slug>/roles/<uuid:pk>/",
        RoleViewSet.as_view({"get": "retrieve", "patch": "update", "delete": "destroy"}),
        name="role-detail",
    ),
]
```

`apps/api/plane/app/urls/__init__.py`: añadir `from .role import urlpatterns as role_urls` y concatenar a `urlpatterns`.

## Aceptación

- [ ] `python manage.py show_urls | grep role` lista las dos rutas.
- [ ] `curl /api/v1/workspaces/{slug}/roles/` devuelve 200 (con auth) o 401 sin auth.
