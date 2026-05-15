# Sub-02 — Estados, labels, módulos, ciclos

**Task:** 03 · **Tamaño:** M

## Cambio

```python
def _states(project):
    return [
        {
            "key": f"state:{s.id}",  # ref interno usado por issues
            "name": s.name,
            "color": s.color,
            "group": s.group,
            "default": s.default,
            "sequence": s.sequence,
            "description": s.description,
        }
        for s in project.state_set.all().order_by("sequence")
    ]


def _labels(project):
    rows = list(project.label_set.all().order_by("sort_order"))
    by_id = {l.id: f"label:{l.id}" for l in rows}
    return [
        {
            "key": by_id[l.id],
            "name": l.name,
            "color": l.color,
            "parent_key": by_id.get(l.parent_id),
            "sort_order": l.sort_order,
        }
        for l in rows
    ]


def _modules(project):
    return [
        {
            "key": f"module:{m.id}",
            "name": m.name,
            "description": m.description,
            "status": m.status,
            "view_props": m.view_props,
        }
        for m in project.module_set.all().order_by("created_at")
    ]


def _cycles(project):
    return [
        {
            "key": f"cycle:{c.id}",
            "name": c.name,
            "description": c.description,
            "view_props": c.view_props,
        }
        for c in project.cycle_set.all().order_by("created_at")
    ]
```

## Aceptación

- [ ] Labels con parent preservan `parent_key` interno.
- [ ] Estados ordenados por `sequence`.
