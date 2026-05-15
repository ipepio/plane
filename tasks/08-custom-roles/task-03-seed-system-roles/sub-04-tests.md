# Sub-04 — Tests del seed de roles del sistema

**Task:** 03 · **Tamaño:** S

## Cambio

Verificar creación, idempotencia, signal en workspace nuevo, divergencia de permisos.

## Cómo

`apps/api/plane/tests/seeds/test_system_roles.py`:

```python
import pytest
from plane.db.models import Role, Workspace
from plane.seeds.permissions import seed_permissions
from plane.seeds.system_roles import seed_system_roles_for_workspace

@pytest.mark.django_db
class TestSystemRolesSeed:
    @pytest.fixture(autouse=True)
    def _setup(self, db):
        seed_permissions()

    def test_creates_three_system_roles(self, workspace):
        seed_system_roles_for_workspace(workspace)
        assert Role.objects.filter(workspace=workspace, is_system=True).count() == 3

    def test_idempotent(self, workspace):
        seed_system_roles_for_workspace(workspace)
        seed_system_roles_for_workspace(workspace)
        assert Role.objects.filter(workspace=workspace).count() == 3

    def test_signal_on_workspace_create(self, user):
        ws = Workspace.objects.create(name="x", slug="x", owner=user)
        assert Role.objects.filter(workspace=ws, is_system=True).count() == 3

    def test_admin_has_all_permissions(self, workspace):
        seed_system_roles_for_workspace(workspace)
        admin = Role.objects.get(workspace=workspace, name="Admin")
        from plane.db.models import Permission
        assert admin.permissions.count() == Permission.objects.count()
```

## Aceptación

- [ ] 4/4 tests pasan.
- [ ] Tests usan fixtures existentes (`workspace`, `user`) si las hay.
