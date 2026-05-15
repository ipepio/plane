# Sub-01 — `IssuePropertySerializer`

**Task:** 03 · **Tamaño:** S

## Cambio

```python
class IssuePropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueProperty
        fields = [
            "id", "issue_type", "name", "display_name", "type", "config",
            "is_required", "is_active", "relative_order",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_name(self, value):
        if not value.replace("_", "").isalnum() or value[0].isdigit():
            raise serializers.ValidationError("name must be slug-like (letters, digits, underscores, not starting with digit)")
        return value

    def validate(self, attrs):
        if attrs.get("type") in ("select", "multi_select") and not self.instance:
            # opciones se añaden después; OK crear sin opciones
            pass
        return attrs


class IssuePropertyDetailSerializer(IssuePropertySerializer):
    options = "...IssuePropertyOptionSerializer(many=True, read_only=True)"
    class Meta(IssuePropertySerializer.Meta):
        fields = IssuePropertySerializer.Meta.fields + ["options"]
```

## Aceptación

- [ ] Nombre con espacios → 400.
- [ ] Detail incluye options.
