# Sub-03 — `TeamDetailSerializer` + validación nombre

**Task:** 03 · **Tamaño:** XS

## Cambio

```python
class TeamDetailSerializer(TeamSerializer):
    members = TeamMemberSerializer(source="team_members", many=True, read_only=True)

    class Meta(TeamSerializer.Meta):
        fields = TeamSerializer.Meta.fields + ["members"]

    def validate_name(self, value):
        workspace = self.context["workspace"]
        qs = Team.objects.filter(workspace=workspace, deleted_at__isnull=True)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.filter(name__iexact=value.strip()).exists():
            raise serializers.ValidationError("A team with this name already exists.")
        return value.strip()
```

> El `context["workspace"]` lo inyecta el view (`get_serializer_context`).

## Aceptación

- [ ] Nombre duplicado (case-insensitive) → 400.
- [ ] Update sin cambiar nombre no falla la validación.
