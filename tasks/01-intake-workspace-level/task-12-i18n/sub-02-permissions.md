# Sub-02 — Permisos en seed épica 08

**Task:** 12 · **Tamaño:** XS

## Cambio

Añadir al `PERMISSIONS` de épica 08 task-02:

- `intake.submit` — abrir ticket (default: todos).
- `intake.triage` — accept/reject/snooze/duplicate (default: Admin + Member configurable).
- `intake.manage_forms` — épica 02.
- `workspace.manage_intakes` — CRUD de intakes (default: Admin).

Asignar a roles del sistema en `SYSTEM_ROLE_PERMISSIONS`.

## Aceptación

- [ ] Codes presentes en seed.
- [ ] Tests de permisos integrados con épica 08 task-05.
