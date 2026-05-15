# Sub-03 — Endpoint snooze

**Task:** 06 · **Tamaño:** XS

## Cambio

```python
@action(detail=True, methods=["post"], url_path="snooze",
        required_permission="intake.triage")
def snooze(self, request, slug, intake_id, pk):
    ser = SnoozeIntakeIssueSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    ticket = self.get_object()
    ticket.transition_to("snoozed", by=request.user,
                          snoozed_till=ser.validated_data["snoozed_till"])
    return Response(WorkspaceIntakeIssueSerializer(ticket).data)
```

## Aceptación

- [ ] Snooze con date futura → 200.
- [ ] Job/cron de unsnooze (fuera de scope MVP).
