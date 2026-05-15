# Épica 06 — Plantillas de proyecto / clonado de épicas

## Objetivo

Crear un nuevo proyecto a partir de una plantilla que ya trae estructura: épicas, issues, módulos, ciclos, labels, estados, vistas, e issue types con sus propiedades. Caso de uso principal: onboarding de cliente.

## Por qué

Cada onboarding de cliente repite las mismas 30-40 tareas con la misma estructura. Hoy hay que crearlas a mano. Una plantilla ahorra horas y elimina inconsistencias.

## Scope

- Modelo `ProjectTemplate`: snapshot serializable del proyecto base (estados, labels, módulos, issue types, issues con jerarquía épica → sub).
- Acción "Save as template" en un proyecto existente.
- Acción "Create project from template" en la creación de proyecto.
- Soporte para placeholders en nombres (p. ej. `{{client_name}}`) que se sustituyen al instanciar.
- Mantener relaciones jerárquicas (épica → sub-issues, parent-child).
- (Opcional) clonar solo un subconjunto de épicas en lugar del proyecto entero.

## Fuera de scope

- Marketplace de plantillas compartidas entre workspaces — fase 2.
- Versionado de plantillas — fase 2.
- Datos no estructurales: comentarios, attachments, worklog. Solo estructura.

## Decisiones de diseño cerradas

- [X] **D1** — Plantilla como **snapshot JSON** (`ProjectTemplate.payload` JSONField). Más simple, aísla de cambios futuros del proyecto base y permite editar el snapshot directamente si hace falta.
- [X] **D2** — Placeholders se sustituyen en **`name` y `description`** (issues + project). Labels no — son etiquetas estáticas y rara vez se parametrizan.
- [X] **D3** — **Reutilizar** issue types del workspace destino por nombre (resolver `name → id` al instanciar). Si no existe, crearlo on-the-fly con la definición del snapshot.
- [X] **D4** — Si épica 05 está disponible, las **propiedades custom** se incluyen en el snapshot del issue type y se reaplican al instanciar. Si no, esa sección queda vacía.

## Áreas de código afectadas

- `apps/api/plane/db/models/project.py` (o nuevo `project_template.py`)
- `apps/api/plane/db/migrations/`
- `apps/api/plane/app/{serializers,views,urls}/project/template.py` (nuevo)
- `apps/web/core/components/project/templates/` (nuevo)
- `apps/web/app/[workspaceSlug]/projects/create/` (selector de plantilla)
- `apps/web/app/[workspaceSlug]/settings/templates/` (gestión)
- `packages/i18n/src/locales/*/translations.json`

## Criterios de aceptación

- [X] Guardar un proyecto con 3 épicas y 12 sub-issues como plantilla "Onboarding GoGuest".
- [X] Crear nuevo proyecto desde esa plantilla con nombre `Onboarding ACME` → reproduce las 3 épicas + 12 sub-issues con jerarquía intacta.
- [X] Placeholder `{{client_name}}` en títulos se sustituye por "ACME".
- [X] Test: instanciar plantilla N veces produce N proyectos idénticos sin colisión.

## Tareas atómicas

1. [task-01 — Modelo ProjectTemplate](./task-01-model/task.md)
2. [task-02 — Migraciones](./task-02-migrations/task.md)
3. [task-03 — Snapshot builder (proyecto → JSON)](./task-03-snapshot-builder/task.md)
4. [task-04 — Instantiator (JSON → proyecto)](./task-04-instantiator/task.md)
5. [task-05 — Placeholder engine](./task-05-placeholders/task.md)
6. [task-06 — API REST templates (CRUD + save-as + instantiate)](./task-06-api/task.md)
7. [task-07 — Frontend types + service](./task-07-frontend-types/task.md)
8. [task-08 — Frontend store](./task-08-frontend-store/task.md)
9. [task-09 — Acción "Save as template"](./task-09-save-as-modal/task.md)
10. [task-10 — Selector de plantilla en create project](./task-10-create-from-template/task.md)
11. [task-11 — Settings de plantillas](./task-11-settings-page/task.md)
12. [task-12 — i18n + permisos](./task-12-i18n/task.md)
