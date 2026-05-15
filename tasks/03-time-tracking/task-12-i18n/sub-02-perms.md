# Sub-02 — Permisos en épica 08

**Task:** 12 · **Tamaño:** XS

## Cambio

Registrar en el catálogo de permisos (épica 08 task-02):
- `worklog.create_self` — registrar mi tiempo. Admin/Member ✓, Guest ✗ (configurable).
- `worklog.view_others` — ver el de terceros. Admin/Member ✓, Guest ✗.
- `worklog.view_workspace_report` — acceder al reporte. Admin/Member ✓, Guest ✗.
- `worklog.manage_others` — editar/eliminar el de terceros. Admin ✓, Member ✗, Guest ✗.

## Aceptación

- [ ] Custom role con `worklog.view_workspace_report` accede al reporte.
- [ ] Sin `worklog.create_self` el botón "Log time" no aparece.
