# Sub-02 — WorklogRow con acciones

**Task:** 10 · **Tamaño:** S

## Cambio

```tsx
export const WorklogRow: FC<{ w: TWorklog; projectId: string }> = observer(({ w, projectId }) => {
  const { worklogStore, userStore } = useStores();
  const { workspaceSlug } = useParams();
  const me = userStore.currentUser?.id;
  const canEdit = w.logged_by === me;  // backend reforzará

  const remove = () => worklogStore.remove(workspaceSlug, projectId, w.issue, w.id);

  return (
    <div className="flex items-center gap-3 py-2 border-b">
      <Avatar userId={w.logged_by} />
      <div className="flex-1">
        <div className="text-sm">
          {formatSeconds(w.duration)} {w.is_billable ? "" : "(non-billable)"} ·{" "}
          <time>{format(new Date(w.started_at), "MMM d, HH:mm")}</time>
        </div>
        {w.description && <p className="text-xs text-muted">{w.description}</p>}
      </div>
      {canEdit && (
        <Dropdown>
          <DropdownItem onClick={() => /* open edit modal */}>Edit</DropdownItem>
          <DropdownItem onClick={remove} className="text-red-500">Delete</DropdownItem>
        </Dropdown>
      )}
    </div>
  );
});
```

## Aceptación

- [ ] Row solo permite acciones al owner.
