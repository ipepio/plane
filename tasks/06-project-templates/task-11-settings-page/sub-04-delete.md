# Sub-04 — Delete confirm

**Task:** 11 · **Tamaño:** XS

## Cambio

```tsx
export const DeleteConfirm: FC<{ isOpen: boolean; onClose: () => void; tpl: TProjectTemplateSummary }> = observer(
  ({ isOpen, onClose, tpl }) => {
    const { projectTemplateStore } = useStores();
    const { workspaceSlug } = useParams();
    const remove = async () => {
      await projectTemplateStore.remove(workspaceSlug, tpl.id);
      onClose();
    };
    return (
      <ConfirmDialog open={isOpen} onClose={onClose}
        title={`Delete "${tpl.name}"?`}
        description="Existing projects created from this template will not be affected."
        onConfirm={remove}
        confirmText="Delete"
        danger
      />
    );
  }
);
```

## Aceptación

- [ ] Confirmar elimina y actualiza UI.
