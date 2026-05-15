# Sub-04 — URLs

**Task:** 05 · **Tamaño:** XS

```python
path("workspaces/<str:slug>/intakes/<uuid:intake_id>/tickets/",
     WorkspaceIntakeIssueViewSet.as_view({"get": "list", "post": "create"})),
path("workspaces/<str:slug>/intakes/<uuid:intake_id>/tickets/<uuid:pk>/",
     WorkspaceIntakeIssueViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"})),
```

## Aceptación

- [ ] OpenAPI las lista.
