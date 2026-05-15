# Sub-02 — Row con acciones

**Task:** 11 · **Tamaño:** S

## Cambio

```tsx
export const TemplateRow: FC<{ tpl: TProjectTemplateSummary }> = observer(({ tpl }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 py-2 border-b">
      <div className="flex-1">
        <div className="font-medium">{tpl.name}</div>
        <div className="text-xs text-muted">{tpl.description}</div>
      </div>
      <span className="text-xs text-muted">{format(new Date(tpl.created_at), "yyyy-MM-dd")}</span>
      <Dropdown>
        <DropdownItem onClick={() => setEditOpen(true)}>Edit</DropdownItem>
        <DropdownItem onClick={() => setDelOpen(true)} className="text-red-500">Delete</DropdownItem>
      </Dropdown>
      <EditTemplateModal isOpen={editOpen} onClose={() => setEditOpen(false)} tpl={tpl} />
      <DeleteConfirm isOpen={delOpen} onClose={() => setDelOpen(false)} tpl={tpl} />
    </div>
  );
});
```

## Aceptación

- [ ] Acciones disparan modales.
