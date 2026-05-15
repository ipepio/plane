# Sub-04 — Tests

**Task:** 05 · **Tamaño:** S

## Cambio

```python
def test_aggregate_sum_correct(client, worklogs):
    r = client.get(url() + "?group_by=user")
    assert sum(b["total_seconds"] for b in r.json()) == 3600 * 5


def test_filter_by_date_range(client, worklogs):
    r = client.get(url() + "?from=2025-01-01&to=2025-01-02")
    assert len(r.json()) == 1


def test_guest_only_sees_own(guest_client, mixed_worklogs):
    r = guest_client.get(url())
    assert all(w["logged_by"] == guest_client.user_id for w in r.json())
```

## Aceptación

- [ ] 3 tests pasan.
