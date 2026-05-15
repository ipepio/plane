# Sub-02 — Tests

**Task:** 06 · **Tamaño:** XS

## Cambio

```python
def test_csv_export_has_header_and_rows(client, worklogs):
    r = client.get(export_url())
    assert r["Content-Type"].startswith("text/csv")
    lines = r.content.decode().splitlines()
    assert lines[0] == "date,user,project,issue,duration_minutes,billable,description"
    assert len(lines) == 1 + len(worklogs)
```

## Aceptación

- [ ] Header + rows correctos.
