# Sub-03 — URLs

**Task:** 04 · **Tamaño:** XS

```python
path("workspaces/<str:slug>/intakes/",
     WorkspaceIntakeViewSet.as_view({"get": "list", "post": "create"})),
path("workspaces/<str:slug>/intakes/<uuid:pk>/",
     WorkspaceIntakeViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"})),
```

## Aceptación

- [ ] OpenAPI las lista.
