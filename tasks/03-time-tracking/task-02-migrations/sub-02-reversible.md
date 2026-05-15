# Sub-02 — Test reversible

**Task:** 02 · **Tamaño:** XS

## Cambio

Verificar que la migración revierte sin error.

```bash
python manage.py migrate db <prev>
python manage.py migrate db
```

## Aceptación

- [ ] Sin errores en ambas direcciones.
