# Sub-01 — `TeamSerializer`

**Task:** 03 · **Tamaño:** XS

## Cambio

```python
# apps/api/plane/app/serializers/team.py
from rest_framework import serializers
from plane.db.models import Team


class TeamSerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Team
        fields = [
            "id", "name", "description", "logo_props",
            "workspace", "member_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "workspace", "created_at", "updated_at"]
```

## Aceptación

- [ ] Serializa `Team` con todos los campos esperados.
- [ ] `member_count` solo aparece si el queryset hace `annotate`.
