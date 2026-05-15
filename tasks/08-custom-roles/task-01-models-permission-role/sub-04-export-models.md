# Sub-04 — Exports en `db/models/__init__.py`

**Task:** 01 · **Tamaño:** XS

## Cambio

Añadir los 3 modelos al barrel export.

## Cómo

En `apps/api/plane/db/models/__init__.py` añadir:

```python
from .role import Permission, Role, RolePermission
```

(Respetar el orden alfabético existente del archivo.)

## Aceptación

- [ ] `from plane.db.models import Role, Permission, RolePermission` funciona desde shell de Django.
