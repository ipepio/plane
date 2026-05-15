# Sub-01 — Endpoint accept

**Task:** 06 · **Tamaño:** S

## Cambio

```python
@action(detail=True, methods=["post"], url_path="accept",
        required_permission="intake.triage")
def accept(self, request, slug, intake_id, pk):
    ser = AcceptIntakeIssueSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    ticket = self.get_object()
    issue = create_issue_from_intake_ticket(ticket, **ser.validated_data, by=request.user)
    ticket.transition_to("accepted", by=request.user, accepted_issue=issue)
    return Response(WorkspaceIntakeIssueSerializer(ticket).data)
```

> `create_issue_from_intake_ticket` se define en task-07.

## Aceptación

- [ ] POST accept con `project` valido → 200, ticket accepted, issue creado.
- [ ] Sin project en payload → 400.
