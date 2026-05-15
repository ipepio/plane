# Sub-04 — Save + toast

**Task:** 10 · **Tamaño:** XS

## Cambio

Ya incluido en sub-03: tras `update` exitoso → `toast.success("SSO settings saved")`. En error → `toast.error(...)`.

```tsx
try { ... toast.success(...) }
catch (e) { toast.error("Failed to save SSO settings"); }
```

## Aceptación

- [ ] Toast visible en ambos casos.
