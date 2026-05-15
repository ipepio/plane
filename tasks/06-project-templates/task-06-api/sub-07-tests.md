# Sub-07 — Tests E2E

**Task:** 06 · **Tamaño:** S

```python
def test_save_as_and_instantiate_roundtrip(admin_client, project_with_epics):
    r1 = admin_client.post("/api/workspaces/W/templates/save-as/",
                           {"project": str(project_with_epics.id), "name": "Onboarding"})
    assert r1.status_code == 201
    tpl_id = r1.data["id"]

    r2 = admin_client.post(f"/api/workspaces/W/templates/{tpl_id}/instantiate/",
                           {"name": "ACME", "identifier": "ACME", "vars": {"client_name": "ACME"}})
    assert r2.status_code == 201
    new_id = r2.data["id"]

    from plane.db.models import Issue, Project
    p = Project.objects.get(id=new_id)
    assert Issue.objects.filter(project=p).count() == Issue.objects.filter(project=project_with_epics).count()


def test_placeholders_endpoint(admin_client, template_with_vars):
    r = admin_client.get(f"/api/workspaces/W/templates/{template_with_vars.id}/placeholders/")
    assert "client_name" in r.json()["placeholders"]
```

## Aceptación

- [ ] 2 tests pasan.
