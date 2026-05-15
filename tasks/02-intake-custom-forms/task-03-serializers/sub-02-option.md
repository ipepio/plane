# Sub-02 — `IntakeFormFieldOptionSerializer`

**Task:** 03 · **Tamaño:** XS

## Cambio

```python
class IntakeFormFieldOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntakeFormFieldOption
        fields = ["id", "field", "name", "relative_order", "is_active"]
        read_only_fields = ["id"]
```

## Aceptación

- [ ] Crear option via serializer OK.
