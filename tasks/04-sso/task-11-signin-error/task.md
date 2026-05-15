# Task 11 — Mensaje sign-in dominio bloqueado

**Épica:** 04 · **Tamaño:** S

## Contexto

Cuando el callback de Google redirige con `?error=sso_blocked&ws=slug`, el sign-in page debe mostrar mensaje claro.

## Archivos

- `apps/web/core/components/account/sign-in/sign-in-error-banner.tsx` (nuevo)
- Integrar en página de sign-in existente.

## Aceptación

- [ ] Banner visible cuando query string contiene `error=sso_blocked`.
- [ ] Mensaje menciona el workspace cuando `ws` está presente.

## Sub-tareas

1. [sub-01 — Banner component](./sub-01-banner.md)
2. [sub-02 — Integración en sign-in page](./sub-02-integrate.md)
