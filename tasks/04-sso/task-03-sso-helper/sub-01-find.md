# Sub-01 — find_eligible_workspaces

**Task:** 03 · **Tamaño:** S

## Cambio

```python
# apps/api/plane/authentication/utils/sso.py
from plane.db.models import Workspace, WorkspaceSSOConfig


def find_eligible_workspaces(email: str) -> list[Workspace]:
    if not email or "@" not in email:
        return []
    domain = email.rsplit("@", 1)[1].lower()
    configs = WorkspaceSSOConfig.objects.filter(
        enabled=True, allowed_domains__contains=[domain]
    ).select_related("workspace")
    return [c.workspace for c in configs]
```

## Aceptación

- [ ] Query usa `__contains` sobre `ArrayField`.
- [ ] Filtra solo `enabled=True`.
