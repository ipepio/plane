# Sub-01 — `WorkspaceIntake`

**Task:** 01 · **Tamaño:** S

## Cambio

```python
# apps/api/plane/db/models/workspace_intake.py
from django.db import models
from django.db.models.functions import Lower
from plane.db.models.base import BaseModel


class WorkspaceIntake(BaseModel):
    workspace = models.ForeignKey(
        "db.Workspace", on_delete=models.CASCADE, related_name="workspace_intakes"
    )
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    is_default = models.BooleanField(default=False)
    logo_props = models.JSONField(default=dict)

    class Meta:
        db_table = "workspace_intakes"
        ordering = ("-created_at",)
        constraints = [
            models.UniqueConstraint(
                "workspace", Lower("name"),
                condition=models.Q(deleted_at__isnull=True),
                name="workspace_intake_unique_name",
            ),
        ]
```

## Aceptación

- [ ] Crear intake "Sistemas" → OK.
- [ ] Duplicado case-insensitive → IntegrityError.
