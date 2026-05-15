# Sub-03 — Build pass + smoke import

**Task:** 08 · **Tamaño:** XS

## Cambio

Validar que types y service compilan limpio y son importables desde apps consumer.

## Cómo

```bash
pnpm --filter @plane/types check:types
pnpm --filter @plane/services check:types
pnpm --filter web check:types
```

Smoke test rápido — añadir y luego revertir un import en `apps/web/core/services/index.ts`:

```typescript
import { RoleService } from "@plane/services";  // type-check only
```

## Aceptación

- [ ] Los 3 `check:types` pasan sin warnings.
- [ ] El import smoke compila.
