# Sub-02 — `WorkspaceIntakeIssueSerializer`

**Task:** 03 · **Tamaño:** S

## Cambio

```python
class WorkspaceIntakeIssueSerializer(serializers.ModelSerializer):
    submitter_detail = UserLiteSerializer(source="submitter", read_only=True)
    triaged_by_detail = UserLiteSerializer(source="triaged_by", read_only=True)

    class Meta:
        model = WorkspaceIntakeIssue
        fields = [
            "id", "intake", "submitter", "submitter_detail",
            "name", "description_html", "priority", "metadata",
            "status", "decision_note", "snoozed_till", "duplicate_of",
            "accepted_issue", "triaged_by", "triaged_by_detail",
            "triaged_at", "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "submitter", "submitter_detail", "status",
            "decision_note", "snoozed_till", "duplicate_of",
            "accepted_issue", "triaged_by", "triaged_by_detail", "triaged_at",
        ]
```

> Status y triage fields son read-only en este serializer; cambian via endpoints de acción.

## Aceptación

- [ ] POST `{name, description_html, priority}` crea Pending con submitter=request.user.
