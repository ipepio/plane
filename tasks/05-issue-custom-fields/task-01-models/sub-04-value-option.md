# Sub-04 — `IssuePropertyValueOption` (multi-select)

**Task:** 01 · **Tamaño:** S

## Cambio

```python
class IssuePropertyValueOption(BaseModel):
    value = models.ForeignKey(IssuePropertyValue, on_delete=models.CASCADE, related_name="multi_options")
    option = models.ForeignKey(IssuePropertyOption, on_delete=models.CASCADE, related_name="+")

    class Meta:
        db_table = "issue_property_value_options"
        unique_together = ("value", "option")
```

## Aceptación

- [ ] Para `multi_select`, varias filas con misma `value` distintas `option`.
- [ ] No duplica.
