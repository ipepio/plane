# Sub-02 — `TeamsListPage`

**Task:** 09 · **Tamaño:** M

## Cambio

```tsx
// apps/web/app/[workspaceSlug]/settings/teams/page.tsx
"use client";
import { observer } from "mobx-react";
import { useTeamStore } from "@/store/team.store";

export default observer(function TeamsListPage({ params }: { params: { workspaceSlug: string } }) {
  const store = useTeamStore();
  useEffect(() => { store.fetchAll(params.workspaceSlug); }, [params.workspaceSlug]);

  const teams = Array.from(store.teams.values());
  return (
    <Page title="Teams">
      <Toolbar>
        <Button onClick={() => openCreateModal()}>New team</Button>
      </Toolbar>
      <Table
        columns={[
          { header: "Name", cell: (t) => <Link href={`teams/${t.id}`}>{t.name}</Link> },
          { header: "Members", cell: (t) => t.member_count },
          { header: "Created", cell: (t) => formatDate(t.created_at) },
          { header: "", cell: (t) => <KebabMenu team={t} /> },
        ]}
        rows={teams}
      />
    </Page>
  );
});
```

## Aceptación

- [ ] Lista renderiza con member_count.
- [ ] Click en team → navega a detalle.
- [ ] Botón "New team" abre modal.
