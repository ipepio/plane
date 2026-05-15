# Task 06 — Issue assignment a teams

**Épica:** 07 · **Tamaño:** M

## Contexto

Un issue podrá tener teams como assignees, además de users. Manteniendo la tabla `IssueAssignee` actual, creamos paralela `IssueTeamAssignee`.

## Diseño

- Nueva tabla `IssueTeamAssignee(issue, team)` con `unique_together`.
- Endpoints siguen la simetría de `IssueAssignee`.
- En la serialización del issue, exponer `team_assignees: [TeamSerializer, ...]` además de `assignees`.
- Si el team se borra (soft), el `IssueTeamAssignee` debe ocultarse en API.

## Archivos

- Crear/Editar: `apps/api/plane/db/models/issue.py`
- Editar: `apps/api/plane/app/serializers/issue/issue.py`
- Editar: `apps/api/plane/app/views/issue/*.py` (endpoint patch assignees)

## Aceptación

- [ ] `PATCH /issues/<id>/ {"team_assignees": ["<team_uuid>"]}` añade asignación.
- [ ] `GET /issues/<id>/` devuelve `team_assignees`.
- [ ] Issue muestra el team en lista al filtrar.

## Sub-tareas

1. [sub-01 — Modelo IssueTeamAssignee](./sub-01-model.md)
2. [sub-02 — Migración](./sub-02-migration.md)
3. [sub-03 — Serializer extension](./sub-03-serializer.md)
4. [sub-04 — Endpoint patch team_assignees](./sub-04-endpoint.md)
5. [sub-05 — Filtro "issues asignadas a mi team"](./sub-05-filter.md)
