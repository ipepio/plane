# Task 10 — Assignee selector con teams

**Épica:** 07 · **Tamaño:** M

## Contexto

El selector de asignados de issues hoy solo admite users. Extender para admitir teams como assignees primera-clase.

## Diseño

- Selector dividido en 2 secciones: "Users" y "Teams" con headers.
- Avatares de teams en chips con `logo_props`.
- Al cambiar selección, el componente emite payload con `assignees: [...userIds]` y `team_assignees: [...teamIds]` (campos separados, ver task-06).

## Sub-tareas

1. [sub-01 — Hook useAssignableEntities](./sub-01-hook.md)
2. [sub-02 — AssigneeSelector UI](./sub-02-selector.md)
3. [sub-03 — IssueCard chips con teams](./sub-03-cards.md)
