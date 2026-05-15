# Sub-02 — `RoleService`

**Task:** 08 · **Tamaño:** S

## Cambio

Cliente HTTP siguiendo el patrón existente del repo (extender `APIService` o equivalente — verificar el patrón actual en `packages/services/src/`).

## Cómo

`packages/services/src/role.service.ts`:

```typescript
import { APIService } from "./api.service";
import type { TRole, TRoleDetail, TRolePayload } from "@plane/types";

export class RoleService extends APIService {
  constructor(baseUrl?: string) {
    super(baseUrl ?? "/");
  }

  list(workspaceSlug: string): Promise<TRole[]> {
    return this.get(`/api/v1/workspaces/${workspaceSlug}/roles/`).then((r) => r.data);
  }

  retrieve(workspaceSlug: string, roleId: string): Promise<TRoleDetail> {
    return this.get(`/api/v1/workspaces/${workspaceSlug}/roles/${roleId}/`).then((r) => r.data);
  }

  create(workspaceSlug: string, payload: TRolePayload): Promise<TRole> {
    return this.post(`/api/v1/workspaces/${workspaceSlug}/roles/`, payload).then((r) => r.data);
  }

  update(workspaceSlug: string, roleId: string, payload: TRolePayload): Promise<TRole> {
    return this.patch(`/api/v1/workspaces/${workspaceSlug}/roles/${roleId}/`, payload).then((r) => r.data);
  }

  destroy(workspaceSlug: string, roleId: string): Promise<void> {
    return this.delete(`/api/v1/workspaces/${workspaceSlug}/roles/${roleId}/`).then(() => undefined);
  }

  setPermissions(workspaceSlug: string, roleId: string, codes: string[]): Promise<void> {
    return this.put(`/api/v1/workspaces/${workspaceSlug}/roles/${roleId}/permissions/`, {
      permission_codes: codes,
    }).then(() => undefined);
  }

  getPermissions(workspaceSlug: string, roleId: string): Promise<string[]> {
    return this.get(`/api/v1/workspaces/${workspaceSlug}/roles/${roleId}/permissions/`)
      .then((r) => r.data.permission_codes);
  }
}
```

> **Antes de implementar**: confirmar el patrón base del proyecto (`APIService`, axios singleton, etc.) leyendo `packages/services/src/`.

## Aceptación

- [ ] Smoke desde `apps/web`: importar el servicio y llamar `list()` no rompe el build.
- [ ] Métodos tipan correctamente las promesas.
