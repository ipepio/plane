# Sub-02 — WorklogService

**Task:** 07 · **Tamaño:** S

## Cambio

```ts
import { APIService } from "@plane/services";
import type { TWorklog, TWorklogPayload, TWorklogReport, TWorklogAggregate, TWorklogFilters } from "@plane/types";

export class WorklogService extends APIService {
  list(slug: string, projectId: string, issueId: string) {
    return this.get<TWorklog[]>(`/api/workspaces/${slug}/projects/${projectId}/issues/${issueId}/worklogs/`)
      .then(r => r.data);
  }
  create(slug: string, projectId: string, issueId: string, data: TWorklogPayload) {
    return this.post<TWorklog>(`/api/workspaces/${slug}/projects/${projectId}/issues/${issueId}/worklogs/`, data)
      .then(r => r.data);
  }
  update(slug: string, projectId: string, issueId: string, id: string, data: Partial<TWorklogPayload>) {
    return this.patch<TWorklog>(`/api/workspaces/${slug}/projects/${projectId}/issues/${issueId}/worklogs/${id}/`, data)
      .then(r => r.data);
  }
  delete(slug: string, projectId: string, issueId: string, id: string) {
    return this.delete_(`/api/workspaces/${slug}/projects/${projectId}/issues/${issueId}/worklogs/${id}/`);
  }
  report(slug: string, filters: TWorklogFilters) {
    return this.get<TWorklogReport[] | TWorklogAggregate[]>(`/api/workspaces/${slug}/worklogs/`, { params: filters })
      .then(r => r.data);
  }
  exportCsvUrl(slug: string, filters: TWorklogFilters) {
    const qs = new URLSearchParams(filters as any).toString();
    return `/api/workspaces/${slug}/worklogs/export/?${qs}`;
  }
}
```

## Aceptación

- [ ] Service compila e instanciable.
