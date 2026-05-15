# Sub-04 — Endpoint search de teams (autocomplete)

**Task:** 07 · **Tamaño:** XS

## Cambio

```python
# views/workspace/team.py
@action(detail=False, methods=["get"], url_path="search")
def search(self, request, slug):
    q = request.query_params.get("query", "").strip()
    qs = self.get_queryset().filter(name__icontains=q)[:10]
    return Response(TeamSerializer(qs, many=True).data)
```

URL: `GET /workspaces/<slug>/teams/search/?query=ba`.

## Aceptación

- [ ] Devuelve top-10 por nombre.
- [ ] Vacío sin query → top-10 más recientes.
