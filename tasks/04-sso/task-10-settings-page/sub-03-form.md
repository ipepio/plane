# Sub-03 — Formulario completo

**Task:** 10 · **Tamaño:** S

## Cambio

```tsx
export const SSOForm: FC = observer(() => {
  const { workspaceSSOStore } = useStores();
  const { workspaceSlug } = useParams();
  const cfg = workspaceSSOStore.config(workspaceSlug);

  const [enabled, setEnabled] = useState(cfg.enabled);
  const [domains, setDomains] = useState<string[]>(cfg.allowed_domains);
  const [role, setRole] = useState<TWorkspaceSSORole>(cfg.auto_provision_role);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setEnabled(cfg.enabled); setDomains(cfg.allowed_domains); setRole(cfg.auto_provision_role);
  }, [cfg.enabled, cfg.allowed_domains.join(","), cfg.auto_provision_role]);

  const canSave = !enabled || domains.length > 0;

  const save = async () => {
    setBusy(true);
    try {
      await workspaceSSOStore.update(workspaceSlug, {
        enabled, allowed_domains: domains, auto_provision_role: role,
      });
      toast.success("SSO settings saved");
    } finally { setBusy(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      <Switch checked={enabled} onChange={setEnabled} label="Enable SSO" />
      <div>
        <Label>Allowed domains</Label>
        <DomainListInput value={domains} onChange={setDomains} />
      </div>
      <div>
        <Label>Auto-provision role</Label>
        <Select value={String(role)} onChange={v => setRole(+v as TWorkspaceSSORole)}
                options={[{value:"5",label:"Guest"},{value:"15",label:"Member"},{value:"20",label:"Admin"}]} />
      </div>
      <Button onClick={save} disabled={!canSave || busy} loading={busy}>Save</Button>
    </div>
  );
});
```

## Aceptación

- [ ] Disabled mientras no haya dominios y enabled=true.
