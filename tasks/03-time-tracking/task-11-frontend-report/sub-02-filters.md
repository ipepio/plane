# Sub-02 — Filtros

**Task:** 11 · **Tamaño:** M

## Cambio

```tsx
export const ReportFilters: FC = observer(() => {
  const { worklogStore, memberStore, projectStore } = useStores();
  const f = worklogStore.filters;

  return (
    <div className="grid grid-cols-5 gap-3">
      <DateRangePicker
        from={f.from}
        to={f.to}
        onChange={(from, to) => {
          worklogStore.setFilter("from", from);
          worklogStore.setFilter("to", to);
        }}
        presets={["this-week","last-week","this-month","last-month"]}
      />
      <MultiSelect
        label="Users"
        options={memberStore.workspaceMembers}
        value={f.user ?? []}
        onChange={v => worklogStore.setFilter("user", v)}
      />
      <MultiSelect
        label="Projects"
        options={projectStore.workspaceProjects}
        value={f.project ?? []}
        onChange={v => worklogStore.setFilter("project", v)}
      />
      <Select
        label="Billable"
        options={[{value:"",label:"All"},{value:"true",label:"Billable"},{value:"false",label:"Non-billable"}]}
        value={f.billable === undefined ? "" : String(f.billable)}
        onChange={v => worklogStore.setFilter("billable", v === "" ? undefined : v === "true")}
      />
      <Select
        label="Group by"
        options={[{value:"",label:"None"},{value:"day",label:"Day"},{value:"week",label:"Week"},{value:"month",label:"Month"},{value:"user",label:"User"},{value:"project",label:"Project"}]}
        value={f.group_by ?? ""}
        onChange={v => worklogStore.setFilter("group_by", v || undefined)}
      />
    </div>
  );
});
```

## Aceptación

- [ ] Cambio de cualquier filtro dispara refetch.
