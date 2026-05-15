# Sub-04 — Tests del enlace miembro–rol

**Task:** 04 · **Tamaño:** S

## Cambio

Cubrir mapeo correcto, idempotencia y que `role` int no se modifica.

## Cómo

`apps/api/plane/tests/db/test_member_role_link.py`:

```python
import pytest
from plane.db.models import WorkspaceMember, Role

@pytest.mark.django_db
class TestMemberRoleLink:
    def test_admin_int_maps_to_admin_role(self, workspace, user):
        m = WorkspaceMember.objects.create(workspace=workspace, member=user, role=20)
        # tras data-migration el FK se rellena; en test simulamos llamando a la fn
        from plane.db.migrations.helpers import map_member_role_obj  # extraer la lógica si conviene
        map_member_role_obj()
        m.refresh_from_db()
        assert m.role_obj.name == "Admin"

    def test_role_int_unchanged_after_link(self, workspace, user):
        m = WorkspaceMember.objects.create(workspace=workspace, member=user, role=15)
        map_member_role_obj()
        m.refresh_from_db()
        assert m.role == 15

    def test_custom_role_does_not_sync_int_yet(self, workspace, user):
        custom = Role.objects.create(workspace=workspace, name="Triador")
        m = WorkspaceMember.objects.create(workspace=workspace, member=user, role=15, role_obj=custom)
        m.refresh_from_db()
        assert m.role == 15  # divergencia esperada hasta task-12
```

> Nota: extraer la lógica de la data migration a una función reutilizable (p. ej. `apps/api/plane/db/migrations/helpers.py`) para poder testearla.

## Aceptación

- [ ] 3/3 tests pasan.
- [ ] La data migration en sub-03 importa la función helper en lugar de duplicar la lógica.
