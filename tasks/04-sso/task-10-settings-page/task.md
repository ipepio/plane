# Task 10 — Pantalla settings SSO

**Épica:** 04 · **Tamaño:** M

## Contexto

Ruta `app/[workspaceSlug]/settings/sso/` con toggle, multi-input de dominios y selector de rol auto-provision.

## Archivos

- `apps/web/app/[workspaceSlug]/settings/sso/page.tsx`
- `apps/web/core/components/settings/sso/sso-form.tsx`
- `apps/web/core/components/settings/sso/domain-list-input.tsx`

## Aceptación

- [ ] Sólo Admin entra.
- [ ] Validación frontend de dominio antes de enviar.
- [ ] Save persiste y toast confirma.

## Sub-tareas

1. [sub-01 — Page + gating](./sub-01-page.md)
2. [sub-02 — Domain list input](./sub-02-domain-input.md)
3. [sub-03 — Formulario completo](./sub-03-form.md)
4. [sub-04 — Save + toast](./sub-04-save.md)
