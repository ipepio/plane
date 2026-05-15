# Sub-01 — `IntakeFormField`

**Task:** 01 · **Tamaño:** M

## Cambio

```python
# apps/api/plane/db/models/intake_form.py
class IntakeFormField(BaseModel):
    TYPE_CHOICES = (
        ("short_text", "Short text"), ("long_text", "Long text"),
        ("number", "Number"), ("date", "Date"), ("boolean", "Yes/No"),
        ("select", "Select"), ("multi_select", "Multi-select"),
        ("file", "File"), ("user", "User"),
    )

    workspace_intake = models.ForeignKey(
        "db.WorkspaceIntake", null=True, blank=True, on_delete=models.CASCADE,
        related_name="form_fields",
    )
    intake = models.ForeignKey(
        "db.Intake", null=True, blank=True, on_delete=models.CASCADE,
        related_name="form_fields",
    )

    label = models.CharField(max_length=255)
    placeholder = models.CharField(max_length=255, blank=True)
    help_text = models.TextField(blank=True)
    type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    config = models.JSONField(default=dict)
    is_required = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    relative_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "intake_form_fields"
        ordering = ("relative_order", "created_at")
```

## Aceptación

- [ ] Crear field anclado a `WorkspaceIntake` → OK.
- [ ] Crear field anclado a `Intake` (proyecto) → OK.
