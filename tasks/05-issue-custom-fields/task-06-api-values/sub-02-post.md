# Sub-02 — `POST` bulk upsert

**Task:** 06 · **Tamaño:** M

## Cambio

```python
def post(self, request, slug, project_id, issue_id):
    payload = request.data.get("values", [])  # [{property, value}, ...]
    ser = IssuePropertyValueWriteSerializer(data=payload, many=True)
    ser.is_valid(raise_exception=True)

    with transaction.atomic():
        for item in ser.validated_data:
            prop = item["property"]
            value = item["value"]
            obj, _ = IssuePropertyValue.objects.get_or_create(issue_id=issue_id, property=prop)
            self._write_value(obj, prop, value)
    return Response(status=200)


def _write_value(self, obj, prop, value):
    # reset typed columns
    obj.value_text = obj.value_number = obj.value_datetime = obj.value_boolean = None
    obj.value_option_id = obj.value_user_id = None
    if prop.type in ("text", "long_text", "url"): obj.value_text = value
    elif prop.type == "number": obj.value_number = value
    elif prop.type == "date": obj.value_datetime = value
    elif prop.type == "boolean": obj.value_boolean = value
    elif prop.type == "select": obj.value_option_id = value
    elif prop.type == "user": obj.value_user_id = value
    obj.save()
    if prop.type == "multi_select":
        IssuePropertyValueOption.objects.filter(value=obj).delete()
        IssuePropertyValueOption.objects.bulk_create([
            IssuePropertyValueOption(value=obj, option_id=oid) for oid in value
        ])
```

## Aceptación

- [ ] POST con 3 values nuevos → guarda y devuelve 200.
- [ ] POST cambiando un value existente → actualiza in-place sin duplicar fila.
- [ ] POST con value=None → limpia columnas.
