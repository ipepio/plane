# Sub-01 — Aceptar `form_values` en submit

**Task:** 06 · **Tamaño:** M

## Cambio

En `WorkspaceIntakeIssueViewSet.create` (épica 01 task-05), parsear `form_values` del payload y crear `IntakeFormFieldValue`s tras crear el ticket.

```python
def perform_create(self, serializer):
    with transaction.atomic():
        ticket = serializer.save(submitter=self.request.user)
        form_values = self.request.data.get("form_values", [])
        if form_values:
            self._write_form_values(ticket, form_values)

def _write_form_values(self, ticket, raw):
    ser = IntakeFormFieldValueWriteSerializer(data=raw, many=True)
    ser.is_valid(raise_exception=True)
    for item in ser.validated_data:
        v = IntakeFormFieldValue(workspace_ticket=ticket, field=item["field"])
        _store_value(v, item["field"], item["value"])
        v.save()
```

## Aceptación

- [ ] POST con 5 form_values → 201, todos persistidos.
- [ ] Si uno falla validación, ninguno se guarda (atomic).
