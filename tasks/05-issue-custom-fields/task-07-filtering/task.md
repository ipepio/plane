# Task 07 — Filtros y agrupación

**Épica:** 05 · **Tamaño:** M

## Contexto

Permitir filtrar y agrupar la lista de issues por property values.

## Diseño

- Filtros via query params: `property_filters=<prop_id>:<value>` (repetible).
- Agrupación: `group_by=property.<prop_id>` añadido al param existente.
- Solo soportar tipos: text (exact / icontains), number (eq/range), date (eq/range), boolean, select, user. Multi-select postergado.

## Sub-tareas

1. [sub-01 — Backend filter](./sub-01-filter.md)
2. [sub-02 — Backend group_by](./sub-02-group.md)
3. [sub-03 — Frontend filters UI](./sub-03-ui.md)
