# Task 09 — Modal "Log time" en issue

**Épica:** 03 · **Tamaño:** M

## Contexto

Botón en el header del detalle de issue → modal con duración, fecha/hora, descripción, `is_billable`.

## Diseño

- Componente `LogTimeModal` con form simple, parseo de duración en formato `1h30m`, `90m`, `5400s`, o `1:30`.
- Usa `worklogStore.create`.

## Archivos

- `apps/web/core/components/issues/issue-detail/worklog/log-time-button.tsx`
- `apps/web/core/components/issues/issue-detail/worklog/log-time-modal.tsx`
- `apps/web/core/helpers/duration.ts` (parser)

## Aceptación

- [ ] Parseo de duración acepta los 4 formatos.
- [ ] Botón visible solo si miembro del proyecto.

## Sub-tareas

1. [sub-01 — Parser de duración](./sub-01-parser.md)
2. [sub-02 — Modal](./sub-02-modal.md)
3. [sub-03 — Botón con permiso](./sub-03-button.md)
4. [sub-04 — Integrar en issue header](./sub-04-integrate.md)
