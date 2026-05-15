# Sub-04 — Tests

**Task:** 07 · **Tamaño:** S

## Cambio

`test_workspace_intake_accept.py`:
- Accept feliz → issue creado, ticket accepted.
- Accept con project de otro workspace → 400.
- Accept con assignees inválidos → 400, ticket sigue Pending.
- Reject + intentar accept → 400 (transición inválida).

## Aceptación

- [ ] 4+ tests verdes.
