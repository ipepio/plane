# Task 01 — Modelos `WorkspaceIntake` y `WorkspaceIntakeIssue`

**Épica:** 01 · **Tamaño:** L

## Contexto

Crear modelos paralelos a los actuales `Intake` / `IntakeIssue` pero anclados al workspace, no al proyecto.

## Diseño

- `WorkspaceIntake(BaseModel)`: `workspace`, `name`, `description`, `is_default`, `logo_props`.
- `WorkspaceIntakeIssue(BaseModel)`:
  - FK `intake`, FK `submitter` (user que abrió).
  - `name`, `description_html`, `priority`, `metadata` (JSON para épica 02).
  - `status` (mismas choices que `IntakeIssueStatus`).
  - `accepted_issue` FK opcional a `Issue` (nullable, set tras accept).
  - `decision_note` (motivo de reject), `snoozed_till` (datetime).
- Constraint: `name` único case-insensitive en workspace para `WorkspaceIntake`.
- Solo un `is_default=True` por workspace (constraint condicional).

## Archivos

- Crear: `apps/api/plane/db/models/workspace_intake.py`
- Editar: `apps/api/plane/db/models/__init__.py`

## Aceptación

- [ ] Crear workspace intake "Sistemas".
- [ ] Crear ticket bajo "Sistemas" como Pending.
- [ ] Estados Accepted / Rejected / Snoozed / Duplicate persisten correctamente.

## Sub-tareas

1. [sub-01 — WorkspaceIntake](./sub-01-workspace-intake.md)
2. [sub-02 — WorkspaceIntakeIssue](./sub-02-workspace-intake-issue.md)
3. [sub-03 — Constraint `is_default`](./sub-03-default-constraint.md)
4. [sub-04 — Choices y FSM](./sub-04-status-fsm.md)
