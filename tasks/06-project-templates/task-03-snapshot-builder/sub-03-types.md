# Sub-03 — Issue types y propiedades

**Task:** 03 · **Tamaño:** M

## Cambio

```python
def _issue_types(project):
    """Include types + their custom properties (épica 05) if available."""
    try:
        from plane.db.models import IssueType, IssueProperty, IssuePropertyOption
    except ImportError:
        return []

    out = []
    for t in IssueType.objects.filter(project=project).order_by("created_at"):
        props = []
        for p in IssueProperty.objects.filter(issue_type=t).order_by("position"):
            opts = []
            if p.type in ("select", "multi_select"):
                opts = [
                    {"key": f"opt:{o.id}", "name": o.name, "color": o.color, "position": o.position}
                    for o in IssuePropertyOption.objects.filter(property=p).order_by("position")
                ]
            props.append({
                "key": f"prop:{p.id}",
                "name": p.name,
                "slug": p.slug,
                "type": p.type,
                "is_required": p.is_required,
                "config": p.config,
                "options": opts,
            })

        out.append({
            "key": f"type:{t.id}",
            "name": t.name,
            "description": t.description,
            "icon_prop": t.icon_prop,
            "is_epic": t.is_epic,
            "is_default": t.is_default,
            "properties": props,
        })
    return out
```

## Aceptación

- [ ] Si épica 05 no instalada, devuelve `[]` sin romper.
- [ ] Opciones con `position` preservado.
