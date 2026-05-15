# Sub-02 — Service

**Task:** 08 · **Tamaño:** XS

## Cambio

```ts
import { APIService } from "@plane/services";
import type { TWorkspaceSSOConfig, TWorkspaceSSOPatch } from "@plane/types";

export class WorkspaceSSOService extends APIService {
  retrieve(slug: string) {
    return this.get<TWorkspaceSSOConfig>(`/api/workspaces/${slug}/sso/`).then(r => r.data);
  }
  update(slug: string, patch: TWorkspaceSSOPatch) {
    return this.patch<TWorkspaceSSOConfig>(`/api/workspaces/${slug}/sso/`, patch).then(r => r.data);
  }
}
```

## Aceptación

- [ ] Service compila.
