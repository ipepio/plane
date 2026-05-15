# Sub-03 — Multi-select

**Task:** 06 · **Tamaño:** S

## Cambio

Validación en `IssuePropertyValueWriteSerializer` para `multi_select`:
- value debe ser lista de strings (UUIDs).
- Cada UUID debe ser una `IssuePropertyOption` activa de la property.

```python
def _validate_multi_select(v, prop):
    if not isinstance(v, list):
        raise ValidationError("must be list")
    valid = set(map(str, IssuePropertyOption.objects.filter(
        property=prop, is_active=True
    ).values_list("id", flat=True)))
    bad = [oid for oid in v if str(oid) not in valid]
    if bad:
        raise ValidationError({"options": bad})
    return v
```

## Aceptación

- [ ] Lista con opción de otra property → 400.
- [ ] Reemplaza el set anterior, no acumula.
