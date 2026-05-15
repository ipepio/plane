# Sub-01 — Serializers

**Task:** 06 · **Tamaño:** S

## Cambio

```python
from rest_framework import serializers
from plane.db.models import ProjectTemplate


class ProjectTemplateListSerializer(serializers.ModelSerializer):
    """Sin payload para listados (puede ser grande)."""
    class Meta:
        model = ProjectTemplate
        fields = ["id", "name", "description", "icon_props", "created_by", "created_at", "updated_at"]


class ProjectTemplateDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTemplate
        fields = ["id", "name", "description", "icon_props", "payload", "created_by", "created_at", "updated_at"]
        read_only_fields = ["payload", "created_by", "created_at", "updated_at"]


class InstantiatePayloadSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    identifier = serializers.RegexField(regex=r"^[A-Z][A-Z0-9]{1,11}$")
    vars = serializers.DictField(child=serializers.CharField(allow_blank=True), required=False, default=dict)
```

## Aceptación

- [ ] Detail incluye `payload`; list no.
- [ ] `identifier` validado.
