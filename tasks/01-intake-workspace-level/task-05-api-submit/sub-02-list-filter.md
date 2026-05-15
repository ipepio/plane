# Sub-02 — Filtro por status

**Task:** 05 · **Tamaño:** XS

## Cambio

```python
def get_queryset(self):
    qs = super().get_queryset()
    status_param = self.request.query_params.get("status")
    if status_param:
        qs = qs.filter(status__in=status_param.split(","))
    return qs
```

## Aceptación

- [ ] `?status=pending` filtra.
- [ ] `?status=pending,snoozed` filtra ambos.
