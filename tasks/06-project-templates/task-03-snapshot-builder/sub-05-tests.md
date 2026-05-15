# Sub-05 — Tests

**Task:** 03 · **Tamaño:** S

## Cambio

```python
def test_snapshot_preserves_hierarchy(project_with_3_epics):
    snap = build_project_snapshot(project_with_3_epics)
    keys = {i["key"]: i for i in snap["issues"]}
    for issue in snap["issues"]:
        if issue["parent_key"]:
            assert issue["parent_key"] in keys


def test_snapshot_is_json_serializable(project_full):
    import json
    json.dumps(build_project_snapshot(project_full))


def test_snapshot_no_real_uuids_in_top_level(project_full):
    import json, re
    s = json.dumps(build_project_snapshot(project_full))
    real_ids = {str(project_full.id)}
    for uid in real_ids:
        assert uid not in s
```

## Aceptación

- [ ] 3 tests pasan.
