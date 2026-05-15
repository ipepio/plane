# Sub-01 — ViewSet options

**Task:** 05 · **Tamaño:** S

## Cambio

```python
class IntakeFormFieldOptionViewSet(ModelViewSet):
    serializer_class = IntakeFormFieldOptionSerializer

    def get_queryset(self):
        return IntakeFormFieldOption.objects.filter(
            field_id=self.kwargs["field_id"], deleted_at__isnull=True,
        ).order_by("relative_order")

    def perform_create(self, serializer):
        serializer.save(field_id=self.kwargs["field_id"])
```

## Aceptación

- [ ] Crear / list / patch / destroy OK.
