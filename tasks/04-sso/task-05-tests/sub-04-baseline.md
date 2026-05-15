# Sub-04 — Test no-SSO baseline

**Task:** 05 · **Tamaño:** S

## Cambio

```python
def test_google_callback_without_sso_behaves_normally(client, mock_google_userinfo):
    # No WorkspaceSSOConfig en la DB
    with mock_google_userinfo("ada@anywhere.com"):
        r = client.get("/auth/google/callback/?code=fake&state=fake")
    assert r.status_code in (302, 200)
    assert "sso_blocked" not in (r["Location"] if r.status_code == 302 else "")

    from plane.db.models import User
    assert User.objects.filter(email="ada@anywhere.com").exists()
```

## Aceptación

- [ ] Login se completa sin auto-provision ni bloqueo.
