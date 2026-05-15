# Sub-03 — Issue types + propiedades

**Task:** 04 · **Tamaño:** M

## Cambio

```python
def _create_issue_types(payload, project, workspace, keymap):
    try:
        from plane.db.models import IssueType, IssueProperty, IssuePropertyOption
    except ImportError:
        return

    for t in payload.get("issue_types", []):
        obj = IssueType.objects.create(
            project=project, workspace=workspace,
            name=t["name"], description=t.get("description", ""),
            icon_prop=t.get("icon_prop") or {},
            is_epic=t.get("is_epic", False),
            is_default=t.get("is_default", False),
        )
        keymap[t["key"]] = obj.id

        for p in t.get("properties", []):
            prop = IssueProperty.objects.create(
                project=project, workspace=workspace, issue_type=obj,
                name=p["name"], slug=p["slug"], type=p["type"],
                is_required=p["is_required"], config=p.get("config", {}),
            )
            keymap[p["key"]] = prop.id

            for o in p.get("options", []):
                opt = IssuePropertyOption.objects.create(
                    property=prop, name=o["name"], color=o.get("color", ""),
                    position=o.get("position", 0),
                )
                keymap[o["key"]] = opt.id
```

## Aceptación

- [ ] Types con properties y options se crean en orden.
- [ ] Skip gracioso si épica 05 no instalada.
