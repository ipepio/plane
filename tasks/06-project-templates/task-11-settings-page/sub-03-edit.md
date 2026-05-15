# Sub-03 — Edit modal

**Task:** 11 · **Tamaño:** S

## Cambio

```tsx
export const EditTemplateModal: FC<{ isOpen: boolean; onClose: () => void; tpl: TProjectTemplateSummary }> = observer(
  ({ isOpen, onClose, tpl }) => {
    const { projectTemplateStore } = useStores();
    const { workspaceSlug } = useParams();
    const [name, setName] = useState(tpl.name);
    const [description, setDescription] = useState(tpl.description);

    const submit = async () => {
      await projectTemplateStore.service.update(workspaceSlug, tpl.id, { name, description });
      runInAction(() => { projectTemplateStore.list[tpl.id] = { ...tpl, name, description }; });
      onClose();
    };

    return (
      <Dialog open={isOpen} onClose={onClose} title="Edit template">
        <Input value={name} onChange={e => setName(e.target.value)} />
        <Textarea value={description} onChange={e => setDescription(e.target.value)} />
        <Button onClick={submit}>Save</Button>
      </Dialog>
    );
  }
);
```

## Aceptación

- [ ] PATCH sin tocar payload.
