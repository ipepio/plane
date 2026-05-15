# Sub-02 — `IntakeFormService`

**Task:** 08 · **Tamaño:** S

## Cambio

```ts
export class IntakeFormService extends APIService {
  listFields(ws, intakeId) { ... }
  createField(ws, intakeId, payload) { ... }
  updateField(ws, intakeId, id, payload) { ... }
  destroyField(ws, intakeId, id) { ... }
  reorderFields(ws, intakeId, order) { ... }

  listOptions(ws, intakeId, fieldId) { ... }
  createOption(...) { ... }

  uploadFile(ws, intakeId, file: File) { ... }  // devuelve { asset_url }
}
```

## Aceptación

- [ ] Métodos compilan.
