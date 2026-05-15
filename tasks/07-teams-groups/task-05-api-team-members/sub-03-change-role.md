# Sub-03 — Cambiar rol

**Task:** 05 · **Tamaño:** XS

## Cambio

```python
@action(detail=True, methods=["patch"], url_path=r"members/(?P<member_id>[^/.]+)")
def update_member(self, request, slug, pk, member_id):
    team = self.get_object()
    role = request.data.get("role")
    if role not in dict(TeamMember.ROLE_CHOICES):
        return Response({"detail": "invalid role"}, status=400)
    updated = TeamMember.objects.filter(team=team, member_id=member_id).update(role=role)
    if not updated:
        return Response(status=404)
    return Response({"role": role})
```

## Aceptación

- [ ] PATCH `{role: "lead"}` cambia el rol.
- [ ] Rol inválido → 400.
