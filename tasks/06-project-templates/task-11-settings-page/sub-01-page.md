# Sub-01 — Page + lista

**Task:** 11 · **Tamaño:** S

## Cambio

```tsx
"use client";

export default observer(function TemplatesSettingsPage() {
  const { projectTemplateStore } = useStores();
  const { workspaceSlug } = useParams();

  useEffect(() => { projectTemplateStore.fetch(workspaceSlug); }, [workspaceSlug]);

  return (
    <div>
      <header className="flex justify-between">
        <h1>Project templates</h1>
      </header>
      <TemplatesList />
    </div>
  );
});
```

## Aceptación

- [ ] Carga al montar.
