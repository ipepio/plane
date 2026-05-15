# Sub-01 — Extender `RoleStore` con `fetchOne`, `update`, `setPermissions`

**Task:** 10 · **Tamaño:** S

## Cambio

Añadir métodos para detalle y persistencia.

## Cómo

En `apps/web/core/store/roles/role.store.ts`:

```typescript
detailByWorkspace: Map<string, Map<string, TRoleDetail>> = new Map();

async fetchOne(workspaceSlug: string, roleId: string): Promise<TRoleDetail> {
  const detail = await this.service.retrieve(workspaceSlug, roleId);
  runInAction(() => {
    if (!this.detailByWorkspace.has(workspaceSlug)) this.detailByWorkspace.set(workspaceSlug, new Map());
    this.detailByWorkspace.get(workspaceSlug)!.set(roleId, detail);
  });
  return detail;
}

async update(workspaceSlug: string, roleId: string, payload: TRolePayload) {
  const updated = await this.service.update(workspaceSlug, roleId, payload);
  runInAction(() => {
    this.rolesByWorkspace.get(workspaceSlug)?.set(roleId, updated);
    const detail = this.detailByWorkspace.get(workspaceSlug)?.get(roleId);
    if (detail) this.detailByWorkspace.get(workspaceSlug)!.set(roleId, { ...detail, ...updated });
  });
}

async setPermissions(workspaceSlug: string, roleId: string, codes: string[]) {
  await this.service.setPermissions(workspaceSlug, roleId, codes);
  // Refrescar detalle
  await this.fetchOne(workspaceSlug, roleId);
}
```

Añadir a `makeObservable`.

## Aceptación

- [ ] Tras `setPermissions` el detalle en memoria refleja los nuevos `permissions`.
- [ ] `update` modifica también la entrada en `rolesByWorkspace`.
