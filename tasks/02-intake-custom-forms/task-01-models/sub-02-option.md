# Sub-02 — `IntakeFormFieldOption`

**Task:** 01 · **Tamaño:** XS

## Cambio

```python
class IntakeFormFieldOption(BaseModel):
    field = models.ForeignKey(IntakeFormField, on_delete=models.CASCADE, related_name="options")
    name = models.CharField(max_length=255)
    relative_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "intake_form_field_options"
        unique_together = ("field", "name")
        ordering = ("relative_order", "created_at")
```

## Aceptación

- [ ] Opciones únicas por field.
