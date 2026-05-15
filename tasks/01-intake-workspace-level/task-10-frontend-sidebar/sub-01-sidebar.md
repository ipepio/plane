# Sub-01 — Entrada sidebar

**Task:** 10 · **Tamaño:** XS

## Cambio

En la sidebar del workspace (no del proyecto), añadir entrada "Intakes" con icono inbox y badge `totalPendingInWorkspace`. Visible para todos los workspace members.

```tsx
<SidebarItem href={`/${ws}/intakes`} icon={InboxIcon} label={t("intakes.title")}>
  {store.totalPendingInWorkspace > 0 && <Badge>{store.totalPendingInWorkspace}</Badge>}
</SidebarItem>
```

## Aceptación

- [ ] Visible para Guest.
- [ ] Badge solo aparece si > 0.
