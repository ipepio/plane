# Épica 01 — Intake a nivel workspace

## Objetivo

Permitir que cualquier usuario (interno del workspace, sin pertenecer a un proyecto concreto, e idealmente externo vía link público) abra tickets — bugs, mejoras, solicitudes — y que un triador los acepte y los enrute al proyecto correspondiente.

## Por qué

Hoy el modelo `Intake` (`apps/api/plane/db/models/intake.py`) hereda de `ProjectBaseModel`: cada intake vive bajo un proyecto y solo lo pueden usar miembros del proyecto. GoGuest necesita varios buzones transversales (sistemas, administración, integraciones…) que no pertenecen a un proyecto.

## Scope

- Modelo `WorkspaceIntake` a nivel workspace, independiente del intake por proyecto.
- `WorkspaceIntakeIssue` con los mismos estados que `IntakeIssue`: `Pending / Accepted / Rejected / Snoozed / Duplicate`.
- Triage: aceptar un ticket significa moverlo a un proyecto+intake destino (creando el `Issue` real).
- Permisos: cualquier miembro del workspace puede crear ticket; solo roles ≥ Member pueden triarlos (configurable, ver épica 08).
- API REST en `apps/api/plane/app/views/` y URLs en `apps/api/plane/app/urls/`.
- UI: nueva sección "Intakes" en sidebar del workspace (no del proyecto).
- (Opcional fase 2) submission anónima vía link público, reutilizando la app `space`.

## Fuera de scope

- Notificaciones por email del triage (épica aparte si interesa).
- Auto-ruteo por reglas — manual de momento.

## Decisiones de diseño cerradas

- [X] **D1** — Modelo **nuevo** `WorkspaceIntake` (no extender `Intake` actual). Aisla queries, evita migraciones complejas, mantiene el intake por proyecto intacto.
- [X] **D2** — Al aceptar un ticket: se **crea un Issue real** en el proyecto destino. El `WorkspaceIntakeIssue` permanece como registro auditable (estado `Accepted`) con FK al issue creado. Conserva trazabilidad sin duplicar contenido (el issue es el contenido autoritativo).
- [X] **D3** — Submission anónima vía link público: **fase 2**. MVP requiere autenticación de workspace member.

## Áreas de código afectadas

- `apps/api/plane/db/models/intake.py` (o nuevo archivo `workspace_intake.py`)
- `apps/api/plane/db/migrations/`
- `apps/api/plane/app/{serializers,views,urls}/intake.py`
- `apps/web/core/components/intake/` (replicar para workspace)
- `apps/web/app/[workspaceSlug]/(projects)/intake/` → nueva ruta sin `projects/`
- `packages/types/src/intake.ts`
- `packages/i18n/src/locales/*/translations.json`

## Criterios de aceptación

- [X] Un usuario `Member` del workspace, sin pertenecer a ningún proyecto, puede abrir un ticket en el intake del workspace.
- [X] El triador puede aceptar el ticket eligiendo proyecto + intake destino, y aparece como `Issue` en ese proyecto.
- [ ] Endpoints REST documentados (OpenAPI) y con tests.
- [X] UI con vistas: lista, detalle, acciones de triage.
- [X] Migración aplica limpia sobre la BD existente.

## Tareas atómicas

1. [task-01 — Modelos WorkspaceIntake + WorkspaceIntakeIssue](./task-01-models/task.md)
2. [task-02 — Migraciones](./task-02-migrations/task.md)
3. [task-03 — Serializers](./task-03-serializers/task.md)
4. [task-04 — API CRUD WorkspaceIntake](./task-04-api-intake-crud/task.md)
5. [task-05 — API submit](./task-05-api-submit/task.md)
6. [task-06 — API triage (accept/reject/snooze/duplicate)](./task-06-api-triage/task.md)
7. [task-07 — Accept → crear Issue real](./task-07-accept-to-issue/task.md)
8. [task-08 — Frontend types + service](./task-08-frontend-types/task.md)
9. [task-09 — Frontend store](./task-09-frontend-store/task.md)
10. [task-10 — Sidebar workspace + ruta](./task-10-frontend-sidebar/task.md)
11. [task-11 — Lista + detalle + triage UI](./task-11-frontend-ui/task.md)
12. [task-12 — i18n + permisos](./task-12-i18n/task.md)
