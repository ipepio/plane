# Sub-01 — Tab container + fetch

**Task:** 10 · **Tamaño:** S

## Cambio

```tsx
export const WorklogTab: FC<{ issueId: string; projectId: string }> = observer(({ issueId, projectId }) => {
  const { worklogStore } = useStores();
  const { workspaceSlug } = useParams();
  const rows = worklogStore.byIssue[issueId] ?? [];

  useEffect(() => {
    worklogStore.fetchByIssue(workspaceSlug, projectId, issueId);
  }, [issueId]);

  const total = worklogStore.totalSecondsByIssue(issueId);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted">Total: {formatSeconds(total)}</div>
      {rows.length === 0 && <EmptyState label="No worklogs yet" />}
      {rows.map(w => <WorklogRow key={w.id} w={w} projectId={projectId} />)}
    </div>
  );
});
```

## Aceptación

- [ ] Tab se hidrata al abrir issue.
