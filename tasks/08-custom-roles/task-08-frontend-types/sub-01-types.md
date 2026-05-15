# Sub-01 — Tipos TS

**Task:** 08 · **Tamaño:** XS

## Cambio

Definir contratos TS reflejando los serializers del backend.

## Cómo

`packages/types/src/role.ts`:

```typescript
export type TPermissionCategory =
  | "workspace" | "project" | "issue" | "intake" | "worklog" | "template" | "team";

export type TPermission = {
  id: string;
  code: string;
  name: string;
  description: string;
  category: TPermissionCategory;
};

export type TRole = {
  id: string;
  workspace: string;
  name: string;
  description: string;
  is_system: boolean;
  level: number | null;
  members_count: number;
};

export type TRoleDetail = TRole & {
  permissions: TPermission[];
};

export type TRolePayload = Partial<Pick<TRole, "name" | "description">>;
```

Export en `packages/types/src/index.ts`:

```typescript
export * from "./role";
```

## Aceptación

- [ ] `pnpm --filter @plane/types check:types` pasa sin warnings.
- [ ] `import { TRole } from "@plane/types"` resuelve en cualquier app del monorepo.
