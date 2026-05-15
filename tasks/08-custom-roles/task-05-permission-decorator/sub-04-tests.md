# Sub-04 — Tests del módulo de permisos

**Task:** 05 · **Tamaño:** M

## Cambio

Cubrir todos los caminos de `has_permission`, la DRF class y el decorador.

## Cómo

`apps/api/plane/tests/permissions/test_role_permission.py`:

```python
import pytest
from rest_framework.test import APIRequestFactory
from plane.app.permissions.role_permission import has_permission, HasWorkspacePermission

@pytest.mark.django_db
class TestHasPermission:
    def test_admin_grants_all(self, request_factory, admin_member):
        req = request_factory.get("/")
        req.user = admin_member.member
        assert has_permission(req, admin_member.workspace, "project.delete") is True

    def test_guest_denied(self, request_factory, guest_member):
        req = request_factory.get("/")
        req.user = guest_member.member
        assert has_permission(req, guest_member.workspace, "project.delete") is False

    def test_outsider_denied(self, request_factory, workspace, user):
        req = request_factory.get("/")
        req.user = user
        assert has_permission(req, workspace, "issue.create") is False

    def test_cache_avoids_duplicate_queries(self, django_assert_num_queries, request_factory, member):
        req = request_factory.get("/")
        req.user = member.member
        with django_assert_num_queries(2):  # 1 member + 1 perm
            has_permission(req, member.workspace, "issue.create")
        with django_assert_num_queries(0):
            has_permission(req, member.workspace, "issue.create")

@pytest.mark.django_db
class TestDRFPermission:
    def test_drf_class_403(self, api_client, guest_member):
        # ... montar view dummy con required_permission y comprobar 403
        pass
```

## Aceptación

- [ ] Tests pasan.
- [ ] Cubrir las 4 ramas: admin, guest, outsider, cache.
- [ ] Cobertura del módulo ≥ 95%.
