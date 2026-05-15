# Sub-01 — Esqueleto + keymap

**Task:** 04 · **Tamaño:** S

## Cambio

```python
# apps/api/plane/utils/project_template/instantiator.py
from django.db import transaction
from plane.db.models import Project
from .placeholders import apply_vars


@transaction.atomic
def instantiate_template(template, workspace, *, name, identifier, vars: dict, by):
    payload = template.payload
    keymap = {}  # internal_key → real id (UUID)

    project = _create_project(payload, workspace, name=name, identifier=identifier, vars=vars, by=by)
    _create_states(payload, project, keymap)
    _create_labels(payload, project, keymap)
    _create_issue_types(payload, project, workspace, keymap)
    _create_modules(payload, project, keymap)
    _create_cycles(payload, project, keymap)
    _create_issues(payload, project, keymap, vars=vars, by=by)
    return project
```

## Aceptación

- [ ] `transaction.atomic` envuelve todo.
- [ ] Devuelve el `project` creado.
