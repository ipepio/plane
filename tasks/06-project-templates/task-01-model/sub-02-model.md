# Sub-02 — Modelo + constraints

**Task:** 01 · **Tamaño:** S

## Cambio

```python
class ProjectTemplate(WorkspaceBaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    icon_props = models.JSONField(default=dict, blank=True)
    payload = models.JSONField(default=dict)
    created_by = models.ForeignKey(
        "db.User", on_delete=models.SET_NULL, null=True, related_name="project_templates_created"
    )

    class Meta:
        db_table = "project_templates"
        ordering = ("-created_at",)
        constraints = [
            models.UniqueConstraint(
                Lower("name"), "workspace",
                name="project_template_name_unique_per_workspace",
            ),
        ]
        indexes = [models.Index(fields=["workspace"])]

    def __str__(self):
        return f"{self.workspace_id}:{self.name}"
```

## Aceptación

- [ ] makemigrations limpio.
- [ ] Insert duplicado (case insensitive) falla a nivel DB.
