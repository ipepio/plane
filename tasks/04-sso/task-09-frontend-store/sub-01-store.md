# Sub-01 — Store

**Task:** 09 · **Tamaño:** S

## Cambio

```ts
import { makeAutoObservable, runInAction } from "mobx";
import { WorkspaceSSOService } from "@plane/services";
import type { TWorkspaceSSOConfig, TWorkspaceSSOPatch } from "@plane/types";

const DEFAULTS: TWorkspaceSSOConfig = {
  enabled: false, allowed_domains: [], auto_provision_role: 15,
};

export class WorkspaceSSOStore {
  byWorkspace: Record<string, TWorkspaceSSOConfig> = {};
  private service = new WorkspaceSSOService();

  constructor() { makeAutoObservable(this); }

  config(slug: string) { return this.byWorkspace[slug] ?? DEFAULTS; }

  async fetch(slug: string) {
    const cfg = await this.service.retrieve(slug);
    runInAction(() => { this.byWorkspace[slug] = cfg; });
    return cfg;
  }

  async update(slug: string, patch: TWorkspaceSSOPatch) {
    const cfg = await this.service.update(slug, patch);
    runInAction(() => { this.byWorkspace[slug] = cfg; });
    return cfg;
  }
}
```

## Aceptación

- [ ] `config(slug)` siempre devuelve defaults aunque no se haya fetchado.
