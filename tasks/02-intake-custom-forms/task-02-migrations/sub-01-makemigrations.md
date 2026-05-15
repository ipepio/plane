# Sub-01 — makemigrations + apply

**Task:** 02 · **Tamaño:** XS

```bash
python manage.py makemigrations db --name add_intake_form
python manage.py migrate db
```

## Aceptación

- [ ] 4 tablas creadas: `intake_form_fields`, `intake_form_field_options`, `intake_form_field_values`, `intake_form_field_value_options`.
- [ ] CheckConstraint owner_xor presente.
