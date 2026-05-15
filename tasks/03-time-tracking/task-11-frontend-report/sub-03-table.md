# Sub-03 — Tabla lista

**Task:** 11 · **Tamaño:** S

## Cambio

```tsx
export const ReportTable: FC = observer(() => {
  const { worklogStore } = useStores();
  const rows = (worklogStore.report ?? []) as TWorklogReport[];

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th>Date</th><th>User</th><th>Project</th><th>Issue</th>
          <th>Duration</th><th>Billable</th><th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td>{format(new Date(r.started_at), "yyyy-MM-dd HH:mm")}</td>
            <td>{r.user_display_name}</td>
            <td>{r.project_name}</td>
            <td>{r.project_identifier}-{r.issue_sequence_id}</td>
            <td>{formatSeconds(r.duration)}</td>
            <td>{r.is_billable ? "✓" : ""}</td>
            <td>{r.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
```

## Aceptación

- [ ] Tabla muestra rows, vacía cuando sin datos.
