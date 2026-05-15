# Sub-03 — Modelo `TeamMember`

**Task:** 01 · **Tamaño:** S

## Cambio

Añadir `TeamMember` en `team.py`.

## Cómo

```python
class TeamMember(BaseModel):
    ROLE_CHOICES = (("lead", "Lead"), ("member", "Member"))

    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name="team_members"
    )
    member = models.ForeignKey(
        "db.User", on_delete=models.CASCADE, related_name="team_memberships"
    )
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default="member")

    class Meta:
        db_table = "team_members"
        unique_together = ("team", "member")
        ordering = ("created_at",)

    def __str__(self):
        return f"{self.member.email} @ {self.team.name} ({self.role})"
```

## Aceptación

- [ ] Crear `TeamMember(team=t, member=u, role="lead")` OK.
- [ ] Crear duplicado mismo team+member → IntegrityError.
- [ ] `team.team_members.all()` lista miembros.
- [ ] `user.team_memberships.all()` lista teams del user.
