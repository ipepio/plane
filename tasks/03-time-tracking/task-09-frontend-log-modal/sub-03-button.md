# Sub-03 — Botón con permiso

**Task:** 09 · **Tamaño:** XS

## Cambio

```tsx
export const LogTimeButton: FC<{ issueId: string; projectId: string }> = ({ issueId, projectId }) => {
  const canLog = useUserPermissions().hasPermission("worklog.create_self");  // épica 08
  const [open, setOpen] = useState(false);
  if (!canLog) return null;
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>Log time</Button>
      <LogTimeModal isOpen={open} onClose={() => setOpen(false)} issueId={issueId} projectId={projectId} />
    </>
  );
};
```

## Aceptación

- [ ] Guest sin permiso no ve el botón.
