# Task 09 — Frontend store

**Épica:** 01 · **Tamaño:** M

## Diseño

`WorkspaceIntakeStore`:
- `intakes` Map<id, TWorkspaceIntake>.
- `ticketsByIntake` Map<intakeId, TWorkspaceIntakeIssue[]>.
- Acciones para CRUD intake, submit ticket, listar tickets, acciones de triage.

## Sub-tareas

1. [sub-01 — Store implementation](./sub-01-store.md)
2. [sub-02 — Computed: pending tickets totales](./sub-02-computed.md)
