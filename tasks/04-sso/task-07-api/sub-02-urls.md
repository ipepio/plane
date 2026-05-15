# Sub-02 — URLs

**Task:** 07 · **Tamaño:** XS

## Cambio

```python
from django.urls import path
from plane.app.views.workspace_sso import WorkspaceSSOConfigView

urlpatterns = [
    path(
        "workspaces/<str:slug>/sso/",
        WorkspaceSSOConfigView.as_view(),
        name="workspace-sso-config",
    ),
]
```

Registrar en `apps/api/plane/app/urls/__init__.py`.

## Aceptación

- [ ] Ruta resuelve.
