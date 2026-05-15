# Task 06 — API REST templates

**Épica:** 06 · **Tamaño:** M

## Contexto

Endpoints para CRUD de plantillas + acciones `save-as-template` (project → template) e `instantiate` (template → project).

## Diseño

- `ProjectTemplateViewSet(ModelViewSet)`:
  - `list/retrieve/destroy/update` estándar.
  - `@action save_as`: POST con `{project_id, name, description}` → crea template usando `build_project_snapshot`.
  - `@action instantiate`: POST con `{name, identifier, vars}` → instancia con `instantiate_template`, devuelve project.
  - `@action placeholders`: GET → lista de vars detectadas en el payload.
- Permisos: Admin del workspace puede CRUD; cualquier miembro puede instanciar (configurable, ver épica 08).

## Archivos

- `apps/api/plane/app/serializers/project_template.py` (nuevo)
- `apps/api/plane/app/views/project_template.py` (nuevo)
- `apps/api/plane/app/urls/project_template.py` (nuevo)

## Aceptación

- [ ] CRUD funciona.
- [ ] `save_as` produce payload válido.
- [ ] `instantiate` crea proyecto y devuelve su id.

## Sub-tareas

1. [sub-01 — Serializers](./sub-01-serializers.md)
2. [sub-02 — ViewSet base](./sub-02-viewset.md)
3. [sub-03 — Action save_as](./sub-03-save-as.md)
4. [sub-04 — Action instantiate](./sub-04-instantiate.md)
5. [sub-05 — Action placeholders](./sub-05-placeholders.md)
6. [sub-06 — URLs + permisos](./sub-06-urls.md)
7. [sub-07 — Tests E2E](./sub-07-tests.md)
