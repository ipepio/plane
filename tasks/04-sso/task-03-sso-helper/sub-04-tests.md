# Sub-04 — Tests

**Task:** 03 · **Tamaño:** S

## Cambio

```python
def test_find_eligible_workspaces_matches_domain(workspace_with_sso):
    ws = workspace_with_sso(allowed=["goguest.com"])
    assert find_eligible_workspaces("a@goguest.com") == [ws]
    assert find_eligible_workspaces("a@gmail.com") == []


def test_auto_provision_idempotent(user, workspace_with_sso):
    ws = workspace_with_sso(allowed=["goguest.com"], role=15)
    m1 = auto_provision_membership(user, ws)
    m2 = auto_provision_membership(user, ws)
    assert m1.id == m2.id


def test_enforce_raises_for_blocked_domain(workspace_with_sso):
    ws = workspace_with_sso(allowed=["goguest.com"])
    with pytest.raises(SSORestrictedError):
        enforce_sso_or_fail(ws, "x@gmail.com")
```

## Aceptación

- [ ] 3 tests pasan.
