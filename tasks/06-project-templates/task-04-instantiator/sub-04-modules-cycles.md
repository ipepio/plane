# Sub-04 — Módulos, ciclos

**Task:** 04 · **Tamaño:** S

## Cambio

```python
def _create_modules(payload, project, keymap):
    from plane.db.models import Module
    for m in payload.get("modules", []):
        obj = Module.objects.create(
            project=project, workspace=project.workspace,
            name=m["name"], description=m.get("description", ""),
            status=m.get("status", "backlog"),
            view_props=m.get("view_props") or {},
        )
        keymap[m["key"]] = obj.id


def _create_cycles(payload, project, keymap):
    from plane.db.models import Cycle
    for c in payload.get("cycles", []):
        obj = Cycle.objects.create(
            project=project, workspace=project.workspace,
            name=c["name"], description=c.get("description", ""),
            view_props=c.get("view_props") or {},
        )
        keymap[c["key"]] = obj.id
```

## Aceptación

- [ ] Módulos sin fechas (las fechas son contextuales al cliente).
