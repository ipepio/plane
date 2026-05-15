# Sub-04 — Multi-select aux

**Task:** 01 · **Tamaño:** S

## Cambio

```python
class IntakeFormFieldValueOption(BaseModel):
    value = models.ForeignKey(IntakeFormFieldValue, on_delete=models.CASCADE, related_name="multi_options")
    option = models.ForeignKey(IntakeFormFieldOption, on_delete=models.CASCADE, related_name="+")

    class Meta:
        db_table = "intake_form_field_value_options"
        unique_together = ("value", "option")
```

## Aceptación

- [ ] Multi-select replace funciona.
