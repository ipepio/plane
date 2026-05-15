# Sub-01 — Types

**Task:** 08 · **Tamaño:** XS

## Cambio

```ts
export type TIntakeFormFieldType =
  | "short_text" | "long_text" | "number" | "date" | "boolean"
  | "select" | "multi_select" | "file" | "user";

export type TIntakeFormField = {
  id: string; workspace_intake: string | null; intake: string | null;
  label: string; placeholder: string; help_text: string;
  type: TIntakeFormFieldType; config: Record<string, unknown>;
  is_required: boolean; is_active: boolean; relative_order: number;
};

export type TIntakeFormFieldOption = {
  id: string; field: string; name: string; relative_order: number; is_active: boolean;
};

export type TIntakeFormFieldValue = {
  id: string; field: string; value: any;
};
```

## Aceptación

- [ ] Exportados.
