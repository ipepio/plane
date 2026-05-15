# Sub-01 — ViewSet

**Task:** 04 · **Tamaño:** S

## Cambio

```python
# apps/api/plane/app/views/issue/property.py
class IssuePropertyViewSet(ModelViewSet):
    def get_serializer_class(self):
        return IssuePropertyDetailSerializer if self.action == "retrieve" else IssuePropertySerializer

    def get_queryset(self):
        return IssueProperty.objects.filter(
            issue_type_id=self.kwargs["issue_type_id"],
            workspace__slug=self.kwargs["slug"],
            deleted_at__isnull=True,
        ).order_by("relative_order")

    def perform_create(self, serializer):
        serializer.save(
            workspace_id=self._workspace_id(),
            project_id=self.kwargs.get("project_id"),
            issue_type_id=self.kwargs["issue_type_id"],
        )
```

## Aceptación

- [ ] Crear property anclada a issue type.
- [ ] List devuelve properties ordenadas.
