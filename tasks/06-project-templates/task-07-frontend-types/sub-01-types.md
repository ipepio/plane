# Sub-01 — TProjectTemplate

**Task:** 07 · **Tamaño:** XS

## Cambio

```ts
// packages/types/src/projects/template.ts
export type TProjectTemplateSummary = {
  id: string;
  name: string;
  description: string;
  icon_props: Record<string, any>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type TProjectTemplate = TProjectTemplateSummary & {
  payload: Record<string, any>;  // opaque snapshot
};

export type TInstantiatePayload = {
  name: string;
  identifier: string;
  vars: Record<string, string>;
};

export type TSaveAsTemplatePayload = {
  project: string;
  name: string;
  description?: string;
};
```

## Aceptación

- [ ] Exportados desde `@plane/types`.
