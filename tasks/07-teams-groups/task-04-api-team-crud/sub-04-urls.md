# Sub-04 — URLs

**Task:** 04 · **Tamaño:** XS

## Cambio

```python
# apps/api/plane/app/urls/workspace.py
from plane.app.views.workspace.team import TeamViewSet

urlpatterns += [
    path("workspaces/<str:slug>/teams/",
         TeamViewSet.as_view({"get": "list", "post": "create"}),
         name="workspace-teams"),
    path("workspaces/<str:slug>/teams/<uuid:pk>/",
         TeamViewSet.as_view({
             "get": "retrieve", "patch": "partial_update", "delete": "destroy"
         }),
         name="workspace-team-detail"),
]
```

## Aceptación

- [ ] `GET /workspaces/acme/teams/` → 200.
- [ ] OpenAPI lo lista.
