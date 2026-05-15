# Sub-02 — Test allowed

**Task:** 05 · **Tamaño:** S

## Cambio

```python
def test_google_callback_allowed_domain_auto_provisions(client, workspace_with_sso, mock_google_userinfo):
    ws = workspace_with_sso(["goguest.com"])
    with mock_google_userinfo("ada@goguest.com"):
        r = client.get("/auth/google/callback/?code=fake&state=fake")
    assert r.status_code in (302, 200)

    from plane.db.models import User, WorkspaceMember
    u = User.objects.get(email="ada@goguest.com")
    assert WorkspaceMember.objects.filter(workspace=ws, member=u, is_active=True).exists()
```

## Aceptación

- [ ] Usuario aparece como `WorkspaceMember` activo.
