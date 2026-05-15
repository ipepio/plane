# Task 08 — Tipos TS de Role / Permission + service

**Épica:** 08 — Custom Roles · **Depende de:** — (puede ir en paralelo con backend) · **Tamaño:** S

## Contexto

Contrato cliente-servidor en TypeScript. Sin esto, el frontend (tasks 09 y 10) no puede consumir los endpoints con tipos.

## Diseño

- Tipos en `packages/types/src/role.ts`.
- Servicio HTTP en `packages/services/src/role.service.ts` extendiendo el `APIService` base existente.

## Archivos afectados

- `packages/types/src/role.ts` (nuevo)
- `packages/types/src/index.ts` (export)
- `packages/services/src/role.service.ts` (nuevo)
- `packages/services/src/index.ts` (export si aplica)

## Aceptación

- [ ] `pnpm --filter @plane/types check:types` pasa.
- [ ] `pnpm --filter @plane/services check:types` pasa.
- [ ] Importable desde `apps/web` como `import { RoleService } from "@plane/services"`.

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Tipos `TPermission`, `TRole`, `TRolePayload`](sub-01-types.md) | XS |
| 02 | [`RoleService`](sub-02-service.md) | S |
| 03 | [Build pass + smoke import](sub-03-build-check.md) | XS |
