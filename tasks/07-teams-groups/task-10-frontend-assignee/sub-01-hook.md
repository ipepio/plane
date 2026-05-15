# Sub-01 — Hook `useAssignableEntities`

**Task:** 10 · **Tamaño:** S

## Cambio

```ts
export function useAssignableEntities(workspaceSlug: string, projectId?: string) {
  const memberStore = useWorkspaceMemberStore();
  const teamStore = useTeamStore();
  // Trigger lazy fetch
  useEffect(() => { teamStore.fetchAll(workspaceSlug); }, [workspaceSlug]);

  return {
    users: memberStore.getMembers(workspaceSlug),
    teams: Array.from(teamStore.teams.values()),
  };
}
```

## Aceptación

- [ ] Devuelve users y teams disponibles.
- [ ] Cachea: no llama API si ya cargado.
