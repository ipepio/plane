# Task 02 — Migraciones

**Épica:** 03 · **Tamaño:** XS

## Contexto

Generar migración para `IssueWorklog`.

## Archivos

- `apps/api/plane/db/migrations/0NNN_issue_worklog.py` (generado)

## Aceptación

- [ ] `python manage.py migrate` aplica limpio.
- [ ] `python manage.py migrate db 0NNN-1 && migrate` reversible.

## Sub-tareas

1. [sub-01 — makemigrations](./sub-01-makemigrations.md)
2. [sub-02 — Test reversible](./sub-02-reversible.md)
