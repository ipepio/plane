# Sub-03 — `IntakeFormFieldValueWriteSerializer`

**Task:** 03 · **Tamaño:** M

## Cambio

```python
class IntakeFormFieldValueWriteSerializer(serializers.Serializer):
    field = serializers.PrimaryKeyRelatedField(queryset=IntakeFormField.objects.all())
    value = serializers.JSONField(allow_null=True)

    def validate(self, attrs):
        field = attrs["field"]
        v = attrs["value"]
        if v in (None, "", []) and field.is_required:
            raise ValidationError(f"{field.label} is required")
        attrs["value"] = _VALIDATORS[field.type](v, field)
        return attrs
```

Validadores análogos a épica 05 task-03 sub-04. Para `file`, `value` debe ser una URL previamente firmada (subida vía endpoint dedicado), no el binary.

## Aceptación

- [ ] Required ausente → 400.
- [ ] Type mismatch → 400.
