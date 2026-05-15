# Sub-01 — `WorkspaceIntakeSerializer`

**Task:** 03 · **Tamaño:** XS

## Cambio

```python
class WorkspaceIntakeSerializer(serializers.ModelSerializer):
    pending_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = WorkspaceIntake
        fields = ["id", "workspace", "name", "description", "is_default",
                  "logo_props", "pending_count", "created_at", "updated_at"]
        read_only_fields = ["id", "workspace", "pending_count", "created_at", "updated_at"]
```

## Aceptación

- [ ] `pending_count` se llena desde annotate del queryset.
