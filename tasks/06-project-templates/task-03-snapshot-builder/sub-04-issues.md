# Sub-04 — Issues con jerarquía

**Task:** 03 · **Tamaño:** M

## Cambio

```python
def _issues(project):
    from plane.db.models import IssueLabel, IssueModule, CycleIssue

    issues = list(project.issue_set.all().order_by("sequence_id"))
    by_id = {i.id: f"issue:{i.id}" for i in issues}

    # Pre-fetch refs en bulk
    labels_by_issue = {}
    for il in IssueLabel.objects.filter(issue__in=issues).values("issue_id", "label_id"):
        labels_by_issue.setdefault(il["issue_id"], []).append(f"label:{il['label_id']}")

    modules_by_issue = {}
    for im in IssueModule.objects.filter(issue__in=issues).values("issue_id", "module_id"):
        modules_by_issue.setdefault(im["issue_id"], []).append(f"module:{im['module_id']}")

    cycles_by_issue = {}
    for ci in CycleIssue.objects.filter(issue__in=issues).values("issue_id", "cycle_id"):
        cycles_by_issue.setdefault(ci["issue_id"], []).append(f"cycle:{ci['cycle_id']}")

    return [
        {
            "key": by_id[i.id],
            "name": i.name,
            "description_html": i.description_html or "",
            "priority": i.priority,
            "state_key": f"state:{i.state_id}" if i.state_id else None,
            "parent_key": by_id.get(i.parent_id),
            "type_key": f"type:{i.type_id}" if i.type_id else None,
            "estimate_point": i.estimate_point_id,  # opcional, simplificable
            "start_date_offset_days": _offset(i.start_date, project.created_at),
            "target_date_offset_days": _offset(i.target_date, project.created_at),
            "sort_order": float(i.sort_order),
            "labels": labels_by_issue.get(i.id, []),
            "modules": modules_by_issue.get(i.id, []),
            "cycles": cycles_by_issue.get(i.id, []),
        }
        for i in issues
    ]


def _offset(dt, ref):
    if not dt or not ref:
        return None
    return (dt - ref.date()).days if hasattr(dt, "year") else None
```

## Aceptación

- [ ] `parent_key` preserva jerarquía épica → sub.
- [ ] Refs a labels/modules/cycles por key interno.
- [ ] Sin asignados / sin comentarios / sin attachments.
