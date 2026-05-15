# Sub-04 — `TeamDetailPage`

**Task:** 09 · **Tamaño:** M

## Cambio

`apps/web/app/[workspaceSlug]/settings/teams/[teamId]/page.tsx`:

- Header con name, description, logo + botón "Edit team".
- Tabla de miembros con columnas: avatar, name, email, role dropdown (lead/member), kebab para quitar.
- Botón "Add members" → abre modal de la sub-05.
- Cargar via `store.fetchOne`.

## Aceptación

- [ ] Cambiar rol en dropdown llama API y refleja en UI.
- [ ] Quitar miembro pide confirmación.
- [ ] Edit team modifica name/description.
