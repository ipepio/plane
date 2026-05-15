# Sub-02 — Validar required del form

**Task:** 06 · **Tamaño:** S

## Cambio

Antes del create del ticket, verificar que el payload trae value para cada field `is_required=True && is_active=True` del intake.

```python
def _validate_required_fields(intake, raw):
    required = set(IntakeFormField.objects.filter(
        workspace_intake=intake, is_required=True, is_active=True,
    ).values_list("id", flat=True))
    provided = {str(v["field"]) for v in raw}
    missing = required - {str(r) for r in provided}
    if missing:
        raise ValidationError({"form_values": list(missing)})
```

## Aceptación

- [ ] Submit sin un required → 400 con lista de field ids missing.
