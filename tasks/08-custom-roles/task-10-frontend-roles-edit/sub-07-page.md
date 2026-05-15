# Sub-07 — Página `/settings/roles/[roleId]`

**Task:** 10 · **Tamaño:** XS

## Cambio

Wrapper Next.js que monta el editor con guard de permiso.

## Cómo

`apps/web/app/[workspaceSlug]/settings/roles/[roleId]/page.tsx`:

```tsx
"use client";
import { notFound, useParams } from "next/navigation";
import { RoleEditor } from "@/components/roles/role-editor";
import { usePermission } from "@/hooks/use-permission";

export default function RoleEditorPage() {
  const { workspaceSlug, roleId } = useParams<{ workspaceSlug: string; roleId: string }>();
  const canManage = usePermission(workspaceSlug, "workspace.manage_roles");
  if (!canManage) notFound();
  return <RoleEditor workspaceSlug={workspaceSlug} roleId={roleId} />;
}
```

## Aceptación

- [ ] Ruta `/settings/roles/{id}` renderiza el editor.
- [ ] Sin permiso → 404.
- [ ] Carga el rol vía store al montarse.
