# Task 02 — Migraciones de Team / TeamMember

**Épica:** 07 · **Tamaño:** S

## Contexto

`Team` ya tiene tabla `teams` en la BD (existe en código). Necesitamos:
- Confirmar que el `unique_constraint` se añade vía migración.
- Crear tabla `team_members`.

## Aceptación

- [ ] `python manage.py makemigrations db` genera una migración.
- [ ] `python manage.py migrate` corre limpia sobre BD existente.
- [ ] La migración es **idempotente** (correr 2 veces no rompe).

## Sub-tareas

1. [sub-01 — Generar migración](./sub-01-makemigrations.md)
2. [sub-02 — Revisar e ajustar SQL](./sub-02-review.md)
3. [sub-03 — Aplicar y probar rollback](./sub-03-apply-rollback.md)
