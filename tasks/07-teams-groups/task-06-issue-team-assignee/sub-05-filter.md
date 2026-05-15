# Sub-05 — Filtro "issues asignadas a mi team"

**Task:** 06 · **Tamaño:** S

## Cambio

En el filtro de issues existente (`apps/api/plane/utils/issue_filters.py` o equivalente), añadir param `team_assignees=<uuid|uuid>` y `my_teams=true`.

```python
if filters.get("my_teams"):
    user_teams = TeamMember.objects.filter(
        member=request.user, team__workspace_id=ws_id
    ).values_list("team_id", flat=True)
    q &= Q(issue_team_assignees__team_id__in=user_teams)
elif filters.get("team_assignees"):
    q &= Q(issue_team_assignees__team_id__in=filters["team_assignees"])
```

## Aceptación

- [ ] `GET /issues/?my_teams=true` filtra a issues con team del que el user es miembro.
- [ ] `GET /issues/?team_assignees=<uuid>` filtra.
