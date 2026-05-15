# Task 05 — Tests E2E del flujo de login

**Épica:** 04 · **Tamaño:** M

## Contexto

Mockear el userinfo de Google y validar el flujo end-to-end del callback.

## Diseño

- Fixtures: `workspace_with_sso(allowed, role)`, `mock_google_userinfo(email)`.
- Tres escenarios: dominio permitido, dominio bloqueado, sin SSO.

## Archivos

- `apps/api/plane/tests/sso/test_google_callback.py` (nuevo)

## Aceptación

- [ ] 3 tests E2E pasan.

## Sub-tareas

1. [sub-01 — Fixtures](./sub-01-fixtures.md)
2. [sub-02 — Test allowed](./sub-02-allowed.md)
3. [sub-03 — Test blocked](./sub-03-blocked.md)
4. [sub-04 — Test no-SSO baseline](./sub-04-baseline.md)
