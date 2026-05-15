# Sub-06 — URLs + permisos

**Task:** 06 · **Tamaño:** XS

## Cambio

```python
from django.urls import path
from rest_framework.routers import DefaultRouter
from plane.app.views.project_template import ProjectTemplateViewSet

router = DefaultRouter(trailing_slash=True)
router.register(r"templates", ProjectTemplateViewSet, basename="project-templates")

urlpatterns = [
    path("workspaces/<str:slug>/", include(router.urls)),
]
```

Permisos: gating con `template.manage` (Admin) y `template.instantiate` (Admin/Member) via épica 08 (task-12 sub-perms).

## Aceptación

- [ ] Rutas resuelven.
