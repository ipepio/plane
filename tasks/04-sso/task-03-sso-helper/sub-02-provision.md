# Sub-02 — auto_provision_membership

**Task:** 03 · **Tamaño:** S

## Cambio

```python
from plane.db.models import WorkspaceMember


def auto_provision_membership(user, workspace) -> WorkspaceMember:
    cfg = getattr(workspace, "sso_config", None)
    role = cfg.auto_provision_role if cfg else 15
    member, _ = WorkspaceMember.objects.update_or_create(
        workspace=workspace, member=user,
        defaults={"role": role, "is_active": True},
    )
    return member
```

## Aceptación

- [ ] Idempotente: 2 llamadas → 1 fila.
- [ ] Reactiva membership si estaba `is_active=False`.
