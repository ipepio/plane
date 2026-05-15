# Sub-04 — Tests de idempotencia y actualización

**Task:** 02 · **Tamaño:** S

## Cambio

Pytest que cubre los 3 escenarios: primera, repetida, con cambio.

## Cómo

`apps/api/plane/tests/seeds/test_permissions.py`:

```python
import pytest
from plane.db.models import Permission
from plane.seeds.permissions import seed_permissions, PERMISSIONS

@pytest.mark.django_db
class TestSeedPermissions:
    def test_seeds_full_catalog(self):
        seed_permissions()
        assert Permission.objects.count() == len(PERMISSIONS)

    def test_idempotent(self):
        seed_permissions()
        seed_permissions()
        assert Permission.objects.count() == len(PERMISSIONS)

    def test_updates_existing(self, monkeypatch):
        seed_permissions()
        target = Permission.objects.get(code="issue.create")
        # forzar cambio en el catálogo en memoria
        for p in PERMISSIONS:
            if p["code"] == "issue.create":
                p["name"] = "Create work item"
        seed_permissions()
        target.refresh_from_db()
        assert target.name == "Create work item"
```

## Aceptación

- [ ] 3/3 tests pasan.
- [ ] Marca `django_db` activa para usar la transacción de test.
