# Sub-04 — No-op si no hay SSO configurado

**Task:** 04 · **Tamaño:** XS

## Cambio

Verificar que cuando no existe ningún `WorkspaceSSOConfig.enabled=True` el comportamiento de Google OAuth queda **idéntico** al actual:
- Sin auto-provision.
- Sin redirect de error.
- Sin overhead notorio (una query a `WorkspaceSSOConfig` filtrado por `enabled=True`, índice cubierto).

## Aceptación

- [ ] Test snapshot: el flujo sin SSO produce mismo redirect/state que en `main`.
