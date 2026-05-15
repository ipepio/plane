# Sub-01 — Generar migración

**Task:** 02 · **Tamaño:** XS

## Cambio

```bash
docker compose -f docker-compose-local.yml exec api \
    python manage.py makemigrations db --name add_team_member
```

## Aceptación

- [ ] Archivo `apps/api/plane/db/migrations/XXXX_add_team_member.py` generado.
- [ ] Contiene `CreateModel("TeamMember", ...)` y `AddConstraint` para `team_unique_name_per_workspace`.
