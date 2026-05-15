# Sub-02 — Group by property

**Task:** 07 · **Tamaño:** M

## Cambio

Cuando `group_by=property.<id>`, anotar el value adecuado y group en la respuesta:

```python
def apply_property_group_by(qs, prop_id):
    prop = IssueProperty.objects.get(id=prop_id)
    col = {"select": "property_values__value_option_id", ...}[prop.type]
    return qs.filter(property_values__property_id=prop_id).annotate(
        _group_key=F(col)
    )
```

Adaptar a la estructura de paginación group-by existente del endpoint.

## Aceptación

- [ ] `group_by=property.<sev>` agrupa issues por opción de severity.
- [ ] Issues sin value caen en grupo `null`.
