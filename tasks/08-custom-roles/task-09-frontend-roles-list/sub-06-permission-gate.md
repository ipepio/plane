# Sub-06 — Permission gate del usuario actual

**Task:** 09 · **Tamaño:** S

## Cambio

Hook `usePermission(code)` que consulta el endpoint de permisos del usuario actual y cachea en MobX.

## Cómo

Backend (mínimo necesario para esta sub-tarea): exponer endpoint:

```
GET /api/v1/workspaces/{slug}/me/permissions/  → { codes: ["issue.create", ...] }
```

(Si task-12 aún no lo creó, implementarlo aquí: 5 líneas en `apps/api/plane/app/views/me.py`.)

Frontend `apps/web/core/hooks/use-permission.ts`:

```typescript
import { useEffect } from "react";
import { useUserPermissionStore } from "@/hooks/store";

export function usePermission(workspaceSlug: string | undefined, code: string): boolean {
  const store = useUserPermissionStore();
  useEffect(() => {
    if (workspaceSlug) store.ensureLoaded(workspaceSlug);
  }, [workspaceSlug]);
  return workspaceSlug ? store.has(workspaceSlug, code) : false;
}
```

`UserPermissionStore` mantiene `Map<workspaceSlug, Set<code>>` y `ensureLoaded` hace fetch una sola vez.

Server guard: en `RolesPage` envolver con:

```tsx
const canManage = usePermission(workspaceSlug, "workspace.manage_roles");
if (!canManage) return notFound();
```

## Aceptación

- [ ] Usuario Admin entra y ve la página.
- [ ] Usuario Guest navegando a la URL recibe 404 del Next.js.
- [ ] El endpoint de me/permissions cachea (no se llama en cada navegación dentro del workspace).
