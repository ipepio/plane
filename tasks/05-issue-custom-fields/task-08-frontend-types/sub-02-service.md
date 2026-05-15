# Sub-02 — `IssuePropertyService`

**Task:** 08 · **Tamaño:** S

## Cambio

```ts
export class IssuePropertyService extends APIService {
  listProperties(ws, project, issueType) { ... }
  createProperty(ws, project, issueType, payload) { ... }
  updateProperty(ws, project, issueType, id, payload) { ... }
  destroyProperty(ws, project, issueType, id) { ... }
  listOptions(ws, project, issueType, propId) { ... }
  createOption(...) { ... }
  reorderOptions(...) { ... }
  getValues(ws, project, issueId) { ... }
  setValues(ws, project, issueId, values: { property: string; value: any }[]) { ... }
}
```

## Aceptación

- [ ] Todos los métodos compilan.
