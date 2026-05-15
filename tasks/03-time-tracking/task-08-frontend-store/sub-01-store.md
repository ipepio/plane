# Sub-01 — Store base con observable maps

**Task:** 08 · **Tamaño:** S

## Cambio

```ts
import { makeAutoObservable, runInAction } from "mobx";
import { WorklogService } from "@plane/services";
import type { TWorklog, TWorklogReport, TWorklogAggregate, TWorklogFilters } from "@plane/types";

export class WorklogStore {
  byIssue: Record<string, TWorklog[]> = {};
  report: (TWorklogReport[] | TWorklogAggregate[]) | null = null;
  loadingReport = false;

  private service = new WorklogService();

  constructor() {
    makeAutoObservable(this);
  }
}
```

## Aceptación

- [ ] Observable inicial vacío.
