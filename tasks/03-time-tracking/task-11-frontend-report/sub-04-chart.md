# Sub-04 — Gráfico agrupado

**Task:** 11 · **Tamaño:** M

## Cambio

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const ReportChart: FC = observer(() => {
  const { worklogStore } = useStores();
  const data = ((worklogStore.report ?? []) as TWorklogAggregate[]).map(d => ({
    key: typeof d.key === "string" && d.key.includes("T")
      ? format(new Date(d.key), "MMM d")
      : String(d.key),
    hours: +(d.total_seconds / 3600).toFixed(2),
    billable: +(d.billable_seconds / 3600).toFixed(2),
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <XAxis dataKey="key" />
        <YAxis unit="h" />
        <Tooltip />
        <Bar dataKey="hours" stackId="a" fill="#888" />
        <Bar dataKey="billable" stackId="a" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
});
```

## Aceptación

- [ ] Gráfico se actualiza al cambiar group_by.
