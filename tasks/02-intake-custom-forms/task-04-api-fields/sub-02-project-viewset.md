# Sub-02 — ViewSet project intake fields

**Task:** 04 · **Tamaño:** S

## Cambio

```python
class ProjectIntakeFormFieldViewSet(ModelViewSet):
    serializer_class = IntakeFormFieldSerializer

    def get_queryset(self):
        return IntakeFormField.objects.filter(
            intake_id=self.kwargs["intake_id"], deleted_at__isnull=True,
        ).order_by("relative_order")

    def perform_create(self, serializer):
        serializer.save(intake_id=self.kwargs["intake_id"])
```

## Aceptación

- [ ] Crear field bajo intake de proyecto → OK.
