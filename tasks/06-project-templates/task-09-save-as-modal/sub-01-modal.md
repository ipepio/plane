# Sub-01 — Modal

**Task:** 09 · **Tamaño:** S

## Cambio

```tsx
export const SaveAsTemplateModal: FC<{ isOpen: boolean; onClose: () => void; projectId: string }> = observer(
  ({ isOpen, onClose, projectId }) => {
    const { projectTemplateStore } = useStores();
    const { workspaceSlug } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async () => {
      if (!name.trim()) return;
      setBusy(true);
      try {
        await projectTemplateStore.saveAs(workspaceSlug, { project: projectId, name, description });
        toast.success("Template saved", { action: { label: "View", onClick: () => router.push(`/${workspaceSlug}/settings/templates`) } });
        onClose();
      } finally { setBusy(false); }
    };

    return (
      <Dialog open={isOpen} onClose={onClose} title="Save as template">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Template name" />
        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" />
        <Button onClick={submit} loading={busy}>Save</Button>
      </Dialog>
    );
  }
);
```

## Aceptación

- [ ] Submit cierra modal y muestra toast con CTA.
