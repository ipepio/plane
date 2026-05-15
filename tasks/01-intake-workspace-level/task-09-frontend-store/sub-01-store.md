# Sub-01 — `WorkspaceIntakeStore`

**Task:** 09 · **Tamaño:** M

## Cambio

```ts
export class WorkspaceIntakeStore {
  intakes = new Map<string, TWorkspaceIntake>();
  ticketsByIntake = new Map<string, TWorkspaceIntakeIssue[]>();
  private service = new WorkspaceIntakeService();

  constructor() { makeAutoObservable(this); }

  async fetchIntakes(ws: string) { ... }
  async createIntake(ws: string, payload: Partial<TWorkspaceIntake>) { ... }
  async fetchTickets(ws: string, intakeId: string, params?: any) { ... }
  async submitTicket(ws: string, intakeId: string, payload: any) { ... }

  async acceptTicket(ws: string, intakeId: string, ticketId: string, payload: any) {
    const updated = await this.service.acceptTicket(ws, intakeId, ticketId, payload);
    this._replaceTicket(intakeId, updated);
  }
  // reject, snooze, markDuplicate análogos
}
```

## Aceptación

- [ ] Las acciones actualizan los maps tras la respuesta.
- [ ] `pendingCountByIntake` reactivo.
