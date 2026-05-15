# Sub-02 — Integración en accept

**Task:** 07 · **Tamaño:** XS

## Cambio

En `create_issue_from_intake_ticket` (épica 01 task-07 sub-01):

```python
form_html = render_form_values_html(ticket)
description_combined = form_html + (ticket.description_html or "")
issue = Issue.objects.create(..., description_html=description_combined, ...)
```

## Aceptación

- [ ] Issue resultante tiene tabla de form responses al inicio del description.
