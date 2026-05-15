# Épica 02 — Formularios personalizados por intake

## Objetivo

Que cada intake (sistemas, administración, inbox GG, inbox integraciones, etc.) tenga su propio formulario con campos definidos por el admin: texto corto, texto largo, select, multi-select, fecha, número, archivo adjunto, usuario, etc.

## Por qué

Hoy todos los tickets de intake comparten los mismos campos del `Issue` base. Cada departamento necesita preguntas específicas (p. ej. "¿impacta a producción?", "tipo de integración", "cliente afectado") y obligatoriedad distinta.

## Scope

- Modelo `IntakeFormField` con tipo, label, placeholder, opciones (para select), required, orden, validaciones.
- Asociado a un `WorkspaceIntake` (épica 01) o a un `Intake` por proyecto (compatibilidad).
- Modelo `IntakeFormFieldValue` que guarde la respuesta por ticket (clave-valor con tipado).
- UI de admin para editar el formulario de un intake (drag & drop de campos).
- UI de submitter que renderiza el formulario dinámico.
- Validación en backend (no solo frontend).

## Fuera de scope

- Lógica condicional ("si X entonces mostrar Y") — fase 2.
- Reutilizar campos entre intakes — fase 2 (relación a `CustomField` global de épica 05).

## Decisiones de diseño cerradas

- [X] **D1** — **Tabla relacional** `IntakeFormField` con `type` enum y `config` JSONField. Permite indexar respuestas, validar en backend y exportar a CSV.
- [X] **D2** — **Aislado** del sistema de épica 05 en MVP. Modelos paralelos (`IntakeFormField` ≠ `IssueProperty`). Unificar si compensa en fase 2.
- [X] **D3** — Respuestas quedan **adjuntas** como "form responses" (registro estructurado) **y** se **vuelcan al `description_html`** del Issue al aceptar (como bloque renderizado al inicio). Lo mejor de ambos mundos: trazabilidad estructurada + visibilidad inmediata en el issue.

## Dependencias

Esta épica depende de **Épica 01** (WorkspaceIntake). Si la épica 01 no está, el alcance se reduce a formularios del intake por proyecto (`Intake` actual).

## Áreas de código afectadas

- `apps/api/plane/db/models/intake.py` (nuevos modelos)
- `apps/api/plane/app/{serializers,views,urls}/intake.py`
- `apps/web/core/components/intake/forms/` (nuevo)
- `apps/web/app/[workspaceSlug]/settings/intakes/` (nueva pantalla de admin)
- `packages/types/src/intake.ts`
- `packages/i18n/src/locales/*/translations.json`

## Criterios de aceptación

- [X] Admin puede crear un intake "Sistemas" con 5 campos personalizados, marcar 2 como obligatorios y reordenarlos.
- [X] Submitter ve esos 5 campos al abrir ticket y la validación impide enviar si falta uno obligatorio.
- [X] Las respuestas se persisten y se ven en el detalle del ticket de intake.
- [X] Backend rechaza payload con tipo inválido (test con `pytest`).

## Tareas atómicas

1. [task-01 — Modelos IntakeFormField / Option / Value](./task-01-models/task.md)
2. [task-02 — Migraciones](./task-02-migrations/task.md)
3. [task-03 — Serializers](./task-03-serializers/task.md)
4. [task-04 — API CRUD fields](./task-04-api-fields/task.md)
5. [task-05 — API options (select)](./task-05-api-options/task.md)
6. [task-06 — API submit con values](./task-06-api-submit/task.md)
7. [task-07 — Volcado al Issue.description al aceptar](./task-07-render-on-accept/task.md)
8. [task-08 — Frontend types + service](./task-08-frontend-types/task.md)
9. [task-09 — Store](./task-09-frontend-store/task.md)
10. [task-10 — Admin UI (editor con drag & drop)](./task-10-admin-ui/task.md)
11. [task-11 — Submitter UI (form render dinámico)](./task-11-submitter-ui/task.md)
12. [task-12 — i18n + permisos](./task-12-i18n/task.md)
