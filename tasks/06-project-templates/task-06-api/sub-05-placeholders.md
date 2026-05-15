# Sub-05 — Action placeholders

**Task:** 06 · **Tamaño:** XS

## Cambio

```python
from plane.utils.project_template.placeholders import extract_placeholders


@action(detail=True, methods=["get"], url_path="placeholders")
def placeholders(self, request, slug, pk):
    tpl = self.get_object()
    return Response({"placeholders": sorted(extract_placeholders(tpl.payload))})
```

## Aceptación

- [ ] GET devuelve `{"placeholders": [...]}`.
