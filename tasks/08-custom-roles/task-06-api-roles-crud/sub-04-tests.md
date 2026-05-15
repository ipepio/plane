# Sub-04 — Tests por endpoint

**Task:** 06 · **Tamaño:** M

## Cambio

Suite que cubre los 5 endpoints + casos de error.

## Cómo

`apps/api/plane/tests/api/test_roles.py`:

```python
import pytest
from rest_framework import status

@pytest.mark.django_db
class TestRolesAPI:
    def test_list_returns_system_roles(self, admin_client, workspace):
        r = admin_client.get(f"/api/v1/workspaces/{workspace.slug}/roles/")
        assert r.status_code == 200
        names = {x["name"] for x in r.json()}
        assert {"Admin", "Member", "Guest"} <= names

    def test_create_role(self, admin_client, workspace):
        r = admin_client.post(
            f"/api/v1/workspaces/{workspace.slug}/roles/",
            {"name": "Triador", "description": "..."},
            content_type="application/json",
        )
        assert r.status_code == 201
        assert r.json()["is_system"] is False

    def test_create_forbidden_without_permission(self, member_client, workspace):
        r = member_client.post(
            f"/api/v1/workspaces/{workspace.slug}/roles/",
            {"name": "X"},
            content_type="application/json",
        )
        assert r.status_code == 403

    def test_update_system_role_forbidden(self, admin_client, workspace, system_admin_role):
        r = admin_client.patch(
            f"/api/v1/workspaces/{workspace.slug}/roles/{system_admin_role.id}/",
            {"name": "Boss"},
            content_type="application/json",
        )
        assert r.status_code == 403

    def test_destroy_system_role_forbidden(self, admin_client, workspace, system_admin_role):
        r = admin_client.delete(
            f"/api/v1/workspaces/{workspace.slug}/roles/{system_admin_role.id}/"
        )
        assert r.status_code == 403

    def test_destroy_custom_role(self, admin_client, workspace, custom_role):
        r = admin_client.delete(
            f"/api/v1/workspaces/{workspace.slug}/roles/{custom_role.id}/"
        )
        assert r.status_code == 204
```

## Aceptación

- [ ] 6/6 tests pasan.
- [ ] Cobertura de `RoleViewSet` ≥ 90%.
