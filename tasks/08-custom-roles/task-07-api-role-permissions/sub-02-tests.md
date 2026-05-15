# Sub-02 — Tests: replace, invalid, system

**Task:** 07 · **Tamaño:** S

## Cambio

Extender la suite para cubrir el endpoint `/permissions/`.

## Cómo

En `apps/api/plane/tests/api/test_roles.py`:

```python
@pytest.mark.django_db
class TestRolePermissionsAPI:
    URL = "/api/v1/workspaces/{slug}/roles/{id}/permissions/"

    def test_replace_set(self, admin_client, workspace, custom_role):
        r = admin_client.put(
            self.URL.format(slug=workspace.slug, id=custom_role.id),
            {"permission_codes": ["issue.create", "issue.comment"]},
            content_type="application/json",
        )
        assert r.status_code == 200
        codes = set(custom_role.permissions.values_list("code", flat=True))
        assert codes == {"issue.create", "issue.comment"}

    def test_invalid_code_returns_400(self, admin_client, workspace, custom_role):
        r = admin_client.put(
            self.URL.format(slug=workspace.slug, id=custom_role.id),
            {"permission_codes": ["issue.create", "nope.invalid"]},
            content_type="application/json",
        )
        assert r.status_code == 400
        assert r.json()["invalid_codes"] == ["nope.invalid"]

    def test_system_role_forbidden(self, admin_client, workspace, system_admin_role):
        r = admin_client.put(
            self.URL.format(slug=workspace.slug, id=system_admin_role.id),
            {"permission_codes": []},
            content_type="application/json",
        )
        assert r.status_code == 403

    def test_get_returns_codes(self, admin_client, workspace, custom_role_with_perms):
        r = admin_client.get(self.URL.format(slug=workspace.slug, id=custom_role_with_perms.id))
        assert r.status_code == 200
        assert "issue.create" in r.json()["permission_codes"]
```

## Aceptación

- [ ] 4/4 tests pasan.
- [ ] No hay duplicados de RolePermission tras varios PUT seguidos (idempotencia visual).
