# Sub-05 — Entrada "Roles" en sidebar de settings

**Task:** 09 · **Tamaño:** XS

## Cambio

Añadir el link al sidebar de settings del workspace.

## Cómo

Localizar la lista de items del sidebar (`apps/web/app/[workspaceSlug]/settings/layout.tsx` o `apps/web/core/components/workspace/settings/sidebar.tsx`) y añadir:

```tsx
{
  key: "roles",
  label: t("roles.title"),
  href: `/${workspaceSlug}/settings/roles`,
  icon: <KeyIcon />,
  show: hasPermission("workspace.manage_roles"),
}
```

> El helper `hasPermission` del frontend depende de sub-06.

## Aceptación

- [ ] La entrada aparece para Admin del workspace.
- [ ] No aparece para Guest.
- [ ] Marcado activo cuando la ruta actual es `/settings/roles*`.
