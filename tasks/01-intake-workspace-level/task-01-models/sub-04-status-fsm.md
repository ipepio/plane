# Sub-04 — Transiciones de status (FSM ligera)

**Task:** 01 · **Tamaño:** S

## Cambio

Validar transiciones permitidas en `WorkspaceIntakeIssue.transition_to(new_status)`:

```python
ALLOWED = {
    "pending": {"accepted", "rejected", "snoozed", "duplicate"},
    "snoozed": {"pending", "accepted", "rejected", "duplicate"},
    "rejected": set(),  # terminal
    "accepted": set(),  # terminal
    "duplicate": set(), # terminal
}

def transition_to(self, new_status, *, by, note="", duplicate_of=None, accepted_issue=None, snoozed_till=None):
    if new_status not in ALLOWED.get(self.status, set()):
        raise ValueError(f"cannot go from {self.status} to {new_status}")
    self.status = new_status
    self.triaged_by = by
    self.triaged_at = timezone.now()
    self.decision_note = note
    self.duplicate_of = duplicate_of
    self.accepted_issue = accepted_issue
    self.snoozed_till = snoozed_till
    self.save()
```

> Las views llaman a este helper para garantizar consistencia.

## Aceptación

- [ ] `pending → accepted → rejected` lanza ValueError.
- [ ] `pending → snoozed → accepted` permitido.
