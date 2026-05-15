# Sub-02 — Endpoint reject

**Task:** 06 · **Tamaño:** XS

## Cambio

```python
@action(detail=True, methods=["post"], url_path="reject",
        required_permission="intake.triage")
def reject(self, request, slug, intake_id, pk):
    ser = RejectIntakeIssueSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    ticket = self.get_object()
    ticket.transition_to("rejected", by=request.user, note=ser.validated_data["decision_note"])
    return Response(WorkspaceIntakeIssueSerializer(ticket).data)
```

## Aceptación

- [ ] Reject sin nota → 400.
- [ ] Reject con nota → 200, status=rejected.
