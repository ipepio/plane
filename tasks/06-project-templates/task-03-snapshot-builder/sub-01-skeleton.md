# Sub-01 — Esqueleto y versionado

**Task:** 03 · **Tamaño:** S

## Cambio

```python
# apps/api/plane/utils/project_template/snapshot.py
SCHEMA_VERSION = 1


def build_project_snapshot(project) -> dict:
    """Build a JSON-serializable snapshot from a Project."""
    return {
        "schema_version": SCHEMA_VERSION,
        "project": _project_node(project),
        "states": _states(project),
        "labels": _labels(project),
        "modules": _modules(project),
        "cycles": _cycles(project),
        "issue_types": _issue_types(project),
        "issues": _issues(project),
    }


def _project_node(project) -> dict:
    return {
        "name": project.name,
        "description_html": project.description_html or "",
        "identifier": project.identifier,
        "emoji": project.emoji,
        "icon_prop": project.icon_prop,
        "cover_image": project.cover_image,
        "module_view": project.module_view,
        "cycle_view": project.cycle_view,
        "issue_views_view": project.issue_views_view,
        "page_view": project.page_view,
        "inbox_view": project.inbox_view,
    }
```

## Aceptación

- [ ] `build_project_snapshot(project)` retorna dict con todas las claves top-level.
