# Sub-03 — Tests

**Task:** 07 · **Tamaño:** XS

## Cambio

```python
def test_get_returns_defaults_without_config(admin_client, workspace):
    r = admin_client.get(f"/api/workspaces/{workspace.slug}/sso/")
    assert r.status_code == 200
    assert r.data["enabled"] is False


def test_member_cannot_patch(member_client, workspace):
    r = member_client.patch(f"/api/workspaces/{workspace.slug}/sso/", {"enabled": True})
    assert r.status_code == 403


def test_admin_patch_creates_config(admin_client, workspace):
    r = admin_client.patch(
        f"/api/workspaces/{workspace.slug}/sso/",
        {"enabled": True, "allowed_domains": ["goguest.com"]}, format="json",
    )
    assert r.status_code == 200
    assert "goguest.com" in r.data["allowed_domains"]
```

## Aceptación

- [ ] 3 tests pasan.
