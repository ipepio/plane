# Sub-01 — `GET` values

**Task:** 06 · **Tamaño:** S

## Cambio

```python
class IssuePropertyValueView(APIView):
    def get(self, request, slug, project_id, issue_id):
        values = (
            IssuePropertyValue.objects
            .filter(issue_id=issue_id)
            .select_related("property", "value_option", "value_user")
            .prefetch_related("multi_options__option")
        )
        return Response(IssuePropertyValueSerializer(values, many=True).data)
```

## Aceptación

- [ ] Devuelve array con `id, property, value` decoded.
- [ ] Issue sin values → `[]`.
