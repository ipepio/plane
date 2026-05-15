# Task 09 — Frontend store + pantalla settings teams

**Épica:** 07 · **Tamaño:** L

## Contexto

UI para listar, crear, editar y borrar teams; añadir/quitar miembros.

## Diseño

- `TeamStore` (MobX): map `teamId → TTeamDetail`, acciones de CRUD que llaman al service y actualizan el map.
- Ruta: `apps/web/app/[workspaceSlug]/settings/teams/page.tsx` con tabla de teams.
- `TeamFormModal` para crear/editar.
- `TeamDetailDrawer` o `/settings/teams/[teamId]/page.tsx` para gestionar miembros (data table con search, role dropdown, kebab para quitar).
- Permisos: solo render si user tiene `workspace.manage_teams` (épica 08) o es Admin.

## Sub-tareas

1. [sub-01 — TeamStore](./sub-01-store.md)
2. [sub-02 — TeamsListPage](./sub-02-list-page.md)
3. [sub-03 — CreateTeamModal](./sub-03-create-modal.md)
4. [sub-04 — TeamDetailPage](./sub-04-detail-page.md)
5. [sub-05 — AddTeamMembersModal](./sub-05-add-members-modal.md)
6. [sub-06 — Entrada en sidebar settings](./sub-06-sidebar.md)
