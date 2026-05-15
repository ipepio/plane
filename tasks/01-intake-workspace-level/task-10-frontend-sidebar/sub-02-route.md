# Sub-02 — Ruta `/[workspaceSlug]/intakes`

**Task:** 10 · **Tamaño:** XS

## Cambio

`apps/web/app/[workspaceSlug]/intakes/page.tsx`: muestra lista de intakes del workspace (cards o tabla). Click → navega al detalle.

## Aceptación

- [ ] Renderiza cards con name, description, pending_count.
- [ ] "New intake" visible solo si el user tiene permiso (admin / `workspace.manage_intakes`).
