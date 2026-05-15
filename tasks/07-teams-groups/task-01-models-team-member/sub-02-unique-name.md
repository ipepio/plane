# Sub-02 — Constraint nombre único por workspace

**Task:** 01 · **Tamaño:** XS

## Cambio

En `Team.Meta` añadir `UniqueConstraint` case-insensitive sobre `(workspace, lower(name))`.

## Cómo

```python
from django.db.models.functions import Lower
from django.db.models import UniqueConstraint, Q

class Meta:
    db_table = "teams"
    ordering = ("-created_at",)
    constraints = [
        UniqueConstraint(
            "workspace",
            Lower("name"),
            condition=Q(deleted_at__isnull=True),
            name="team_unique_name_per_workspace",
        ),
    ]
```

## Aceptación

- [ ] `Team.objects.create(workspace=ws, name="Backend")` dos veces → IntegrityError.
- [ ] Mismo nombre, mismo workspace, primer team con `deleted_at` set → permite el segundo.
