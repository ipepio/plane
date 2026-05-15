# Sub-01 — IssueWorklogSerializer

**Task:** 03 · **Tamaño:** S

## Cambio

```python
from rest_framework import serializers
from plane.db.models import IssueWorklog


class IssueWorklogSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueWorklog
        fields = [
            "id", "issue", "logged_by", "duration", "started_at",
            "description", "is_billable", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "logged_by", "created_at", "updated_at"]

    def validate_duration(self, v):
        if v <= 0:
            raise serializers.ValidationError("Duration must be > 0.")
        if v > 24 * 3600:
            raise serializers.ValidationError("Duration cannot exceed 24h per entry.")
        return v
```

## Aceptación

- [ ] Rechaza duration 0, negativo y > 86400.
