# Sub-03 — `PermissionMatrix` componente

**Task:** 10 · **Tamaño:** M

## Cambio

Componente presentacional que renderiza acordeones por categoría con checkboxes.

## Cómo

`apps/web/core/components/roles/permission-matrix.tsx`:

```tsx
"use client";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { usePermissionStore } from "@/hooks/store";
import type { TPermission } from "@plane/types";

type Props = {
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  readOnly?: boolean;
};

export const PermissionMatrix = observer(({ selected, onChange, readOnly = false }: Props) => {
  const store = usePermissionStore();
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    return JSON.parse(sessionStorage.getItem("perm-matrix-open") ?? "{}");
  });

  useEffect(() => { store.ensureLoaded(); }, []);
  useEffect(() => {
    if (typeof window !== "undefined") sessionStorage.setItem("perm-matrix-open", JSON.stringify(open));
  }, [open]);

  if (!store.loaded) return <div>Loading…</div>;

  const grouped = store.byCategory();
  const toggle = (code: string) => {
    if (readOnly) return;
    const next = new Set(selected);
    next.has(code) ? next.delete(code) : next.add(code);
    onChange(next);
  };

  const toggleCategory = (codes: string[], select: boolean) => {
    if (readOnly) return;
    const next = new Set(selected);
    codes.forEach((c) => (select ? next.add(c) : next.delete(c)));
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {Object.entries(grouped).map(([cat, perms]) => {
        const allCodes = perms.map((p) => p.code);
        const allOn = allCodes.every((c) => selected.has(c));
        return (
          <section key={cat} className="border rounded">
            <header
              className="flex justify-between p-3 cursor-pointer"
              onClick={() => setOpen({ ...open, [cat]: !open[cat] })}
            >
              <strong className="capitalize">{cat}</strong>
              <div onClick={(e) => e.stopPropagation()}>
                <button disabled={readOnly} onClick={() => toggleCategory(allCodes, !allOn)}>
                  {allOn ? "Deselect all" : "Select all"}
                </button>
              </div>
            </header>
            {open[cat] && (
              <ul className="p-3 space-y-1">
                {perms.map((p) => (
                  <li key={p.code}>
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selected.has(p.code)}
                        disabled={readOnly}
                        onChange={() => toggle(p.code)}
                      />
                      <div>
                        <div>{p.name}</div>
                        {p.description && <div className="text-xs opacity-70">{p.description}</div>}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
});
```

## Aceptación

- [ ] Grupos plegables con persistencia en sessionStorage.
- [ ] Select all / Deselect all afecta solo a la categoría.
- [ ] `readOnly=true` deshabilita todos los inputs.
- [ ] El `onChange` se llama con un `Set` nuevo (no mutación).
