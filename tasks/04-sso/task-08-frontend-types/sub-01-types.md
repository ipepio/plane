# Sub-01 — Types

**Task:** 08 · **Tamaño:** XS

## Cambio

```ts
// packages/types/src/workspace/sso.ts
export type TWorkspaceSSORole = 5 | 15 | 20;

export type TWorkspaceSSOConfig = {
  enabled: boolean;
  allowed_domains: string[];
  auto_provision_role: TWorkspaceSSORole;
  created_at?: string;
  updated_at?: string;
};

export type TWorkspaceSSOPatch = Partial<TWorkspaceSSOConfig>;
```

## Aceptación

- [ ] Exportado desde `@plane/types`.
