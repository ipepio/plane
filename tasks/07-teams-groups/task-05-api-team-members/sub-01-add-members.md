# Sub-01 — Bulk add members

**Task:** 05 · **Tamaño:** S

## Cambio

```python
from rest_framework.decorators import action
from plane.db.models import TeamMember, WorkspaceMember

class TeamViewSet(ModelViewSet):
    @action(detail=True, methods=["post"], url_path="members")
    def add_members(self, request, slug, pk):
        team = self.get_object()
        payload = request.data.get("members", [])
        member_ids = [m["member"] for m in payload]

        ws_members = set(
            WorkspaceMember.objects.filter(
                workspace=team.workspace, member_id__in=member_ids,
                deleted_at__isnull=True,
            ).values_list("member_id", flat=True)
        )
        invalid = [str(mid) for mid in member_ids if str(mid) not in map(str, ws_members)]
        if invalid:
            return Response({"detail": "Not workspace members", "members": invalid}, status=400)

        existing = set(map(str, TeamMember.objects.filter(team=team).values_list("member_id", flat=True)))
        to_create = [
            TeamMember(team=team, member_id=m["member"], role=m.get("role", "member"))
            for m in payload if str(m["member"]) not in existing
        ]
        TeamMember.objects.bulk_create(to_create)
        return Response({"created": len(to_create)}, status=201)
```

## Aceptación

- [ ] Crear 3 miembros nuevos → 201, `created: 3`.
- [ ] Reintentar mismos → 201, `created: 0`, idempotente.
