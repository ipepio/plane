# Sub-03 — Test blocked

**Task:** 05 · **Tamaño:** S

## Cambio

```python
def test_google_callback_blocked_domain_redirects_with_error(client, workspace_with_sso, mock_google_userinfo):
    ws = workspace_with_sso(["goguest.com"], slug="acme")
    with mock_google_userinfo("intruder@gmail.com"):
        r = client.get(f"/auth/google/callback/?code=fake&state=fake&next=ws={ws.slug}", follow=False)
    assert r.status_code == 302
    assert "error=sso_blocked" in r["Location"]
    assert f"ws={ws.slug}" in r["Location"]

    from plane.db.models import WorkspaceMember, User
    # User puede haberse creado, pero NO miembro del ws con SSO
    if User.objects.filter(email="intruder@gmail.com").exists():
        u = User.objects.get(email="intruder@gmail.com")
        assert not WorkspaceMember.objects.filter(workspace=ws, member=u).exists()
```

## Aceptación

- [ ] Redirect con `error=sso_blocked`.
- [ ] No se crea membership al workspace bloqueado.
