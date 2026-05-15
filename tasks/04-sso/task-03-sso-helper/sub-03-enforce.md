# Sub-03 — enforce_sso_or_fail + excepción

**Task:** 03 · **Tamaño:** S

## Cambio

```python
class SSORestrictedError(Exception):
    """Raised when a user's email domain is not allowed by workspace SSO config."""
    def __init__(self, workspace, email):
        self.workspace = workspace
        self.email = email
        super().__init__(f"Domain not allowed for workspace {workspace.slug}")


def enforce_sso_or_fail(workspace, email: str) -> None:
    cfg = getattr(workspace, "sso_config", None)
    if not cfg or not cfg.enabled:
        return  # no SSO, no restriction
    if not cfg.domain_allowed(email):
        raise SSORestrictedError(workspace, email)
```

## Aceptación

- [ ] No lanza si workspace sin SSO.
- [ ] Lanza si SSO enabled y dominio no permitido.
