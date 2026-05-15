# Sub-02 — `AssigneeSelector`

**Task:** 10 · **Tamaño:** M

## Cambio

Modificar el componente existente bajo `apps/web/core/components/issues/issue-detail/assignees/` para:
- Aceptar `value: { users: string[]; teams: string[] }` y `onChange`.
- Renderizar dropdown con dos secciones (`<DropdownGroup label="Users">…</DropdownGroup>`, `<DropdownGroup label="Teams">…</DropdownGroup>`).
- Filtrar por search compartido.

Persistir cambio llamando `issueStore.updateIssue` con `assignees` y `team_assignees`.

## Aceptación

- [ ] Selección mixta users + teams se guarda.
- [ ] Avatares de teams se muestran (logo_props).
- [ ] Test E2E (Playwright si hay): asignar team a issue, ver chip.
