# Sub-01 — ViewSet workspace fields

**Task:** 04 · **Tamaño:** S

## Cambio

```python
class WorkspaceIntakeFormFieldViewSet(ModelViewSet):
    serializer_class = IntakeFormFieldSerializer

    def get_queryset(self):
        return IntakeFormField.objects.filter(
            workspace_intake_id=self.kwargs["intake_id"],
            deleted_at__isnull=True,
        ).order_by("relative_order")

    def perform_create(self, serializer):
        serializer.save(workspace_intake_id=self.kwargs["intake_id"])
```

## Aceptación

- [ ] Crear field bajo workspace intake → OK.
