# Sub-03 — URLs

**Task:** 04 · **Tamaño:** XS

## Cambio

```python
# apps/api/plane/app/urls/worklog.py
from django.urls import path
from plane.app.views.worklog import IssueWorklogViewSet

urlpatterns = [
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/worklogs/",
        IssueWorklogViewSet.as_view({"get": "list", "post": "create"}),
        name="issue-worklogs",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/worklogs/<uuid:pk>/",
        IssueWorklogViewSet.as_view({
            "get": "retrieve", "patch": "partial_update", "delete": "destroy",
        }),
        name="issue-worklog-detail",
    ),
]
```

Registrar en `apps/api/plane/app/urls/__init__.py`.

## Aceptación

- [ ] Rutas resuelven en `urls`.
