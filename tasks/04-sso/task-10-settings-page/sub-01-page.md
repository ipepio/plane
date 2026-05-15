# Sub-01 — Page + gating

**Task:** 10 · **Tamaño:** S

## Cambio

```tsx
"use client";

export default observer(function SSOSettingsPage() {
  const { workspaceSSOStore, userPermissions } = useStores();
  const { workspaceSlug } = useParams();

  if (!userPermissions.isWorkspaceAdmin(workspaceSlug)) {
    return <ForbiddenView />;
  }

  useEffect(() => { workspaceSSOStore.fetch(workspaceSlug); }, [workspaceSlug]);

  return (
    <div>
      <h1 className="text-xl font-semibold">SSO (Google Workspace)</h1>
      <p className="text-sm text-muted">Restrict login to specific Google Workspace domains.</p>
      <SSOForm />
    </div>
  );
});
```

## Aceptación

- [ ] Non-admin no ve la pantalla.
