# Sub-03 — Aplicar y rollback

**Task:** 02 · **Tamaño:** XS

## Cambio

```bash
docker compose -f docker-compose-local.yml exec api python manage.py migrate db
docker compose -f docker-compose-local.yml exec api python manage.py migrate db {prev_migration_name}
docker compose -f docker-compose-local.yml exec api python manage.py migrate db
```

## Aceptación

- [ ] Up funciona.
- [ ] Down vuelve al estado previo sin errores.
- [ ] Up otra vez deja la BD consistente.
