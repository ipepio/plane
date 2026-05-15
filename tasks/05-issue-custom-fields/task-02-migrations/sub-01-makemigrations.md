# Sub-01 — makemigrations

**Task:** 02 · **Tamaño:** XS

```bash
docker compose -f docker-compose-local.yml exec api \
    python manage.py makemigrations db --name add_issue_property
```

## Aceptación

- [ ] 4 tablas en la migración (`IssueProperty`, `IssuePropertyOption`, `IssuePropertyValue`, `IssuePropertyValueOption`).
