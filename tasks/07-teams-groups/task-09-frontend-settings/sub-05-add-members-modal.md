# Sub-05 — `AddTeamMembersModal`

**Task:** 09 · **Tamaño:** S

## Cambio

Modal con multi-select de workspace members (filtra los que ya están en el team) + role default `member`.

```tsx
<MultiSelect
  options={workspaceMembers.filter(m => !alreadyInTeam.has(m.id))}
  value={selected}
  onChange={setSelected}
/>
<Select value={role} onChange={setRole} options={[{value:"member"},{value:"lead"}]} />
<Button onClick={async () => {
  await store.addMembers(workspaceSlug, teamId, selected.map(m => ({ member: m.id, role })));
}}>Add</Button>
```

## Aceptación

- [ ] No muestra users ya en team.
- [ ] Añade en bulk y refresca la tabla.
