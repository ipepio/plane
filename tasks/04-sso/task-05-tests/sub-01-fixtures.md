# Sub-01 — Fixtures

**Task:** 05 · **Tamaño:** S

## Cambio

```python
import pytest
from unittest.mock import patch
from plane.db.models import Workspace, WorkspaceSSOConfig


@pytest.fixture
def workspace_with_sso(db):
    def _make(allowed: list[str], role: int = 15, slug: str = "acme"):
        ws = Workspace.objects.create(name="ACME", slug=slug)
        WorkspaceSSOConfig.objects.create(
            workspace=ws, enabled=True, allowed_domains=allowed, auto_provision_role=role
        )
        return ws
    return _make


@pytest.fixture
def mock_google_userinfo():
    def _setup(email: str, name: str = "Ada"):
        return patch(
            "plane.authentication.provider.oauth.google.Google._get_user_data",
            return_value={"email": email, "name": name, "picture": ""},
        )
    return _setup
```

## Aceptación

- [ ] Fixtures invocables.
