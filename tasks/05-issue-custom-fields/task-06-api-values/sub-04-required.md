# Sub-04 — Required en create de issue

**Task:** 06 · **Tamaño:** S

## Cambio

Al crear un Issue, si su `issue_type` tiene properties con `is_required=True`, el payload debe traer values para todas ellas. Validar en `IssueSerializer.validate` (o en una mixin).

```python
def validate(self, attrs):
    issue_type = attrs.get("type")
    if issue_type:
        required = set(
            IssueProperty.objects.filter(
                issue_type=issue_type, is_required=True, is_active=True
            ).values_list("id", flat=True)
        )
        provided = {str(v["property"]) for v in self.initial_data.get("property_values", [])}
        missing = required - provided
        if missing:
            raise ValidationError({"property_values": list(missing)})
    return attrs
```

## Aceptación

- [ ] Crear Bug sin `severity` (required) → 400.
- [ ] Crear Bug con `severity` → 201 y values persistidos.
