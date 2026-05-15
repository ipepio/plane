# Sub-02 — Queryset con `member_count`

**Task:** 04 · **Tamaño:** XS

## Cambio

```python
from django.db.models import Count, Q

class TeamViewSet(ModelViewSet):
    def get_queryset(self):
        return (
            Team.objects.filter(
                workspace__slug=self.kwargs["slug"], deleted_at__isnull=True
            )
            .annotate(
                member_count=Count(
                    "team_members",
                    filter=Q(team_members__deleted_at__isnull=True),
                )
            )
            .order_by("-created_at")
        )
```

## Aceptación

- [ ] `GET` retorna `member_count` calculado en SQL.
- [ ] Teams soft-deleted no aparecen.
