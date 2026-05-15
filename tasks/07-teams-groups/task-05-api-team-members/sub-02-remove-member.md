# Sub-02 — Remove member

**Task:** 05 · **Tamaño:** XS

## Cambio

```python
@action(detail=True, methods=["delete"], url_path=r"members/(?P<member_id>[^/.]+)")
def remove_member(self, request, slug, pk, member_id):
    team = self.get_object()
    deleted = TeamMember.objects.filter(team=team, member_id=member_id).delete()
    if not deleted[0]:
        return Response(status=404)
    return Response(status=204)
```

## Aceptación

- [ ] Member existente → 204.
- [ ] Member no en team → 404.
