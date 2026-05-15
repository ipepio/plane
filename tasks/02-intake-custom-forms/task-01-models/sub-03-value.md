# Sub-03 — `IntakeFormFieldValue`

**Task:** 01 · **Tamaño:** M

## Cambio

```python
class IntakeFormFieldValue(BaseModel):
    workspace_ticket = models.ForeignKey(
        "db.WorkspaceIntakeIssue", null=True, blank=True, on_delete=models.CASCADE,
        related_name="form_values",
    )
    project_ticket = models.ForeignKey(
        "db.IntakeIssue", null=True, blank=True, on_delete=models.CASCADE,
        related_name="form_values",
    )
    field = models.ForeignKey(IntakeFormField, on_delete=models.CASCADE, related_name="values")

    value_text = models.TextField(null=True, blank=True)
    value_number = models.DecimalField(max_digits=20, decimal_places=4, null=True, blank=True)
    value_datetime = models.DateTimeField(null=True, blank=True)
    value_boolean = models.BooleanField(null=True)
    value_option = models.ForeignKey(IntakeFormFieldOption, null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    value_file_url = models.URLField(null=True, blank=True)
    value_user = models.ForeignKey("db.User", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")

    class Meta:
        db_table = "intake_form_field_values"
```

## Aceptación

- [ ] Permite atar value a workspace ticket o project ticket.
