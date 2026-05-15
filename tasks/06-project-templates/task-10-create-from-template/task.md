# Task 10 — Selector de plantilla en create project

**Épica:** 06 · **Tamaño:** L

## Contexto

En el modal/page de crear proyecto, añadir un selector opcional "From template" → si se selecciona, esconde campos estructurales y muestra solo `name`, `identifier` y los placeholders detectados.

## Archivos

- `apps/web/core/components/project/create/template-selector.tsx` (nuevo)
- `apps/web/core/components/project/create/placeholder-fields.tsx` (nuevo)
- Modificar `project-create-modal.tsx` (existente)

## Aceptación

- [ ] Submit con template id llama `instantiate` en lugar del create estándar.
- [ ] Placeholders aparecen como inputs con label legible (snake_case → Title Case).
- [ ] Loading state mientras instancia (puede tardar segundos).

## Sub-tareas

1. [sub-01 — TemplateSelector con search](./sub-01-selector.md)
2. [sub-02 — PlaceholderFields dinámicos](./sub-02-placeholders.md)
3. [sub-03 — Wire en create modal](./sub-03-wire.md)
4. [sub-04 — Estado loading + redirect](./sub-04-flow.md)
