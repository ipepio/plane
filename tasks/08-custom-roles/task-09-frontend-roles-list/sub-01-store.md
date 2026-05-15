# Sub-01 — `RoleStore` MobX

**Task:** 09 · **Tamaño:** S

## Cambio

Store siguiendo el patrón existente del repo (verificar otros stores en `apps/web/core/store/` antes).

## Cómo

`apps/web/core/store/roles/role.store.ts`:

```typescript
import { action, makeObservable, observable, runInAction } from "mobx";
import { RoleService } from "@plane/services";
import type { TRole, TRoleDetail, TRolePayload } from "@plane/types";

export class RoleStore {
  rolesByWorkspace: Map<string, Map<string, TRole>> = new Map();
  loading = false;
  service = new RoleService();

  constructor() {
    makeObservable(this, {
      rolesByWorkspace: observable,
      loading: observable,
      fetchAll: action,
      create: action,
      destroy: action,
    });
  }

  list(workspaceSlug: string): TRole[] {
    return Array.from(this.rolesByWorkspace.get(workspaceSlug)?.values() ?? []);
  }

  async fetchAll(workspaceSlug: string) {
    this.loading = true;
    try {
      const items = await this.service.list(workspaceSlug);
      runInAction(() => {
        this.rolesByWorkspace.set(workspaceSlug, new Map(items.map((r) => [r.id, r])));
      });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  async create(workspaceSlug: string, payload: TRolePayload): Promise<TRole> {
    const role = await this.service.create(workspaceSlug, payload);
    runInAction(() => {
      this.rolesByWorkspace.get(workspaceSlug)?.set(role.id, role);
    });
    return role;
  }

  async destroy(workspaceSlug: string, roleId: string) {
    await this.service.destroy(workspaceSlug, roleId);
    runInAction(() => {
      this.rolesByWorkspace.get(workspaceSlug)?.delete(roleId);
    });
  }
}
```

Registrar en el RootStore.

## Aceptación

- [ ] Acceso reactivo: cambios en `rolesByWorkspace` re-renderan componentes que lo leen.
- [ ] No hace doble fetch si los datos ya existen (opcional: añadir `force` flag).
