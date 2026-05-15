# Sub-01 — `IssueProperty`

**Task:** 01 · **Tamaño:** M

## Cambio

```python
# apps/api/plane/db/models/issue_property.py
from django.db import models
from plane.db.models.base import BaseModel


class IssueProperty(BaseModel):
    TYPE_CHOICES = (
        ("text", "Text"),
        ("long_text", "Long text"),
        ("number", "Number"),
        ("date", "Date"),
        ("boolean", "Boolean"),
        ("select", "Select"),
        ("multi_select", "Multi-select"),
        ("user", "User"),
        ("url", "URL"),
    )

    workspace = models.ForeignKey("db.Workspace", on_delete=models.CASCADE, related_name="issue_properties")
    project = models.ForeignKey("db.Project", null=True, blank=True, on_delete=models.CASCADE, related_name="issue_properties")
    issue_type = models.ForeignKey("db.IssueType", on_delete=models.CASCADE, related_name="properties")

    name = models.CharField(max_length=64)  # slug interno
    display_name = models.CharField(max_length=128)
    type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    config = models.JSONField(default=dict)
    is_required = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    relative_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "issue_properties"
        unique_together = ("issue_type", "name")
        ordering = ("relative_order", "created_at")
```

## Aceptación

- [ ] Crear property `severity` tipo `select` en issue type "Bug" → OK.
- [ ] Duplicar nombre en mismo issue type → IntegrityError.
- [ ] Distintos issue types, mismo nombre → OK.
