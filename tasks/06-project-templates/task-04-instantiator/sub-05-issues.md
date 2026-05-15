# Sub-05 — Issues en 2 pasadas

**Task:** 04 · **Tamaño:** L

## Cambio

```python
def _create_issues(payload, project, keymap, *, vars, by):
    from plane.db.models import Issue, IssueLabel, IssueModule, CycleIssue

    # Pasada 1: crear sin parent
    for idx, src in enumerate(payload.get("issues", []), start=1):
        issue = Issue.objects.create(
            project=project, workspace=project.workspace,
            name=apply_vars(src["name"], vars),
            description_html=apply_vars(src.get("description_html", ""), vars),
            priority=src.get("priority") or "none",
            state_id=keymap.get(src.get("state_key")),
            type_id=keymap.get(src.get("type_key")),
            sort_order=src.get("sort_order", 65535.0),
            created_by=by,
        )
        keymap[src["key"]] = issue.id

    # Pasada 2: parent + m2m
    issue_labels = []
    issue_modules = []
    issue_cycles = []
    for src in payload.get("issues", []):
        iid = keymap[src["key"]]
        if src.get("parent_key"):
            Issue.objects.filter(pk=iid).update(parent_id=keymap[src["parent_key"]])
        for lk in src.get("labels", []):
            if lk in keymap:
                issue_labels.append(IssueLabel(issue_id=iid, label_id=keymap[lk], project=project, workspace=project.workspace))
        for mk in src.get("modules", []):
            if mk in keymap:
                issue_modules.append(IssueModule(issue_id=iid, module_id=keymap[mk], project=project, workspace=project.workspace))
        for ck in src.get("cycles", []):
            if ck in keymap:
                issue_cycles.append(CycleIssue(issue_id=iid, cycle_id=keymap[ck], project=project, workspace=project.workspace))

    IssueLabel.objects.bulk_create(issue_labels, ignore_conflicts=True)
    IssueModule.objects.bulk_create(issue_modules, ignore_conflicts=True)
    CycleIssue.objects.bulk_create(issue_cycles, ignore_conflicts=True)
```

## Aceptación

- [ ] Jerarquía parent-child preservada.
- [ ] Labels/modules/cycles asignados a cada issue.
