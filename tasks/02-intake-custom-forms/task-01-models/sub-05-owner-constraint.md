# Sub-05 — Constraint XOR `workspace_intake` / `intake`

**Task:** 01 · **Tamaño:** XS

## Cambio

Exactamente uno de los dos owner FKs debe estar set en `IntakeFormField` y en `IntakeFormFieldValue`.

```python
class Meta:
    constraints = [
        models.CheckConstraint(
            name="intake_form_field_owner_xor",
            check=(
                models.Q(workspace_intake__isnull=False, intake__isnull=True)
                | models.Q(workspace_intake__isnull=True, intake__isnull=False)
            ),
        ),
    ]
```

Análogo para `IntakeFormFieldValue`.

## Aceptación

- [ ] Crear field con ambos owner null → IntegrityError.
- [ ] Crear con ambos set → IntegrityError.
