# Sub-01 — Ruta + layout

**Task:** 11 · **Tamaño:** S

## Cambio

```tsx
// apps/web/app/[workspaceSlug]/settings/reports/time-tracking/page.tsx
"use client";

export default observer(function TimeTrackingReportPage() {
  const { worklogStore } = useStores();
  const { workspaceSlug } = useParams();

  useEffect(() => {
    worklogStore.fetchReport(workspaceSlug);
  }, [workspaceSlug, JSON.stringify(worklogStore.filters)]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Time tracking</h1>
        <ExportCsvButton />
      </header>
      <ReportFilters />
      {worklogStore.filters.group_by
        ? <ReportChart />
        : <ReportTable />}
    </div>
  );
});
```

## Aceptación

- [ ] Ruta navegable.
- [ ] Refetch al cambiar filtros.
