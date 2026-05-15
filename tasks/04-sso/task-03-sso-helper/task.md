# Task 03 — Helper SSO domain check + auto-provision

**Épica:** 04 · **Tamaño:** M

## Contexto

Lógica central reutilizable: dado un email recién autenticado por Google, decidir qué workspaces lo aceptan y auto-provisionar membership.

## Diseño

- `apps/api/plane/authentication/utils/sso.py` con:
  - `find_eligible_workspaces(email) -> list[Workspace]`: workspaces con `sso_config.enabled` y dominio matching.
  - `auto_provision_membership(user, workspace, role) -> WorkspaceMember`: idempotente (no duplica si ya existe).
  - `enforce_sso_or_fail(workspace, email)`: helper para login flow, lanza `SSORestrictedError` si workspace tiene SSO enabled y el dominio no está permitido.

## Archivos

- `apps/api/plane/authentication/utils/__init__.py`
- `apps/api/plane/authentication/utils/sso.py` (nuevo)
- `apps/api/plane/authentication/adapter/exception.py` (extender)

## Aceptación

- [ ] `find_eligible_workspaces("a@goguest.com")` devuelve workspaces con `goguest.com` permitido.
- [ ] `auto_provision_membership` idempotente.
- [ ] Excepción `SSORestrictedError` distinguible.

## Sub-tareas

1. [sub-01 — find_eligible_workspaces](./sub-01-find.md)
2. [sub-02 — auto_provision_membership](./sub-02-provision.md)
3. [sub-03 — enforce_sso_or_fail + excepción](./sub-03-enforce.md)
4. [sub-04 — Tests](./sub-04-tests.md)
