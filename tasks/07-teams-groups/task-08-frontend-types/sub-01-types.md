# Sub-01 — Types

**Task:** 08 · **Tamaño:** XS

## Cambio

```ts
// packages/types/src/team.ts
export type TTeamRole = "lead" | "member";

export type TTeam = {
  id: string;
  name: string;
  description: string;
  logo_props: Record<string, unknown>;
  workspace: string;
  member_count: number;
  created_at: string;
  updated_at: string;
};

export type TTeamMember = {
  id: string;
  team: string;
  member: string;
  member_detail: { id: string; display_name: string; email: string; avatar_url: string };
  role: TTeamRole;
  created_at: string;
};

export type TTeamDetail = TTeam & { members: TTeamMember[] };
```

Y exportar desde `packages/types/src/index.ts`.

## Aceptación

- [ ] `tsc --noEmit` pasa.
- [ ] Types disponibles en `@plane/types`.
