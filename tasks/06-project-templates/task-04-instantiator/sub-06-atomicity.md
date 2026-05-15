# Sub-06 — Atomicidad y rollback

**Task:** 04 · **Tamaño:** S

## Cambio

Verificar que un fallo a mitad (ej: identifier ya usado) revierte todo. El decorator `@transaction.atomic` ya está, pero:

```python
def test_partial_failure_rolls_back(template, workspace):
    initial = Project.objects.filter(workspace=workspace).count()
    template.payload["issues"].append({"key": "issue:bad", "state_key": "state:does_not_exist", ...})
    with pytest.raises(Exception):
        instantiate_template(template, workspace, name="X", identifier="X", vars={}, by=user)
    assert Project.objects.filter(workspace=workspace).count() == initial
```

## Aceptación

- [ ] Test pasa: count de projects no cambia tras fallo.
