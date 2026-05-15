# Sub-01 — WorkspaceSSOConfigSerializer

**Task:** 06 · **Tamaño:** S

## Cambio

```python
from rest_framework import serializers
from plane.db.models import WorkspaceSSOConfig


class WorkspaceSSOConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceSSOConfig
        fields = ["id", "enabled", "allowed_domains", "auto_provision_role", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_allowed_domains(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Must be a list of strings.")
        return value

    def validate(self, attrs):
        if attrs.get("enabled") and not attrs.get("allowed_domains"):
            raise serializers.ValidationError({"allowed_domains": "Required when SSO is enabled."})
        return attrs
```

## Aceptación

- [ ] No permite enabled sin dominios.
