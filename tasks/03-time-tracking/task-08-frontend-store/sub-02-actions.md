# Sub-02 — Acciones CRUD

**Task:** 08 · **Tamaño:** S

## Cambio

```ts
async fetchByIssue(slug: string, projectId: string, issueId: string) {
  const list = await this.service.list(slug, projectId, issueId);
  runInAction(() => { this.byIssue[issueId] = list; });
  return list;
}

async create(slug: string, projectId: string, issueId: string, data: TWorklogPayload) {
  const w = await this.service.create(slug, projectId, issueId, data);
  runInAction(() => { this.byIssue[issueId] = [w, ...(this.byIssue[issueId] ?? [])]; });
  return w;
}

async update(slug: string, projectId: string, issueId: string, id: string, data: Partial<TWorklogPayload>) {
  const w = await this.service.update(slug, projectId, issueId, id, data);
  runInAction(() => {
    const list = this.byIssue[issueId] ?? [];
    this.byIssue[issueId] = list.map(x => x.id === id ? w : x);
  });
}

async remove(slug: string, projectId: string, issueId: string, id: string) {
  await this.service.delete(slug, projectId, issueId, id);
  runInAction(() => {
    this.byIssue[issueId] = (this.byIssue[issueId] ?? []).filter(x => x.id !== id);
  });
}

totalSecondsByIssue(issueId: string) {
  return (this.byIssue[issueId] ?? []).reduce((s, w) => s + w.duration, 0);
}
```

## Aceptación

- [ ] Update mantiene orden por started_at desc.
- [ ] `totalSecondsByIssue` correcto.
