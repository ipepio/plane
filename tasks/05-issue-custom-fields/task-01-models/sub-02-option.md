# Sub-02 — `IssuePropertyOption`

**Task:** 01 · **Tamaño:** S

## Cambio

```python
class IssuePropertyOption(BaseModel):
    property = models.ForeignKey(IssueProperty, on_delete=models.CASCADE, related_name="options")
    name = models.CharField(max_length=128)
    color = models.CharField(max_length=16, blank=True, default="")
    relative_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "issue_property_options"
        unique_together = ("property", "name")
        ordering = ("relative_order", "created_at")
```

## Aceptación

- [ ] Crear opción `critical` en property `severity` → OK.
- [ ] Duplicar nombre en misma property → IntegrityError.
