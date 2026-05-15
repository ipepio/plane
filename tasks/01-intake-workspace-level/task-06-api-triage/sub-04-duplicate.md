# Sub-04 — Endpoint mark duplicate

**Task:** 06 · **Tamaño:** XS

## Cambio

```python
@action(detail=True, methods=["post"], url_path="duplicate",
        required_permission="intake.triage")
def mark_duplicate(self, request, slug, intake_id, pk):
    ser = DuplicateIntakeIssueSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    target = WorkspaceIntakeIssue.objects.filter(
        id=ser.validated_data["duplicate_of"], intake_id=intake_id,
    ).first()
    if not target:
        return Response({"detail": "target not found"}, status=400)
    ticket = self.get_object()
    ticket.transition_to("duplicate", by=request.user, duplicate_of=target)
    return Response(WorkspaceIntakeIssueSerializer(ticket).data)
```

## Aceptación

- [ ] Target debe existir en el mismo intake.
- [ ] Cross-intake → 400.
