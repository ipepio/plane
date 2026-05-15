# Sub-02 — `TeamMemberSerializer`

**Task:** 03 · **Tamaño:** XS

## Cambio

```python
from plane.db.models import TeamMember
from plane.app.serializers.user import UserLiteSerializer


class TeamMemberSerializer(serializers.ModelSerializer):
    member_detail = UserLiteSerializer(source="member", read_only=True)

    class Meta:
        model = TeamMember
        fields = ["id", "team", "member", "member_detail", "role", "created_at"]
        read_only_fields = ["id", "team", "member_detail", "created_at"]
```

## Aceptación

- [ ] `member_detail` incluye `id`, `display_name`, `email`, `avatar_url`.
- [ ] Crear/update acepta `member` y `role`.
