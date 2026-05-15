# Sub-02 — Crear proyecto + estados + labels

**Task:** 04 · **Tamaño:** M

## Cambio

```python
def _create_project(payload, workspace, *, name, identifier, vars, by):
    p_node = payload["project"]
    return Project.objects.create(
        workspace=workspace,
        name=apply_vars(name, vars),
        identifier=identifier,
        description_html=apply_vars(p_node.get("description_html", ""), vars),
        emoji=p_node.get("emoji"),
        icon_prop=p_node.get("icon_prop") or {},
        cover_image=p_node.get("cover_image"),
        module_view=p_node.get("module_view", True),
        cycle_view=p_node.get("cycle_view", True),
        issue_views_view=p_node.get("issue_views_view", True),
        page_view=p_node.get("page_view", True),
        inbox_view=p_node.get("inbox_view", False),
        created_by=by,
    )


def _create_states(payload, project, keymap):
    from plane.db.models import State
    for s in payload["states"]:
        obj = State.objects.create(
            project=project, workspace=project.workspace,
            name=s["name"], color=s["color"], group=s["group"],
            default=s["default"], sequence=s["sequence"], description=s.get("description", ""),
        )
        keymap[s["key"]] = obj.id


def _create_labels(payload, project, keymap):
    from plane.db.models import Label
    # Pasada 1: sin parent
    for l in payload["labels"]:
        obj = Label.objects.create(
            project=project, workspace=project.workspace,
            name=l["name"], color=l["color"], sort_order=l["sort_order"],
        )
        keymap[l["key"]] = obj.id
    # Pasada 2: resolver parent
    for l in payload["labels"]:
        if l.get("parent_key"):
            Label.objects.filter(pk=keymap[l["key"]]).update(parent_id=keymap[l["parent_key"]])
```

## Aceptación

- [ ] Estados y labels creados con todos los atributos.
- [ ] Labels con parent referencian correctamente.
