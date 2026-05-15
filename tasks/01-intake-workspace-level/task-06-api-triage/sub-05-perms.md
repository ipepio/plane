# Sub-05 — Permiso `intake.triage`

**Task:** 06 · **Tamaño:** XS

## Cambio

Añadir el code `intake.triage` al seed de épica 08 (task-02 `PERMISSIONS`). Asignar:
- Admin: ✓
- Member: ✗ (configurable)
- Guest: ✗

Mientras épica 08 no esté lista, los `@action` usan `WorkspaceUserPermission(required_role=ADMIN)`.

## Aceptación

- [ ] Guest llamando accept → 403.
- [ ] Member sin permiso → 403.
- [ ] Admin → 200.
