# Sub-01 — Mover `Team` a `team.py`

**Task:** 01 · **Tamaño:** S

## Cambio

Crear `apps/api/plane/db/models/team.py`, copiar la clase `Team` desde `workspace.py`. Sustituir `class Meta` para incluir `db_table = "teams"` (mantener si ya estaba).

## Cómo

```python
# apps/api/plane/db/models/team.py
from django.db import models
from plane.db.models.base import BaseModel


class Team(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    logo_props = models.JSONField(default=dict)
    workspace = models.ForeignKey(
        "db.Workspace", on_delete=models.CASCADE, related_name="teams"
    )

    class Meta:
        db_table = "teams"
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.name} <{self.workspace.name}>"
```

## Aceptación

- [ ] Archivo nuevo creado.
- [ ] No se ha eliminado aún de `workspace.py` (se hace en sub-04).
