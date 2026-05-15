# Sub-01 — Backend filter

**Task:** 07 · **Tamaño:** M

## Cambio

En el query builder de issues (`apps/api/plane/utils/issue_filters.py` o equivalente):

```python
def apply_property_filters(qs, raw_filters):
    """raw_filters: list of strings 'prop_id:value' or 'prop_id:op:value'"""
    for raw in raw_filters or []:
        try:
            prop_id, value = raw.split(":", 1)
        except ValueError:
            continue
        prop = IssueProperty.objects.filter(id=prop_id).first()
        if not prop: continue
        col_map = {
            "text": "property_values__value_text",
            "number": "property_values__value_number",
            "date": "property_values__value_datetime",
            "boolean": "property_values__value_boolean",
            "select": "property_values__value_option_id",
            "user": "property_values__value_user_id",
        }
        col = col_map.get(prop.type)
        if col:
            qs = qs.filter(property_values__property_id=prop_id, **{col: value})
    return qs
```

## Aceptación

- [ ] Filter por `severity=critical-option-id` retorna solo issues con esa opción.
- [ ] Filter multiple props combina AND.
