# Sub-05 — Validación `clean()` por tipo

**Task:** 01 · **Tamaño:** S

## Cambio

En `IssuePropertyValue.clean()`, asegurar que solo la columna correspondiente está llena.

```python
def clean(self):
    type_col = {
        "text": "value_text", "long_text": "value_text", "url": "value_text",
        "number": "value_number",
        "date": "value_datetime",
        "boolean": "value_boolean",
        "select": "value_option",
        "user": "value_user",
        "multi_select": None,  # usa tabla auxiliar
    }
    expected = type_col[self.property.type]
    for col in ("value_text", "value_number", "value_datetime", "value_boolean", "value_option", "value_user"):
        if col != expected and getattr(self, col) is not None:
            raise ValidationError({col: f"unexpected for type {self.property.type}"})
```

> No es definitiva la validación — `task-06 sub-03` añade validación en serializer (preferido). Esta es defensa en profundidad.

## Aceptación

- [ ] `value_number=5` en property tipo `text` → ValidationError.
