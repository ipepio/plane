# Sub-02 — URLs

**Task:** 04 · **Tamaño:** XS

## Cambio

```python
path("workspaces/<str:slug>/projects/<uuid:project_id>/issue-types/<uuid:issue_type_id>/properties/",
     IssuePropertyViewSet.as_view({"get": "list", "post": "create"})),
path("workspaces/<str:slug>/projects/<uuid:project_id>/issue-types/<uuid:issue_type_id>/properties/<uuid:pk>/",
     IssuePropertyViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"})),
```

## Aceptación

- [ ] OpenAPI las lista.
