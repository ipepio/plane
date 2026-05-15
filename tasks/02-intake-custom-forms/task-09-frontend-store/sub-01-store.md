# Sub-01 — `IntakeFormStore`

**Task:** 09 · **Tamaño:** S

## Cambio

```ts
export class IntakeFormStore {
  fieldsByIntake = new Map<string, TIntakeFormField[]>();
  optionsByField = new Map<string, TIntakeFormFieldOption[]>();
  private service = new IntakeFormService();

  async fetchFields(ws, intakeId) { ... }
  async createField(...) { ... }
  async updateField(...) { ... }
  async destroyField(...) { ... }
  async reorderFields(ws, intakeId, order) { ... }

  async fetchOptions(ws, intakeId, fieldId) { ... }
  async createOption(...) { ... }
}
```

## Aceptación

- [ ] CRUD reactivo en UI.
