# Sub-01 — ViewSet options

**Task:** 05 · **Tamaño:** S

## Cambio

```python
class IssuePropertyOptionViewSet(ModelViewSet):
    serializer_class = IssuePropertyOptionSerializer

    def get_queryset(self):
        return IssuePropertyOption.objects.filter(
            property_id=self.kwargs["property_id"], deleted_at__isnull=True
        ).order_by("relative_order")

    def perform_create(self, serializer):
        serializer.save(property_id=self.kwargs["property_id"])
```

URLs paralelas a properties.

## Aceptación

- [ ] CRUD options funcional.
- [ ] Crear opción en property no-select → 400.
