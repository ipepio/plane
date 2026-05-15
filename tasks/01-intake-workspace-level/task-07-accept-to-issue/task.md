# Task 07 — Accept → crear `Issue` real

**Épica:** 01 · **Tamaño:** M

## Contexto

Cuando un triador acepta, se debe materializar el ticket como `Issue` dentro del proyecto destino. Se asigna al intake del proyecto (campo `Issue.intake`) o se crea directamente como issue normal según el destino.

## Diseño

- Helper `create_issue_from_intake_ticket(ticket, *, project, state=None, assignees=None, by)`.
- Mapeo:
  - `name` → `Issue.name`
  - `description_html` → `Issue.description_html`
  - `priority` → `Issue.priority`
  - `state` → fallback al default state del proyecto si no se pasa.
  - `assignees` (lista de UUIDs de users en el workspace).
  - `created_by` = `ticket.submitter` (preservar autoría).
- Si el ticket trae `metadata` (épica 02), volcar al description_html como sección renderizada (D3 de épica 02).
- Validar: el triador tiene permiso `issue.create` en el proyecto destino.

## Sub-tareas

1. [sub-01 — Helper create_issue_from_intake_ticket](./sub-01-helper.md)
2. [sub-02 — Wrap en transacción](./sub-02-transaction.md)
3. [sub-03 — Validación cross-project](./sub-03-validation.md)
4. [sub-04 — Tests](./sub-04-tests.md)
