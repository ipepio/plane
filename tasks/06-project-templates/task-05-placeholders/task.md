# Task 05 — Placeholder engine

**Épica:** 06 · **Tamaño:** S

## Contexto

Soporte `{{var_name}}` en strings del snapshot (project.name, project.description, issue.name, issue.description).

## Diseño

- Regex simple `{{ ([\w.-]+) }}` con tolerancia a whitespace interno.
- Si la var no se pasa, **deja el placeholder intacto** (no falla) — útil para previews.
- Helper `extract_placeholders(text)` para detectar todas las vars de una plantilla (UI lista qué pedir al instanciar).

## Archivos

- `apps/api/plane/utils/project_template/placeholders.py` (nuevo)

## Aceptación

- [ ] `apply_vars("Hello {{ name }}", {"name": "X"})` == `"Hello X"`.
- [ ] `apply_vars("{{missing}}", {})` == `"{{missing}}"`.
- [ ] `extract_placeholders` detecta todas las vars del payload entero.

## Sub-tareas

1. [sub-01 — apply_vars](./sub-01-apply.md)
2. [sub-02 — extract_placeholders](./sub-02-extract.md)
3. [sub-03 — Tests](./sub-03-tests.md)
