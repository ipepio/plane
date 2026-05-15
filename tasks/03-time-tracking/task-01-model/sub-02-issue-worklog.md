# Sub-02 — Definir IssueWorklog

**Task:** 01 · **Tamaño:** S

## Cambio

Añadir clase `IssueWorklog` heredando de `ProjectBaseModel`.

## Cómo

```python
class IssueWorklog(ProjectBaseModel):
    issue = models.ForeignKey(
        "db.Issue", on_delete=models.CASCADE, related_name="worklogs"
    )
    logged_by = models.ForeignKey(
        "db.User", on_delete=models.CASCADE, related_name="worklogs"
    )
    duration = models.PositiveIntegerField(help_text="Duration in seconds")
    started_at = models.DateTimeField()
    description = models.TextField(blank=True, default="")
    is_billable = models.BooleanField(default=True)

    class Meta:
        db_table = "issue_worklogs"
        ordering = ("-started_at",)
        indexes = [
            models.Index(fields=["workspace", "started_at"]),
            models.Index(fields=["issue", "started_at"]),
            models.Index(fields=["logged_by", "started_at"]),
        ]

    def __str__(self):
        return f"{self.logged_by_id} · {self.duration}s · {self.issue_id}"
```

## Aceptación

- [ ] `makemigrations` produce migración válida.
- [ ] Índices presentes.
