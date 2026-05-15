# Sub-02 — Permisos

**Task:** 12 · **Tamaño:** XS

## Cambio

Catálogo (épica 08 task-02):

- `sso.manage` — leer y modificar config SSO del workspace. Admin ✓, Member ✗, Guest ✗.

No exponer al rol Member; SSO afecta seguridad e identidad.

## Aceptación

- [ ] Custom role sin `sso.manage` no ve la pantalla settings/sso.
