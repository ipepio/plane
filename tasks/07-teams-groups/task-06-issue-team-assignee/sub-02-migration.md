# Sub-02 — Migración

**Task:** 06 · **Tamaño:** XS

```bash
docker compose -f docker-compose-local.yml exec api \
    python manage.py makemigrations db --name add_issue_team_assignee
```

## Aceptación

- [ ] Migración generada con `CreateModel("IssueTeamAssignee", ...)`.
- [ ] `migrate` aplica limpia.
