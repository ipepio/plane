# Sub-01 — Helper `create_issue_from_intake_ticket`

**Task:** 07 · **Tamaño:** M

## Cambio

```python
# apps/api/plane/utils/intake_acceptance.py
from plane.db.models import Issue, State, IssueAssignee, Project


def create_issue_from_intake_ticket(ticket, *, project, state=None, assignees=None, by):
    proj = Project.objects.get(id=project)
    state_obj = State.objects.get(id=state) if state else State.objects.filter(
        project=proj, default=True
    ).first()
    issue = Issue.objects.create(
        workspace=proj.workspace, project=proj,
        name=ticket.name,
        description_html=ticket.description_html,
        priority=ticket.priority,
        state=state_obj,
        created_by=ticket.submitter or by,
    )
    if assignees:
        IssueAssignee.objects.bulk_create([
            IssueAssignee(issue=issue, assignee_id=a, project=proj, workspace=proj.workspace)
            for a in assignees
        ])
    return issue
```

## Aceptación

- [ ] Issue creado con name/description/priority del ticket.
- [ ] State default del proyecto si no se pasa state.
- [ ] Assignees creados.
