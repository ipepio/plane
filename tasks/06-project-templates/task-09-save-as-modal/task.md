# Task 09 — Acción "Save as template"

**Épica:** 06 · **Tamaño:** M

## Contexto

Punto de entrada desde el menú del proyecto (project header dropdown) → modal con name + description → llama `saveAs`.

## Archivos

- `apps/web/core/components/project/templates/save-as-template-modal.tsx` (nuevo)
- Entry point en project header dropdown (existente).

## Aceptación

- [ ] Botón visible solo a Admin.
- [ ] Tras éxito, toast con CTA "Ver plantillas" → settings.

## Sub-tareas

1. [sub-01 — Modal](./sub-01-modal.md)
2. [sub-02 — Entry en dropdown](./sub-02-entry.md)
