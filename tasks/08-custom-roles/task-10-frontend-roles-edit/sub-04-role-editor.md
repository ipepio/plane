# Sub-04 — `RoleEditor` (header + save)

**Task:** 10 · **Tamaño:** M

## Cambio

Componente integrador con header editable + matriz + footer save/discard.

## Cómo

`apps/web/core/components/roles/role-editor.tsx`:

```tsx
"use client";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import { useRoleStore } from "@/hooks/store";
import { PermissionMatrix } from "./permission-matrix";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const RoleEditor = observer(({ workspaceSlug, roleId }: { workspaceSlug: string; roleId: string }) => {
  const store = useRoleStore();
  const detail = store.detailByWorkspace.get(workspaceSlug)?.get(roleId);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const initial = useMemo(
    () => ({
      name: detail?.name ?? "",
      description: detail?.description ?? "",
      codes: new Set(detail?.permissions.map((p) => p.code) ?? []),
    }),
    [detail],
  );

  useEffect(() => { store.fetchOne(workspaceSlug, roleId); }, [workspaceSlug, roleId]);
  useEffect(() => {
    if (detail) {
      setName(detail.name);
      setDescription(detail.description);
      setSelected(new Set(detail.permissions.map((p) => p.code)));
    }
  }, [detail?.id]);

  const dirty =
    name !== initial.name ||
    description !== initial.description ||
    selected.size !== initial.codes.size ||
    [...selected].some((c) => !initial.codes.has(c));

  useUnsavedChangesWarning(dirty);

  if (!detail) return <div>Loading…</div>;
  const isSystem = detail.is_system;

  const save = async () => {
    setSaving(true);
    try {
      if (name !== initial.name || description !== initial.description) {
        await store.update(workspaceSlug, roleId, { name, description });
      }
      const codesChanged =
        selected.size !== initial.codes.size ||
        [...selected].some((c) => !initial.codes.has(c));
      if (codesChanged) {
        await store.setPermissions(workspaceSlug, roleId, [...selected]);
      }
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    setName(initial.name);
    setDescription(initial.description);
    setSelected(new Set(initial.codes));
  };

  return (
    <div className="p-6 space-y-4">
      {isSystem && (
        <div className="border-l-4 border-yellow-500 bg-yellow-50 p-3">
          This is a system role and cannot be modified.
        </div>
      )}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSystem}
        className="text-xl font-semibold w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSystem}
        className="w-full"
      />
      <PermissionMatrix selected={selected} onChange={setSelected} readOnly={isSystem} />
      <footer className="sticky bottom-0 bg-background border-t p-3 flex gap-2 justify-end">
        <button onClick={discard} disabled={!dirty || saving}>Discard</button>
        <button onClick={save} disabled={!dirty || saving || isSystem}>Save</button>
      </footer>
    </div>
  );
});
```

## Aceptación

- [ ] Cargar detalle inicial pinta name/description/permisos correctos.
- [ ] Save dispara update y setPermissions solo si hay cambios.
- [ ] Discard restaura al estado inicial.
- [ ] Footer sticky en pantallas largas.
