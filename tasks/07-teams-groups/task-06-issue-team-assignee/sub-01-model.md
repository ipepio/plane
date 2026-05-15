# Sub-01 — `IssueTeamAssignee`

**Task:** 06 · **Tamaño:** S

## Cambio

```python
# apps/api/plane/db/models/issue.py
class IssueTeamAssignee(ProjectBaseModel):
    issue = models.ForeignKey(
        Issue, on_delete=models.CASCADE, related_name="issue_team_assignees"
    )
    team = models.ForeignKey(
        "db.Team", on_delete=models.CASCADE, related_name="issue_assignments"
    )

    class Meta:
        db_table = "issue_team_assignees"
        unique_together = ("issue", "team")
```

## Aceptación

- [ ] `issue.issue_team_assignees.all()` lista.
- [ ] `team.issue_assignments.all()` lista issues asignados.
