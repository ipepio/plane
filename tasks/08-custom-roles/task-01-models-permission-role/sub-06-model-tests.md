# Sub-06 — Tests de los 3 modelos

**Task:** 01 · **Tamaño:** S

## Cambio

Tests unitarios cubriendo creación, constraints y la protección `is_system`.

## Cómo

`apps/api/plane/tests/db/test_role_models.py`:

```python
import pytest
from django.db import IntegrityError
from django.db.models import ProtectedError
from plane.db.models import Permission, Role, RolePermission, Workspace

@pytest.mark.django_db
class TestRoleModels:
    def test_permission_unique_code(self):
        Permission.objects.create(code="issue.create", name="Create issue", category="issue")
        with pytest.raises(IntegrityError):
            Permission.objects.create(code="issue.create", name="dup", category="issue")

    def test_role_unique_name_per_workspace(self, workspace):
        Role.objects.create(workspace=workspace, name="Triador")
        with pytest.raises(IntegrityError):
            Role.objects.create(workspace=workspace, name="Triador")

    def test_system_role_cannot_be_deleted(self, workspace):
        role = Role.objects.create(workspace=workspace, name="Admin", is_system=True)
        with pytest.raises(ProtectedError):
            role.delete()

    def test_rolepermission_unique(self, role, permission):
        RolePermission.objects.create(role=role, permission=permission)
        with pytest.raises(IntegrityError):
            RolePermission.objects.create(role=role, permission=permission)
```

## Aceptación

- [ ] `pytest apps/api/plane/tests/db/test_role_models.py -v` → 4/4 pasan.
- [ ] Cobertura del archivo `role.py` ≥ 90%.
