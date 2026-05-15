# Sub-02 — Revisar migración

**Task:** 02 · **Tamaño:** XS

## Cambio

Revisar manualmente:
- Índices: `team_members(team_id)`, `team_members(member_id)`.
- ForeignKey `on_delete=CASCADE`.
- No tocar la tabla `teams` salvo el constraint.

Si la tabla `teams` ya existía con índices/constraints distintos, fusionar manualmente.

## Aceptación

- [ ] Migración revisada y commit con mensaje `feat(db): add TeamMember and team name unique constraint`.
