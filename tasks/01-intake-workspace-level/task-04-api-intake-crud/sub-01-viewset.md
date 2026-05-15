# Sub-01 — ViewSet con annotate

**Task:** 04 · **Tamaño:** S

## Cambio

```python
from django.db.models import Count, Q

class WorkspaceIntakeViewSet(ModelViewSet):
    serializer_class = WorkspaceIntakeSerializer

    def get_queryset(self):
        return (
            WorkspaceIntake.objects.filter(
                workspace__slug=self.kwargs["slug"], deleted_at__isnull=True
            )
            .annotate(pending_count=Count(
                "tickets",
                filter=Q(tickets__status="pending", tickets__deleted_at__isnull=True),
            ))
            .order_by("-is_default", "-created_at")
        )

    def perform_create(self, serializer):
        ws = Workspace.objects.get(slug=self.kwargs["slug"])
        serializer.save(workspace=ws)
```

## Aceptación

- [ ] Lista con `pending_count`.
- [ ] Defaults aparecen primero.
