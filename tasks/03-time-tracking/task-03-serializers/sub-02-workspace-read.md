# Sub-02 — WorkspaceWorklogReadSerializer

**Task:** 03 · **Tamaño:** S

## Cambio

```python
class WorkspaceWorklogReadSerializer(serializers.ModelSerializer):
    user_display_name = serializers.CharField(source="logged_by.display_name", read_only=True)
    user_email = serializers.EmailField(source="logged_by.email", read_only=True)
    project_name = serializers.CharField(source="project.name", read_only=True)
    project_identifier = serializers.CharField(source="project.identifier", read_only=True)
    issue_name = serializers.CharField(source="issue.name", read_only=True)
    issue_sequence_id = serializers.IntegerField(source="issue.sequence_id", read_only=True)

    class Meta:
        model = IssueWorklog
        fields = [
            "id", "issue", "issue_name", "issue_sequence_id",
            "project", "project_name", "project_identifier",
            "logged_by", "user_display_name", "user_email",
            "duration", "started_at", "description", "is_billable",
        ]
```

## Aceptación

- [ ] Devuelve nombres planos sin n+1 (usar `select_related` en la view).
