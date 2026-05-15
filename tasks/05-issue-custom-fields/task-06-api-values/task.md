# Task 06 — API values

**Épica:** 05 · **Tamaño:** L

## Contexto

Endpoint para leer y escribir valores de propiedades en un issue.

URL: `/workspaces/<slug>/projects/<pid>/issues/<iid>/property-values/`

## Diseño

- `GET` lista todos los values de un issue (con `value` decoded).
- `POST` (bulk upsert) crea/actualiza varios values en una llamada.
- Validación strict por tipo (sub-04 de task-03).
- Para `multi_select`, gestionar `IssuePropertyValueOption` recreando todo el set (delete + bulk_create).
- Si property `is_required` y value se borra → 400 (no permitido).

## Sub-tareas

1. [sub-01 — GET values](./sub-01-get.md)
2. [sub-02 — POST bulk upsert](./sub-02-post.md)
3. [sub-03 — Manejo multi-select](./sub-03-multi.md)
4. [sub-04 — Required en create de issue](./sub-04-required.md)
5. [sub-05 — Tests](./sub-05-tests.md)
