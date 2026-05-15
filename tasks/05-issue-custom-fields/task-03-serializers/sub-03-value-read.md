# Sub-03 — `IssuePropertyValueSerializer` (read)

**Task:** 03 · **Tamaño:** S

## Cambio

```python
class IssuePropertyValueSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()

    class Meta:
        model = IssuePropertyValue
        fields = ["id", "issue", "property", "value"]

    def get_value(self, obj):
        type_ = obj.property.type
        if type_ in ("text", "long_text", "url"):
            return obj.value_text
        if type_ == "number":
            return float(obj.value_number) if obj.value_number is not None else None
        if type_ == "date":
            return obj.value_datetime.isoformat() if obj.value_datetime else None
        if type_ == "boolean":
            return obj.value_boolean
        if type_ == "select":
            return str(obj.value_option_id) if obj.value_option_id else None
        if type_ == "user":
            return str(obj.value_user_id) if obj.value_user_id else None
        if type_ == "multi_select":
            return [str(m.option_id) for m in obj.multi_options.all()]
        return None
```

## Aceptación

- [ ] Output tiene `value` con forma adecuada al tipo.
- [ ] Multi-select retorna array.
