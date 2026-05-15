# Sub-01 — Serializers de Role

**Task:** 06 · **Tamaño:** S

## Cambio

Dos serializers: `RoleSerializer` (list, write) y `RoleDetailSerializer` (retrieve con permisos anidados).

## Cómo

`apps/api/plane/app/serializers/role.py`:

```python
from rest_framework import serializers
from plane.db.models import Role, Permission

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "code", "name", "description", "category"]
        read_only_fields = fields

class RoleSerializer(serializers.ModelSerializer):
    members_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Role
        fields = ["id", "workspace", "name", "description", "is_system", "level", "members_count"]
        read_only_fields = ["workspace", "is_system", "members_count"]

class RoleDetailSerializer(RoleSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta(RoleSerializer.Meta):
        fields = RoleSerializer.Meta.fields + ["permissions"]
```

## Aceptación

- [ ] `RoleSerializer(role).data` incluye `members_count`.
- [ ] `RoleDetailSerializer(role).data["permissions"]` es lista de objetos.
- [ ] Intento de escribir `is_system` o `workspace` vía API se ignora (read_only).
