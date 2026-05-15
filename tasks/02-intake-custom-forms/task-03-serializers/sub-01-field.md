# Sub-01 — `IntakeFormFieldSerializer`

**Task:** 03 · **Tamaño:** S

## Cambio

```python
class IntakeFormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntakeFormField
        fields = [
            "id", "workspace_intake", "intake", "label", "placeholder",
            "help_text", "type", "config", "is_required", "is_active", "relative_order",
        ]
        read_only_fields = ["id", "workspace_intake", "intake"]


class IntakeFormFieldDetailSerializer(IntakeFormFieldSerializer):
    options = IntakeFormFieldOptionSerializer(many=True, read_only=True)

    class Meta(IntakeFormFieldSerializer.Meta):
        fields = IntakeFormFieldSerializer.Meta.fields + ["options"]
```

## Aceptación

- [ ] Detail incluye options.
