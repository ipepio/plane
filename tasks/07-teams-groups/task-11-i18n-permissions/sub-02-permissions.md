# Sub-02 — Permisos `workspace.manage_teams`

**Task:** 11 · **Tamaño:** S

## Cambio

Cuando épica 08 esté lista:
1. Añadir el code `workspace.manage_teams` al seed (`PERMISSIONS` de épica 08, task-02).
2. Asignarlo a roles del sistema:
   - Admin: ✓
   - Member: ✗
   - Guest: ✗
3. Sustituir en `TeamViewSet` el `required_role = ADMIN` por `required_permission = "workspace.manage_teams"`.
4. Front: el sidebar entry y los botones "New/Edit team" usan `usePermission("workspace.manage_teams")`.

## Aceptación

- [ ] Custom role con `workspace.manage_teams` puede crear/editar teams.
- [ ] Custom role sin él no ve ni el sidebar entry.
