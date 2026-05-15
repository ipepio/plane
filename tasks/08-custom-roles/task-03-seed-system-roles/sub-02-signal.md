# Sub-02 — Signal `post_save` en Workspace

**Task:** 03 · **Tamaño:** XS

## Cambio

Auto-seedear roles del sistema al crear un workspace.

## Cómo

`apps/api/plane/db/signals.py` (o extender existente):

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from plane.db.models import Workspace
from plane.seeds.system_roles import seed_system_roles_for_workspace

@receiver(post_save, sender=Workspace)
def _seed_system_roles(sender, instance, created, **kwargs):
    if created:
        seed_system_roles_for_workspace(instance)
```

Registrar en `apps/api/plane/db/apps.py` → `ready()`:

```python
def ready(self):
    from plane.db import signals  # noqa
```

## Aceptación

- [ ] `Workspace.objects.create(...)` deja 3 roles inmediatamente.
- [ ] `Workspace.objects.update(name=...)` no dispara nada nuevo.
