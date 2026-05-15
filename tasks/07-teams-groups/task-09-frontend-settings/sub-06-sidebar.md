# Sub-06 — Entrada en sidebar de workspace settings

**Task:** 09 · **Tamaño:** XS

## Cambio

En `apps/web/core/components/workspace/settings/sidebar.tsx`, añadir entrada "Teams" entre "Members" y "Integrations". Ocultar si el user no tiene permiso `workspace.manage_teams` (épica 08) — mientras tanto, solo Admin.

```tsx
{ label: t("settings.teams"), href: `/${workspaceSlug}/settings/teams`, icon: UsersIcon, gate: "workspace.manage_teams" }
```

## Aceptación

- [ ] Visible para Admin.
- [ ] No visible para Guest.
