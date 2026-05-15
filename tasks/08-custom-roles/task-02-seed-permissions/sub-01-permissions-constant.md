# Sub-01 — Definir constante `PERMISSIONS`

**Task:** 02 · **Tamaño:** XS

## Cambio

Crear el archivo con la lista canónica.

## Cómo

`apps/api/plane/seeds/permissions.py`:

```python
PERMISSIONS = [
    # ... (lista completa según task.md)
]
```

Una sola fuente de verdad. Cualquier cambio futuro (añadir, renombrar) se hace aquí + nueva migración.

## Aceptación

- [ ] El archivo existe.
- [ ] `len(PERMISSIONS) >= 25`.
- [ ] Cada entrada tiene exactamente las claves `code`, `name`, `category`; opcionalmente `description`.
