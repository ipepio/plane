# Sub-02 — Bulk reorder

**Task:** 05 · **Tamaño:** XS

## Cambio

```python
@action(detail=False, methods=["post"], url_path="reorder")
def reorder(self, request, ...):
    order = request.data.get("order", [])  # [{id, relative_order}]
    for item in order:
        IssuePropertyOption.objects.filter(
            id=item["id"], property_id=self.kwargs["property_id"]
        ).update(relative_order=item["relative_order"])
    return Response(status=200)
```

## Aceptación

- [ ] Drag & drop frontend persiste con un POST.
