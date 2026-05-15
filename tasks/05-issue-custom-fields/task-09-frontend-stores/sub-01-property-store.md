# Sub-01 — `IssuePropertyStore`

**Task:** 09 · **Tamaño:** M

## Cambio

```ts
export class IssuePropertyStore {
  byIssueType = new Map<string, TIssueProperty[]>();
  optionsByProperty = new Map<string, TIssuePropertyOption[]>();
  private service = new IssuePropertyService();
  constructor() { makeAutoObservable(this); }

  async fetchProperties(ws: string, project: string, issueType: string) {
    const list = await this.service.listProperties(ws, project, issueType);
    runInAction(() => this.byIssueType.set(issueType, list));
  }
  async fetchOptions(ws: string, project: string, issueType: string, propId: string) {
    const opts = await this.service.listOptions(ws, project, issueType, propId);
    runInAction(() => this.optionsByProperty.set(propId, opts));
  }
  // create, update, destroy, reorder
}
```

## Aceptación

- [ ] Cachea por issue type.
- [ ] Reacciona a cambios via `observer`.
