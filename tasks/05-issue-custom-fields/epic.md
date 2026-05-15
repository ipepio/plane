# Épica 05 — Campos personalizados en issues

## Objetivo

Permitir definir campos custom (texto, número, select, multi-select, fecha, checkbox, URL, usuario) que aparezcan en cualquier issue, configurables a nivel **issue type** dentro de un proyecto o workspace.

## Por qué

Los issues hoy traen solo los campos built-in (estado, prioridad, asignados, fechas, módulo, ciclo, labels). No existen propiedades arbitrarias por proyecto/cliente. Sin esto no se puede modelar info específica de cliente (severity, environment, contract_id, etc.).

## Scope

- Modelo `IssueProperty` (definición): `name`, `display_name`, `type`, `config` (JSON con opciones / regex / min-max), `is_required`, `is_active`, `issue_type_id`.
- Modelo `IssuePropertyOption` para selects y multi-selects.
- Modelo `IssuePropertyValue` (valor por issue): `issue_id`, `property_id`, `value` polimórfico (`value_text`, `value_number`, `value_datetime`, `value_boolean`, `value_user_id`, `value_option_id`).
- API REST: CRUD de propiedades + endpoint para set/get values en issue.
- UI:
  - Settings de proyecto → Issue Types → editar propiedades.
  - Detalle de issue: panel lateral con campos custom.
  - Filtros y agrupación por campos custom en lista/kanban.
- Validación backend según `type` y `config`.

## Fuera de scope

- Fórmulas / campos calculados — fase 2.
- Campos a nivel teamspace (épica 07) — fase 2.

## Decisiones de diseño cerradas

- [X] **D1** — Propiedades por **issue type**. Aprovecha `IssueType` / `ProjectIssueType` existente. Una propiedad pertenece a un issue type concreto.
- [X] **D2** — **Tabla única** `IssuePropertyValue` con columnas typed nullables (`value_text`, `value_number`, `value_datetime`, `value_boolean`, `value_user_id`, `value_option_id`). Más simple, queryable, validable.
- [X] **D3** — Filtrar y agrupar **incluidos en MVP**. Sin filtro la feature pierde valor. Solo para tipos planos primero (text, number, select, user); multi-select y date-range en una sub-tarea separada si hace falta.

## Tipos soportados (MVP)

| Tipo | Storage column | Notas |
|---|---|---|
| `text` | `value_text` | longitud configurable |
| `long_text` | `value_text` | render textarea |
| `number` | `value_number` | DecimalField |
| `date` | `value_datetime` | solo fecha si `config.time_disabled` |
| `boolean` | `value_boolean` | checkbox |
| `select` | `value_option_id` | FK a `IssuePropertyOption` |
| `multi_select` | tabla M2M `IssuePropertyValueOption` | múltiples opciones |
| `user` | `value_user_id` | FK a `User` |
| `url` | `value_text` | validación regex |

## Áreas de código afectadas

- `apps/api/plane/db/models/issue_type.py` (extender) o nuevo `issue_property.py`
- `apps/api/plane/db/migrations/`
- `apps/api/plane/app/{serializers,views,urls}/issue/property.py`
- `apps/web/core/components/issues/issue-detail/properties/custom/` (nuevo)
- `apps/web/app/[workspaceSlug]/projects/[projectId]/settings/issue-types/`
- `packages/types/src/issues/property.ts`
- `packages/i18n/src/locales/*/translations.json`

## Criterios de aceptación

- [X] Admin define en el issue type "Bug" del proyecto X una propiedad `severity` (select: low/med/high/critical, requerida).
- [X] Al crear un Bug en X, el formulario obliga a elegir severity.
- [X] La lista del proyecto agrupa por severity.
- [X] API rechaza valor fuera de las opciones (test).

## Tareas atómicas

1. [task-01 — Modelos IssueProperty / Option / Value](./task-01-models/task.md)
2. [task-02 — Migraciones](./task-02-migrations/task.md)
3. [task-03 — Serializers](./task-03-serializers/task.md)
4. [task-04 — API CRUD properties](./task-04-api-properties/task.md)
5. [task-05 — API options del select](./task-05-api-options/task.md)
6. [task-06 — API values + validación typed](./task-06-api-values/task.md)
7. [task-07 — Filtros y agrupación](./task-07-filtering/task.md)
8. [task-08 — Frontend types + service](./task-08-frontend-types/task.md)
9. [task-09 — Frontend stores](./task-09-frontend-stores/task.md)
10. [task-10 — Settings issue type → properties](./task-10-settings-ui/task.md)
11. [task-11 — Detalle de issue: panel custom](./task-11-issue-detail-ui/task.md)
12. [task-12 — i18n](./task-12-i18n/task.md)
