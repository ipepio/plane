# Sub-02 — Expandir a notificaciones

**Task:** 07 · **Tamaño:** S

## Cambio

En el handler `post_save` o tarea async de `IssueComment`, recolectar destinatarios y crear `Notification`s.

```python
def notify_comment_recipients(comment):
    parsed = extract_mentions(comment.comment_html)
    user_ids = set(parsed["users"])

    if parsed["teams"]:
        team_member_ids = TeamMember.objects.filter(
            team_id__in=parsed["teams"], deleted_at__isnull=True,
        ).values_list("member_id", flat=True)
        user_ids.update(str(m) for m in team_member_ids)

    user_ids.discard(str(comment.actor_id))  # no notificar al autor

    Notification.objects.bulk_create([
        Notification(
            workspace=comment.workspace, project=comment.project,
            receiver_id=uid, sender_id=comment.actor_id,
            data={"comment_id": str(comment.id), "issue_id": str(comment.issue_id)},
        ) for uid in user_ids
    ])
```

## Aceptación

- [ ] Test: comment con @team B (3 miembros) genera 3 notif (o 2 si autor está dentro).
- [ ] Test: comment con @user y @team que comparten miembro → 1 sola notificación a ese user.
