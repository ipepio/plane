# Sub-02 — `WorkspaceIntakeService`

**Task:** 08 · **Tamaño:** S

## Cambio

```ts
export class WorkspaceIntakeService extends APIService {
  listIntakes(ws) { return this.get(`/api/v1/workspaces/${ws}/intakes/`).then(r => r.data); }
  createIntake(ws, payload) { ... }
  updateIntake(ws, id, payload) { ... }
  destroyIntake(ws, id) { ... }

  listTickets(ws, intakeId, params?) { ... }
  submitTicket(ws, intakeId, payload) { ... }
  acceptTicket(ws, intakeId, ticketId, payload: { project: string; state?: string; assignees?: string[] }) { ... }
  rejectTicket(ws, intakeId, ticketId, decision_note: string) { ... }
  snoozeTicket(ws, intakeId, ticketId, snoozed_till: string) { ... }
  markDuplicate(ws, intakeId, ticketId, duplicate_of: string) { ... }
}
```

## Aceptación

- [ ] Service exportado.
