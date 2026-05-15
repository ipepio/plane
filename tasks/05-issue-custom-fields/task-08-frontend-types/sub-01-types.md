# Sub-01 — Types

**Task:** 08 · **Tamaño:** XS

## Cambio

```ts
// packages/types/src/issues/property.ts
export type TIssuePropertyType =
  | "text" | "long_text" | "number" | "date" | "boolean"
  | "select" | "multi_select" | "user" | "url";

export type TIssueProperty = {
  id: string; issue_type: string; name: string; display_name: string;
  type: TIssuePropertyType; config: Record<string, unknown>;
  is_required: boolean; is_active: boolean; relative_order: number;
};

export type TIssuePropertyOption = {
  id: string; property: string; name: string; color: string;
  relative_order: number; is_active: boolean;
};

export type TIssuePropertyValue = {
  id: string; issue: string; property: string;
  value: string | number | boolean | string[] | null;
};
```

## Aceptación

- [ ] Exportados desde `@plane/types`.
