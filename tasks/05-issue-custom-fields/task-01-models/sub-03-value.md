# Sub-03 — `IssuePropertyValue`

**Task:** 01 · **Tamaño:** M

## Cambio

```python
class IssuePropertyValue(BaseModel):
    issue = models.ForeignKey("db.Issue", on_delete=models.CASCADE, related_name="property_values")
    property = models.ForeignKey(IssueProperty, on_delete=models.CASCADE, related_name="values")

    # Columnas typed nullables. Solo una activa según el tipo de property.
    value_text = models.TextField(null=True, blank=True)
    value_number = models.DecimalField(max_digits=20, decimal_places=4, null=True, blank=True)
    value_datetime = models.DateTimeField(null=True, blank=True)
    value_boolean = models.BooleanField(null=True)
    value_option = models.ForeignKey(IssuePropertyOption, null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    value_user = models.ForeignKey("db.User", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")

    class Meta:
        db_table = "issue_property_values"
        unique_together = ("issue", "property")
        indexes = [
            models.Index(fields=("property",)),
            models.Index(fields=("value_user",)),
            models.Index(fields=("value_option",)),
        ]
```

## Aceptación

- [ ] Crear value para (issue, property) único.
- [ ] Crear duplicado → IntegrityError.
- [ ] Borrar issue propaga.
