# Task 04 — Hook en Google OAuth callback

**Épica:** 04 · **Tamaño:** M

## Contexto

Tras obtener `userinfo` de Google en el callback, antes de crear/loguear, ejecutar el chequeo SSO + auto-provision para los workspaces elegibles.

## Diseño

- Localizar el callback existente `apps/api/plane/authentication/provider/oauth/google.py` y la vista que lo orquesta.
- Después de `_get_user_data()` (que extrae email + nombre), invocar:
  ```
  eligible = find_eligible_workspaces(email)
  for ws in eligible:
      auto_provision_membership(user, ws)
  ```
- Si el flow viene con `?next=workspace=slug` (login dirigido a un workspace específico), invocar `enforce_sso_or_fail(ws, email)` antes de crear sesión → si falla, redirect a `/?error=sso_blocked&ws=slug`.

## Archivos

- `apps/api/plane/authentication/provider/oauth/google.py` (extender)
- `apps/api/plane/authentication/views/oauth.py` (donde se llama al provider)

## Aceptación

- [ ] Usuario `@goguest.com` loguea con Google y aparece en el workspace con SSO sin invitación previa.
- [ ] Usuario `@gmail.com` intentando entrar a un workspace con SSO redirect con error claro.
- [ ] Sin workspaces elegibles, el flujo normal sigue (sigue funcionando como antes).

## Sub-tareas

1. [sub-01 — Localizar punto de inserción](./sub-01-locate.md)
2. [sub-02 — Llamada a helpers post-userinfo](./sub-02-call.md)
3. [sub-03 — Redirect con error en bloqueo](./sub-03-error-redirect.md)
4. [sub-04 — No-op si no hay SSO configurado](./sub-04-noop.md)
