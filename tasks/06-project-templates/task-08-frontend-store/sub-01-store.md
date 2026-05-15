# Sub-01 — Store

**Task:** 08 · **Tamaño:** S

## Cambio

```ts
import { makeAutoObservable, runInAction } from "mobx";
import { ProjectTemplateService } from "@plane/services";
import type { TProjectTemplateSummary } from "@plane/types";

export class ProjectTemplateStore {
  list: Record<string, TProjectTemplateSummary> = {};
  loading = false;
  private service = new ProjectTemplateService();

  constructor() { makeAutoObservable(this); }

  get all() {
    return Object.values(this.list).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
}
```

## Aceptación

- [ ] `all` derivado por created_at desc.
