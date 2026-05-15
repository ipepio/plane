# Sub-01 — Crear `Permission` model

**Task:** 01 · **Tamaño:** XS

## Cambio

Definir la clase `Permission` en `apps/api/plane/db/models/role.py`.

## Cómo

```python
from django.db import models
from .base import BaseModel

class Permission(BaseModel):
    code = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=32)

    class Meta:
        db_table = "permissions"
        ordering = ("category", "code")

    def __str__(self):
        return self.code
```

## Aceptación

- [ ] Modelo importable desde `plane.db.models`.
- [ ] `Permission(code="issue.create").save()` funciona; segundo con mismo code → `IntegrityError`.
