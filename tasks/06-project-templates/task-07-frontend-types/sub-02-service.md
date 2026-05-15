# Sub-02 — ProjectTemplateService

**Task:** 07 · **Tamaño:** S

## Cambio

```ts
import { APIService } from "@plane/services";
import type {
  TProjectTemplate, TProjectTemplateSummary,
  TInstantiatePayload, TSaveAsTemplatePayload,
} from "@plane/types";

export class ProjectTemplateService extends APIService {
  list(slug: string) {
    return this.get<TProjectTemplateSummary[]>(`/api/workspaces/${slug}/templates/`).then(r => r.data);
  }
  retrieve(slug: string, id: string) {
    return this.get<TProjectTemplate>(`/api/workspaces/${slug}/templates/${id}/`).then(r => r.data);
  }
  update(slug: string, id: string, patch: Partial<Pick<TProjectTemplate, "name" | "description" | "icon_props">>) {
    return this.patch<TProjectTemplate>(`/api/workspaces/${slug}/templates/${id}/`, patch).then(r => r.data);
  }
  delete(slug: string, id: string) {
    return this.delete_(`/api/workspaces/${slug}/templates/${id}/`);
  }
  saveAs(slug: string, data: TSaveAsTemplatePayload) {
    return this.post<TProjectTemplate>(`/api/workspaces/${slug}/templates/save-as/`, data).then(r => r.data);
  }
  instantiate(slug: string, id: string, data: TInstantiatePayload) {
    return this.post<{ id: string }>(`/api/workspaces/${slug}/templates/${id}/instantiate/`, data).then(r => r.data);
  }
  placeholders(slug: string, id: string) {
    return this.get<{ placeholders: string[] }>(`/api/workspaces/${slug}/templates/${id}/placeholders/`).then(r => r.data);
  }
}
```

## Aceptación

- [ ] Service compila.
