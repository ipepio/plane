# Sub-02 — `TeamService`

**Task:** 08 · **Tamaño:** S

## Cambio

```ts
// packages/services/src/team.service.ts
import { APIService } from "./api.service";
import type { TTeam, TTeamDetail, TTeamMember, TTeamRole } from "@plane/types";

export class TeamService extends APIService {
  async list(workspaceSlug: string): Promise<TTeam[]> {
    return this.get(`/api/v1/workspaces/${workspaceSlug}/teams/`).then(r => r.data);
  }
  async retrieve(workspaceSlug: string, id: string): Promise<TTeamDetail> {
    return this.get(`/api/v1/workspaces/${workspaceSlug}/teams/${id}/`).then(r => r.data);
  }
  async create(workspaceSlug: string, payload: Partial<TTeam>): Promise<TTeam> {
    return this.post(`/api/v1/workspaces/${workspaceSlug}/teams/`, payload).then(r => r.data);
  }
  async update(workspaceSlug: string, id: string, payload: Partial<TTeam>): Promise<TTeam> {
    return this.patch(`/api/v1/workspaces/${workspaceSlug}/teams/${id}/`, payload).then(r => r.data);
  }
  async destroy(workspaceSlug: string, id: string): Promise<void> {
    return this.delete(`/api/v1/workspaces/${workspaceSlug}/teams/${id}/`);
  }
  async addMembers(workspaceSlug: string, id: string, members: { member: string; role: TTeamRole }[]) {
    return this.post(`/api/v1/workspaces/${workspaceSlug}/teams/${id}/members/`, { members }).then(r => r.data);
  }
  async removeMember(workspaceSlug: string, id: string, memberId: string) {
    return this.delete(`/api/v1/workspaces/${workspaceSlug}/teams/${id}/members/${memberId}/`);
  }
  async updateMember(workspaceSlug: string, id: string, memberId: string, role: TTeamRole) {
    return this.patch(`/api/v1/workspaces/${workspaceSlug}/teams/${id}/members/${memberId}/`, { role }).then(r => r.data);
  }
  async search(workspaceSlug: string, query: string): Promise<TTeam[]> {
    return this.get(`/api/v1/workspaces/${workspaceSlug}/teams/search/?query=${encodeURIComponent(query)}`).then(r => r.data);
  }
}
```

## Aceptación

- [ ] Todos los métodos compilan.
- [ ] Service exportado desde `@plane/services`.
