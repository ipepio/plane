# Sub-03 — Reporte y filtros

**Task:** 08 · **Tamaño:** S

## Cambio

```ts
filters: TWorklogFilters = {};

setFilter<K extends keyof TWorklogFilters>(key: K, val: TWorklogFilters[K]) {
  this.filters = { ...this.filters, [key]: val };
}

async fetchReport(slug: string) {
  this.loadingReport = true;
  try {
    const data = await this.service.report(slug, this.filters);
    runInAction(() => { this.report = data; });
  } finally {
    runInAction(() => { this.loadingReport = false; });
  }
}
```

## Aceptación

- [ ] `setFilter` no muta original.
- [ ] `fetchReport` toggles loading.
