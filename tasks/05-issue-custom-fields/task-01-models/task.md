# Task 01 — Modelos `IssueProperty`, `IssuePropertyOption`, `IssuePropertyValue`

**Épica:** 05 · **Tamaño:** L

## Contexto

Schema central de campos custom. Tres modelos relacionados:
- `IssueProperty`: definición (name, type, config) anclada a un issue type.
- `IssuePropertyOption`: opciones de selects.
- `IssuePropertyValue`: valor por issue, tabla única con columnas typed.

## Diseño

- `IssueProperty` extiende `WorkspaceBaseModel` (siempre tiene workspace). Optionally `project` (null si la propiedad es a nivel workspace issue type).
- Foreign key a `IssueType`.
- `name` slug interno (`severity`), `display_name` ("Severity"), `relative_order` para sort.
- `config: JSONField` para opciones del tipo (regex, min/max, step, default).
- `IssuePropertyValue` con `unique_together = ("issue", "property")` (single-value).
- Multi-select usa tabla auxiliar `IssuePropertyValueOption`.

## Archivos

- Crear: `apps/api/plane/db/models/issue_property.py`
- Editar: `apps/api/plane/db/models/__init__.py`

## Aceptación

- [ ] Tres modelos importables.
- [ ] Lookup `issue_type.properties.all()` y `property.options.all()` funcionan.
- [ ] Constraint unique value por (issue, property).

## Sub-tareas

1. [sub-01 — IssueProperty model](./sub-01-property.md)
2. [sub-02 — IssuePropertyOption model](./sub-02-option.md)
3. [sub-03 — IssuePropertyValue model](./sub-03-value.md)
4. [sub-04 — IssuePropertyValueOption (M2M para multi-select)](./sub-04-value-option.md)
5. [sub-05 — Choices y validación a nivel modelo](./sub-05-choices.md)
