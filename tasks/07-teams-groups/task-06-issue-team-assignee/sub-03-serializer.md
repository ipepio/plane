# Sub-03 — Serializer

**Task:** 06 · **Tamaño:** S

## Cambio

```python
# apps/api/plane/app/serializers/issue/issue.py
class IssueSerializer(...):
    team_assignees = serializers.SerializerMethodField()

    def get_team_assignees(self, obj):
        from plane.app.serializers.team import TeamSerializer
        teams = [
            ita.team for ita in obj.issue_team_assignees.all()
            if ita.team.deleted_at is None
        ]
        return TeamSerializer(teams, many=True).data
```

Optimizar con `prefetch_related("issue_team_assignees__team")` en el queryset.

## Aceptación

- [ ] `GET /issues/<id>/` incluye `team_assignees`.
- [ ] Team soft-deleted no aparece.
