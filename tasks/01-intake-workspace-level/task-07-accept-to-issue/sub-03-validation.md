# Sub-03 — Validación cross-project

**Task:** 07 · **Tamaño:** S

## Cambio

Antes de crear el issue:
- `project` debe pertenecer al mismo workspace que el ticket.
- El triador debe ser miembro del proyecto destino (o tener `issue.create` allá vía épica 08).
- Si `state` pasado: debe ser del proyecto destino.
- Si `assignees`: cada uno debe ser miembro del proyecto destino.

```python
def _validate_accept_payload(ticket, project, state, assignees, by):
    if project.workspace_id != ticket.intake.workspace_id:
        raise ValidationError("project not in same workspace")
    if not ProjectMember.objects.filter(project=project, member=by).exists():
        raise ValidationError("you are not a member of the destination project")
    if state and state.project_id != project.id:
        raise ValidationError("state not in destination project")
    if assignees:
        valid = ProjectMember.objects.filter(
            project=project, member_id__in=assignees
        ).count()
        if valid != len(assignees):
            raise ValidationError("some assignees are not in the project")
```

## Aceptación

- [ ] Cross-workspace project → 400.
- [ ] Assignee no member del proyecto → 400.
