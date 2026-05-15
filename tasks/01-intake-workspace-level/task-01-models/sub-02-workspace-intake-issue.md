# Sub-02 — `WorkspaceIntakeIssue`

**Task:** 01 · **Tamaño:** M

## Cambio

```python
class WorkspaceIntakeIssue(BaseModel):
    class Status(models.TextChoices):
        PENDING = "pending"
        ACCEPTED = "accepted"
        REJECTED = "rejected"
        SNOOZED = "snoozed"
        DUPLICATE = "duplicate"

    PRIORITY_CHOICES = (
        ("none", "None"), ("low", "Low"), ("medium", "Medium"),
        ("high", "High"), ("urgent", "Urgent"),
    )

    intake = models.ForeignKey(
        WorkspaceIntake, on_delete=models.CASCADE, related_name="tickets"
    )
    submitter = models.ForeignKey(
        "db.User", on_delete=models.SET_NULL, null=True, related_name="submitted_intake_tickets"
    )
    name = models.CharField(max_length=255)
    description_html = models.TextField(blank=True)
    priority = models.CharField(max_length=16, choices=PRIORITY_CHOICES, default="none")
    metadata = models.JSONField(default=dict)  # uso futuro (épica 02)

    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    decision_note = models.TextField(blank=True)
    snoozed_till = models.DateTimeField(null=True, blank=True)
    duplicate_of = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="duplicates"
    )
    accepted_issue = models.ForeignKey(
        "db.Issue", null=True, blank=True, on_delete=models.SET_NULL,
        related_name="source_intake_tickets",
    )
    triaged_by = models.ForeignKey(
        "db.User", null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    triaged_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "workspace_intake_issues"
        ordering = ("-created_at",)
```

## Aceptación

- [ ] Crear con status default Pending.
- [ ] Status update entre todos los valores OK.
