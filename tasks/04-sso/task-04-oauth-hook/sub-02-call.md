# Sub-02 — Llamada a helpers post-userinfo

**Task:** 04 · **Tamaño:** S

## Cambio

```python
from plane.authentication.utils.sso import (
    find_eligible_workspaces, auto_provision_membership,
    enforce_sso_or_fail, SSORestrictedError,
)

# después de obtener email + user (created or fetched)
target_ws = _extract_target_workspace(request)  # opcional, viene en next=ws=slug

try:
    if target_ws:
        enforce_sso_or_fail(target_ws, email)
except SSORestrictedError as e:
    return _redirect_with_error(request, code="sso_blocked", workspace=e.workspace.slug)

# Auto-provision en todos los workspaces que aceptan el dominio
for ws in find_eligible_workspaces(email):
    auto_provision_membership(user, ws)
```

## Aceptación

- [ ] Usuario auto-provisionado en `WorkspaceMember`.
- [ ] Login normal si no hay match SSO.
