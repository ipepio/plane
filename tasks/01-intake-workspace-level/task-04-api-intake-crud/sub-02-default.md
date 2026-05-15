# Sub-02 — Flip `is_default`

**Task:** 04 · **Tamaño:** XS

## Cambio

Al setear `is_default=True` en un intake, desmarcar los demás del mismo workspace en transacción.

```python
def perform_update(self, serializer):
    obj = serializer.save()
    if serializer.validated_data.get("is_default"):
        WorkspaceIntake.objects.filter(workspace=obj.workspace).exclude(pk=obj.pk).update(is_default=False)
```

> El constraint condicional permite solo uno, pero el update simultáneo lo deja claro sin error.

## Aceptación

- [ ] Marcar default en B desmarca A automáticamente.
