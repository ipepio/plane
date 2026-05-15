# Sub-03 — Bulk reorder

**Task:** 04 · **Tamaño:** XS

## Cambio

```python
@action(detail=False, methods=["post"], url_path="reorder")
def reorder(self, request, ...):
    for item in request.data.get("order", []):
        IntakeFormField.objects.filter(id=item["id"]).update(
            relative_order=item["relative_order"]
        )
    return Response(status=200)
```

## Aceptación

- [ ] Persiste reorden.
