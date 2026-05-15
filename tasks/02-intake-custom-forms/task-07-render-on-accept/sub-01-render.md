# Sub-01 — `render_form_values_html`

**Task:** 07 · **Tamaño:** S

## Cambio

```python
def render_form_values_html(ticket) -> str:
    rows = []
    values = (
        IntakeFormFieldValue.objects
        .filter(workspace_ticket=ticket)
        .select_related("field", "value_option", "value_user")
        .prefetch_related("multi_options__option")
        .order_by("field__relative_order")
    )
    for v in values:
        rendered = _render_value(v)
        rows.append(f"<tr><th>{escape(v.field.label)}</th><td>{rendered}</td></tr>")
    if not rows:
        return ""
    return f"<h3>Form responses</h3><table>{''.join(rows)}</table><hr/>"
```

`_render_value` switchea por tipo (string, number formatted, link para file, user display name…).

## Aceptación

- [ ] Genera HTML estructurado con cada field.
- [ ] Multi-select → comma-separated.
