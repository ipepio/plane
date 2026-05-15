# Sub-02 — `IssuePropertyOptionSerializer`

**Task:** 03 · **Tamaño:** XS

## Cambio

```python
class IssuePropertyOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssuePropertyOption
        fields = ["id", "property", "name", "color", "relative_order", "is_active"]
        read_only_fields = ["id"]
```

Sin más. Validación de duplicidad la garantiza el constraint del modelo.

## Aceptación

- [ ] Crear option vía serializer OK.
