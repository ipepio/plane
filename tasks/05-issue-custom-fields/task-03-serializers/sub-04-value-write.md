# Sub-04 — `IssuePropertyValueWriteSerializer`

**Task:** 03 · **Tamaño:** M

## Cambio

Acepta `{ property: <uuid>, value: <typed> }` y valida según `property.type`.

```python
class IssuePropertyValueWriteSerializer(serializers.Serializer):
    property = serializers.PrimaryKeyRelatedField(queryset=IssueProperty.objects.all())
    value = serializers.JSONField(allow_null=True)

    def validate(self, attrs):
        prop = attrs["property"]
        v = attrs["value"]
        if v is None and prop.is_required:
            raise serializers.ValidationError(f"{prop.name} is required")
        validator = _VALIDATORS[prop.type]
        attrs["value"] = validator(v, prop)
        return attrs


def _validate_text(v, prop):
    if not isinstance(v, str): raise ValidationError("must be string")
    max_len = prop.config.get("max_length", 4096)
    if len(v) > max_len: raise ValidationError(f"max {max_len}")
    return v

def _validate_select(v, prop):
    if not IssuePropertyOption.objects.filter(property=prop, id=v, is_active=True).exists():
        raise ValidationError("invalid option")
    return v

# análogos: number (config min/max), date (parse iso), boolean, user, url (regex), multi_select (lista de option ids)
_VALIDATORS = { "text": _validate_text, "select": _validate_select, ... }
```

## Aceptación

- [ ] `value=5` en property `text` → 400.
- [ ] `value="critical-id"` en select sin esa opción → 400.
- [ ] Texto que excede `max_length` → 400.
