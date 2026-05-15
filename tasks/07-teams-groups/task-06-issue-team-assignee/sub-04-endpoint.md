# Sub-04 — PATCH team_assignees

**Task:** 06 · **Tamaño:** M

## Cambio

En `IssueViewSet.partial_update`, aceptar `team_assignees` (lista de UUIDs) y sincronizar la tabla.

```python
def _sync_team_assignees(self, issue, team_ids):
    current = set(
        str(t) for t in issue.issue_team_assignees.values_list("team_id", flat=True)
    )
    target = set(str(t) for t in team_ids)
    to_add = target - current
    to_remove = current - target

    if to_remove:
        IssueTeamAssignee.objects.filter(issue=issue, team_id__in=to_remove).delete()
    if to_add:
        IssueTeamAssignee.objects.bulk_create([
            IssueTeamAssignee(issue=issue, team_id=tid,
                              project_id=issue.project_id, workspace_id=issue.workspace_id)
            for tid in to_add
        ])
```

Llamar desde `partial_update` si el payload trae la key.

## Aceptación

- [ ] PATCH añade y quita correctamente.
- [ ] PATCH con misma lista no genera duplicados.
