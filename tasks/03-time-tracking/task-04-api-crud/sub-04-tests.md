# Sub-04 — Tests

**Task:** 04 · **Tamaño:** S

## Cambio

```python
def test_create_worklog_sets_logged_by(auth_client, issue):
    r = auth_client.post(url(issue), {"duration": 1800, "started_at": "2025-01-01T09:00:00Z"})
    assert r.status_code == 201
    assert r.data["logged_by"] == auth_client.user_id


def test_member_cannot_edit_others_worklog(member_a, member_b, worklog_of_a):
    r = member_b.patch(url_detail(worklog_of_a), {"duration": 600})
    assert r.status_code == 403


def test_admin_can_delete_others_worklog(admin, worklog_of_member):
    r = admin.delete(url_detail(worklog_of_member))
    assert r.status_code == 204
```

## Aceptación

- [ ] 3 tests pasan.
