# Sub-02 — Atomicidad

**Task:** 07 · **Tamaño:** XS

## Cambio

Envolver el accept entero en `@transaction.atomic` y el helper también: si falla la creación del issue, el ticket no transiciona a accepted.

```python
@transaction.atomic
def accept(self, ...):
    ...
```

## Aceptación

- [ ] Si `IssueAssignee` peta por un assignee inexistente, el ticket vuelve a Pending (no queda colgado).
