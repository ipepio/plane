# Sub-02 — `IssuePropertyValueStore`

**Task:** 09 · **Tamaño:** M

## Cambio

```ts
export class IssuePropertyValueStore {
  byIssue = new Map<string, TIssuePropertyValue[]>();
  private service = new IssuePropertyService();

  async fetchValues(ws: string, project: string, issueId: string) { ... }

  async setValue(ws: string, project: string, issueId: string, propertyId: string, value: any) {
    await this.service.setValues(ws, project, issueId, [{ property: propertyId, value }]);
    await this.fetchValues(ws, project, issueId);  // simple invalidación
  }
}
```

## Aceptación

- [ ] Cambio de value refleja en UI sin recarga manual.
