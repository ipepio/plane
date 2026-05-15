# Sub-01 — `WorkspaceIntakeIssueViewSet`

**Task:** 05 · **Tamaño:** S

## Cambio

```python
class WorkspaceIntakeIssueViewSet(ModelViewSet):
    serializer_class = WorkspaceIntakeIssueSerializer

    def get_queryset(self):
        return WorkspaceIntakeIssue.objects.filter(
            intake_id=self.kwargs["intake_id"],
            intake__workspace__slug=self.kwargs["slug"],
            deleted_at__isnull=True,
        ).select_related("submitter", "triaged_by").order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(submitter=self.request.user)
```

## Aceptación

- [ ] POST crea con submitter=request.user y status=pending.
