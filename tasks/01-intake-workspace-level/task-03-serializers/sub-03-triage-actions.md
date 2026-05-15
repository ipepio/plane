# Sub-03 — Action serializers

**Task:** 03 · **Tamaño:** S

## Cambio

```python
class AcceptIntakeIssueSerializer(serializers.Serializer):
    project = serializers.UUIDField()
    state = serializers.UUIDField(required=False)
    assignees = serializers.ListField(child=serializers.UUIDField(), required=False)


class RejectIntakeIssueSerializer(serializers.Serializer):
    decision_note = serializers.CharField(required=True, allow_blank=False)


class SnoozeIntakeIssueSerializer(serializers.Serializer):
    snoozed_till = serializers.DateTimeField(required=True)


class DuplicateIntakeIssueSerializer(serializers.Serializer):
    duplicate_of = serializers.UUIDField(required=True)
```

## Aceptación

- [ ] Validación: `accept` sin `project` → 400.
- [ ] Validación: `reject` sin `decision_note` → 400.
