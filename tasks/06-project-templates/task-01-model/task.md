# Task 01 — Modelo ProjectTemplate

**Épica:** 06 · **Tamaño:** S

## Contexto

Persistir plantillas a nivel workspace con su `payload` JSON.

## Diseño

- `ProjectTemplate(WorkspaceBaseModel)` con campos `name`, `description`, `payload` (JSON), `created_by`, `icon_props` (opcional).
- Unicidad por `(workspace, name)` case-insensitive.
- Indexado por `workspace`.

## Archivos

- `apps/api/plane/db/models/project_template.py` (nuevo)
- `apps/api/plane/db/models/__init__.py` (re-export)

## Aceptación

- [ ] `ProjectTemplate.objects.create(...)` funciona.
- [ ] Nombre duplicado mismo workspace falla.

## Sub-tareas

1. [sub-01 — Crear archivo](./sub-01-file.md)
2. [sub-02 — Modelo + constraints](./sub-02-model.md)
3. [sub-03 — Re-export](./sub-03-reexport.md)
