# Sub-01 — `TeamStore`

**Task:** 09 · **Tamaño:** M

## Cambio

```ts
// apps/web/core/store/team.store.ts
import { makeAutoObservable, runInAction } from "mobx";
import { TeamService } from "@plane/services";
import type { TTeam, TTeamDetail, TTeamRole } from "@plane/types";

export class TeamStore {
  teams = new Map<string, TTeamDetail>();
  loadingByWs = new Map<string, boolean>();
  private service = new TeamService();

  constructor() { makeAutoObservable(this); }

  async fetchAll(workspaceSlug: string) {
    this.loadingByWs.set(workspaceSlug, true);
    const list = await this.service.list(workspaceSlug);
    runInAction(() => {
      list.forEach(t => this.teams.set(t.id, { ...t, members: this.teams.get(t.id)?.members ?? [] }));
      this.loadingByWs.set(workspaceSlug, false);
    });
  }

  async fetchOne(workspaceSlug: string, id: string) {
    const t = await this.service.retrieve(workspaceSlug, id);
    runInAction(() => this.teams.set(id, t));
    return t;
  }

  async create(workspaceSlug: string, payload: Partial<TTeam>) {
    const t = await this.service.create(workspaceSlug, payload);
    runInAction(() => this.teams.set(t.id, { ...t, members: [] }));
    return t;
  }
  // update, destroy, addMembers, removeMember, updateMemberRole análogos
}
```

Wire en `RootStore`.

## Aceptación

- [ ] `useTeamStore()` devuelve la instancia.
- [ ] `fetchAll` puebla el map.
- [ ] Componentes con `observer` reaccionan a cambios.
