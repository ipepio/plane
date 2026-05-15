# Sub-03 — Modal de creación de rol

**Task:** 09 · **Tamaño:** S

## Cambio

Modal con formulario `name` + `description`, valida en cliente y llama al store.

## Cómo

`apps/web/core/components/roles/create-role-modal.tsx`:

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRoleStore } from "@/hooks/store";

export const CreateRoleModal = ({
  open,
  onClose,
  workspaceSlug,
}: {
  open: boolean;
  onClose: () => void;
  workspaceSlug: string;
}) => {
  const store = useRoleStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const role = await store.create(workspaceSlug, { name: name.trim(), description });
      onClose();
      router.push(`/${workspaceSlug}/settings/roles/${role.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Role name" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button disabled={submitting || !name.trim()} onClick={submit}>Create</button>
    </Modal>
  );
};
```

## Aceptación

- [ ] No envía con `name` vacío o solo espacios.
- [ ] Tras crear, navega al editor del rol.
- [ ] Estado disabled del botón mientras está enviando.
