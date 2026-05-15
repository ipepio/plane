# Task 11 — Settings de plantillas

**Épica:** 06 · **Tamaño:** M

## Contexto

Ruta `app/[workspaceSlug]/settings/templates/` para listar, editar nombre/descripción y eliminar plantillas.

## Archivos

- `apps/web/app/[workspaceSlug]/settings/templates/page.tsx`
- `apps/web/core/components/settings/templates/list.tsx`
- `apps/web/core/components/settings/templates/row.tsx`
- `apps/web/core/components/settings/templates/edit-modal.tsx`

## Aceptación

- [ ] Lista paginada (o virtualizada si > 50).
- [ ] Edit modal solo cambia name/description/icon.
- [ ] Delete con confirmación.

## Sub-tareas

1. [sub-01 — Page + lista](./sub-01-page.md)
2. [sub-02 — Row con acciones](./sub-02-row.md)
3. [sub-03 — Edit modal](./sub-03-edit.md)
4. [sub-04 — Delete confirm](./sub-04-delete.md)
