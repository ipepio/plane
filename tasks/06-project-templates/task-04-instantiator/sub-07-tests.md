# Sub-07 — Tests integrados

**Task:** 04 · **Tamaño:** M

## Cambio

```python
def test_instantiate_preserves_hierarchy(template_with_epics, workspace, user):
    p = instantiate_template(template_with_epics, workspace, name="C1", identifier="C1", vars={}, by=user)
    epics = Issue.objects.filter(project=p, type__is_epic=True)
    subs = Issue.objects.filter(project=p, parent__in=epics)
    assert epics.count() == 3
    assert subs.count() == 12


def test_n_instantiations_independent(template, workspace, user):
    projects = [
        instantiate_template(template, workspace, name=f"C{i}", identifier=f"C{i}", vars={}, by=user)
        for i in range(3)
    ]
    assert len({p.id for p in projects}) == 3
    counts = {p.id: Issue.objects.filter(project=p).count() for p in projects}
    assert len(set(counts.values())) == 1  # same count


def test_placeholders_applied(template_with_placeholders, workspace, user):
    p = instantiate_template(template_with_placeholders, workspace,
                              name="Onboarding {{client_name}}", identifier="ACME",
                              vars={"client_name": "ACME"}, by=user)
    assert p.name == "Onboarding ACME"
    assert Issue.objects.filter(project=p, name__icontains="ACME").exists()
```

## Aceptación

- [ ] 3 tests pasan.
