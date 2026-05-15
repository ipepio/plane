# Sub-03 — Permisos own vs all

**Task:** 05 · **Tamaño:** S

## Cambio

Para `list`/`retrieve`:
- Si el user tiene permiso `intake.triage` (épica 08) o es Admin → ve todos.
- Si no → solo ve los suyos (`submitter=request.user`).

```python
def get_queryset(self):
    qs = super().get_queryset()
    if not has_permission(self.request, self._workspace(), "intake.triage"):
        qs = qs.filter(submitter=self.request.user)
    return qs
```

Para `create`: cualquier workspace member.

Para `update`/`destroy` del ticket: solo el submitter mientras esté pending, o un triador.

## Aceptación

- [ ] Submitter ve sus 3 tickets, no los de otros.
- [ ] Triador ve los 100.
