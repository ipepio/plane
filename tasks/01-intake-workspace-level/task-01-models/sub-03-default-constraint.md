# Sub-03 — Constraint `is_default` único

**Task:** 01 · **Tamaño:** XS

## Cambio

```python
class Meta:
    constraints = [
        ...,
        models.UniqueConstraint(
            "workspace",
            condition=models.Q(is_default=True, deleted_at__isnull=True),
            name="workspace_intake_one_default",
        ),
    ]
```

## Aceptación

- [ ] Marcar 2 intakes `is_default=True` en mismo workspace → IntegrityError.
- [ ] Una vez marcado default, otro workspace puede tener su propio default.
