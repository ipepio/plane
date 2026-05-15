# Sub-02 — Componente `RolesList`

**Task:** 09 · **Tamaño:** S

## Cambio

Tabla observada con avatar/badge, columnas y acciones.

## Cómo

`apps/web/core/components/roles/roles-list.tsx`:

```tsx
"use client";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useRoleStore } from "@/hooks/store";
import type { TRole } from "@plane/types";

export const RolesList = observer(({ workspaceSlug }: { workspaceSlug: string }) => {
  const store = useRoleStore();
  const [confirmDelete, setConfirmDelete] = useState<TRole | null>(null);

  useEffect(() => { store.fetchAll(workspaceSlug); }, [workspaceSlug]);

  const roles = store.list(workspaceSlug);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr><th>Name</th><th>Description</th><th>Members</th><th /></tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id}>
              <td>
                {r.name}
                {r.is_system && <span className="ml-2 badge">System</span>}
              </td>
              <td className="truncate max-w-md">{r.description}</td>
              <td>{r.members_count}</td>
              <td>
                <a href={`/${workspaceSlug}/settings/roles/${r.id}`}>Edit</a>
                <button
                  disabled={r.is_system}
                  onClick={() => setConfirmDelete(r)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {confirmDelete && (
        <ConfirmModal
          onConfirm={async () => { await store.destroy(workspaceSlug, confirmDelete.id); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
          message={`Delete role "${confirmDelete.name}"?`}
        />
      )}
    </div>
  );
});
```

Usar componentes ya existentes del paquete `@plane/ui` para Table/Badge/Button/Modal cuando aplique.

## Aceptación

- [ ] La tabla refleja en vivo cambios del store.
- [ ] Botón Delete deshabilitado en roles del sistema.
- [ ] Confirmación antes de eliminar.
