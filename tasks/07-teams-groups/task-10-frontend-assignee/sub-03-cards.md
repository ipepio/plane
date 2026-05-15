# Sub-03 — Chips en IssueCard

**Task:** 10 · **Tamaño:** S

## Cambio

En `apps/web/core/components/issues/issue-layouts/.../issue-card.tsx`, dibujar avatares apilados de users + teams. Team avatar usa logo_props con borde distintivo.

```tsx
<AvatarStack>
  {issue.team_assignees.map(t => <TeamAvatar key={t.id} team={t} />)}
  {issue.assignees.map(u => <UserAvatar key={u.id} user={u} />)}
</AvatarStack>
```

## Aceptación

- [ ] Cards muestran team chips.
- [ ] Tooltip indica "Team: Backend" o "User: ...".
