# Task 08 — Frontend types + service

**Épica:** 07 · **Tamaño:** S

## Contexto

Antes de poner stores/UI, definir el contrato TypeScript y el service de fetch.

## Diseño

- `packages/types/src/team.ts`: `TTeam`, `TTeamDetail`, `TTeamMember`, `TTeamRole`.
- `packages/services/src/team.service.ts`: `TeamService` con métodos `list`, `retrieve`, `create`, `update`, `destroy`, `addMembers`, `removeMember`, `updateMember`, `search`.

## Aceptación

- [ ] `import { TTeam } from "@plane/types"` funciona.
- [ ] `import { TeamService } from "@plane/services"` funciona.

## Sub-tareas

1. [sub-01 — Types](./sub-01-types.md)
2. [sub-02 — Service](./sub-02-service.md)
