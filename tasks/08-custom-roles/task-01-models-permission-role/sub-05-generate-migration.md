# Sub-05 — Generar y revisar migración

**Task:** 01 · **Tamaño:** XS

## Cambio

Generar migración Django y validarla.

## Cómo

```bash
docker compose -f docker-compose-local.yml exec api python manage.py makemigrations db --name role_permission
```

Revisar el archivo generado en `apps/api/plane/db/migrations/00XX_role_permission.py`:
- 3 `CreateModel`.
- Las constraints unique aparecen.
- Sin `RunPython` (se añaden en task-02 y task-03).

Aplicar:

```bash
docker compose -f docker-compose-local.yml exec api python manage.py migrate db
```

## Aceptación

- [ ] Migración aplica sin errores sobre la BD de dev actual.
- [ ] `\dt permissions roles role_permissions` en psql lista las 3 tablas.
- [ ] `python manage.py makemigrations --check` no detecta cambios pendientes después.
