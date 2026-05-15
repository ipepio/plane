# Sub-06 — Permiso de acceso

**Task:** 11 · **Tamaño:** XS

## Cambio

En el page, gate por permiso `worklog.view_workspace_report` (épica 08). Guest sin permiso → 403.

```tsx
const can = useUserPermissions().hasPermission("worklog.view_workspace_report");
if (!can) return <ForbiddenView />;
```

## Aceptación

- [ ] Guest no entra a la pantalla.
