# Sub-02 — Función `seed_permissions()`

**Task:** 02 · **Tamaño:** XS

## Cambio

Función idempotente que aplica el catálogo a la BD.

## Cómo

En `apps/api/plane/seeds/permissions.py`:

```python
def seed_permissions(apps=None):
    """Idempotent seed of the canonical permission catalog.

    Pass `apps` from a data migration to use historical model state.
    """
    Permission = apps.get_model("db", "Permission") if apps else _import_permission()
    for entry in PERMISSIONS:
        Permission.objects.update_or_create(
            code=entry["code"],
            defaults={
                "name": entry["name"],
                "description": entry.get("description", ""),
                "category": entry["category"],
            },
        )

def _import_permission():
    from plane.db.models import Permission
    return Permission
```

## Aceptación

- [ ] Llamada con `seed_permissions(apps)` desde una migración funciona.
- [ ] Llamada sin `apps` (desde shell o tests) también.
- [ ] Segunda invocación no crea filas nuevas; tercera con `name` distinto en código → actualiza.
