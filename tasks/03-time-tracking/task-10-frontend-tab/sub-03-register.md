# Sub-03 — Registrar tab + badge

**Task:** 10 · **Tamaño:** XS

## Cambio

En el componente que orquesta los tabs del issue (típicamente `issue-detail-tabs.tsx` o similar):

```tsx
const total = worklogStore.totalSecondsByIssue(issueId);
const tabs = [
  ...existingTabs,
  {
    key: "worklog",
    label: "Worklog",
    badge: total ? formatSeconds(total) : null,
    content: <WorklogTab issueId={issueId} projectId={projectId} />,
  },
];
```

## Aceptación

- [ ] Tab visible con badge cuando hay entradas.
