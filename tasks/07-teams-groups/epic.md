# Épica 07 — Teams / grupos de personas

## Objetivo

Permitir agrupar miembros del workspace en equipos (p. ej. "Backend", "Sistemas", "Atención cliente") para asignar issues, intakes, notificaciones y permisos al grupo entero.

## Por qué

El modelo `Team` ya existe en `apps/api/plane/db/models/workspace.py:261` pero está **esquelético** — no tiene tabla de miembros ni endpoints. Asignaciones a equipos son carga muy frecuente; sin esto, hay que asignar persona por persona.

## Scope

- Tabla `TeamMember` (`team_id`, `user_id`, `role` opcional dentro del team).
- Endpoints: CRUD de team, añadir/quitar miembros, listar teams del workspace.
- UI:
  - Settings de workspace → "Teams" → crear/editar/eliminar.
  - Selector de asignados que admite también teams (al asignar a un team, se asigna a todos sus miembros, o se mantiene como "asignado al team" — ver D2).
  - Mostrar avatar de team (logo_props ya existe).
- @mentions de teams en comentarios → notifica a todos los miembros.
- (Opcional) sub-vistas / filtros "issues asignadas a mi team".

## Fuera de scope

- Teams anidados (sub-equipos) — fase 2.
- Permisos finos por team — depende de épica 08.

## Decisiones de diseño cerradas

- [X] **D1** — `TeamMember` con `role` propio: `lead` / `member`. Permite designar un responsable sin permisos extra (los permisos siguen viviendo en épica 08).
- [X] **D2** — Team como **assignee propio**: nueva tabla `IssueTeamAssignee`. No se expande a miembros. Mantiene el sentido de grupo y permite reasignar el team sin tocar issue por issue.
- [X] **D3** — Un usuario puede pertenecer a **varios** teams (M2M sin restricción).
- [X] **D4** — Modelo `Team` se mueve a `apps/api/plane/db/models/team.py`. Se mantiene re-export en `workspace.py` durante la migración.

## Áreas de código afectadas

- `apps/api/plane/db/models/workspace.py` (o nuevo `team.py`)
- `apps/api/plane/db/migrations/`
- `apps/api/plane/app/{serializers,views,urls}/workspace/team.py` (nuevo)
- `apps/api/plane/db/models/issue.py` (si team es assignee propio)
- `apps/web/app/[workspaceSlug]/settings/teams/` (nueva ruta)
- `apps/web/core/components/issues/assignees/` (incluir teams)
- `packages/types/src/team.ts`
- `packages/i18n/src/locales/*/translations.json`

## Criterios de aceptación

- [X] Admin crea team "Backend" con 4 miembros.
- [X] Asignar un issue al team "Backend" → los 4 miembros lo ven en "asignadas a mí" (o el team aparece como assignee según D2).
- [X] @backend en un comentario notifica a los 4.
- [X] Eliminar un team no borra issues; los desasigna correctamente.

## Tareas atómicas

1. [task-01 — Modelos Team / TeamMember](./task-01-models-team-member/task.md)
2. [task-02 — Migraciones](./task-02-migrations/task.md)
3. [task-03 — Serializers](./task-03-serializers/task.md)
4. [task-04 — API CRUD Team](./task-04-api-team-crud/task.md)
5. [task-05 — API miembros del team](./task-05-api-team-members/task.md)
6. [task-06 — Issue assignment a teams](./task-06-issue-team-assignee/task.md)
7. [task-07 — @mentions de teams](./task-07-mentions/task.md)
8. [task-08 — Frontend types + service](./task-08-frontend-types/task.md)
9. [task-09 — Frontend store + settings UI](./task-09-frontend-settings/task.md)
10. [task-10 — Assignee selector con teams](./task-10-frontend-assignee/task.md)
11. [task-11 — i18n + permisos](./task-11-i18n-permissions/task.md)
