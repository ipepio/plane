# Sub-04 — Página `/[workspaceSlug]/settings/roles`

**Task:** 09 · **Tamaño:** XS

## Cambio

Página Next.js que monta el header + lista + modal.

## Cómo

`apps/web/app/[workspaceSlug]/settings/roles/page.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { RolesList } from "@/components/roles/roles-list";
import { CreateRoleModal } from "@/components/roles/create-role-modal";

export default function RolesPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [creating, setCreating] = useState(false);

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Roles</h1>
        <button onClick={() => setCreating(true)}>New role</button>
      </header>
      <RolesList workspaceSlug={workspaceSlug} />
      <CreateRoleModal open={creating} onClose={() => setCreating(false)} workspaceSlug={workspaceSlug} />
    </div>
  );
}
```

## Aceptación

- [ ] Ruta accesible navegando a `/[slug]/settings/roles`.
- [ ] Botón "New role" abre el modal.
