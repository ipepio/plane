# Sub-02 — Modal

**Task:** 09 · **Tamaño:** M

## Cambio

```tsx
export const LogTimeModal: FC<Props> = observer(({ isOpen, onClose, issueId, projectId }) => {
  const { worklogStore } = useStores();
  const { workspaceSlug } = useParams();
  const [durationInput, setDurationInput] = useState("");
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [description, setDescription] = useState("");
  const [billable, setBillable] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    const sec = parseDurationToSeconds(durationInput);
    if (!sec || sec <= 0) return setErr("Invalid duration");
    if (sec > 86400) return setErr("Max 24h per entry");

    await worklogStore.create(workspaceSlug, projectId, issueId, {
      duration: sec,
      started_at: new Date(startedAt).toISOString(),
      description,
      is_billable: billable,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Input placeholder="1h 30m / 90m / 1:30" value={durationInput} onChange={e => setDurationInput(e.target.value)} />
      <Input type="datetime-local" value={startedAt} onChange={e => setStartedAt(e.target.value)} />
      <Textarea value={description} onChange={e => setDescription(e.target.value)} />
      <Switch checked={billable} onChange={setBillable} label="Billable" />
      {err && <p className="text-red-500">{err}</p>}
      <Button onClick={submit}>Log time</Button>
    </Dialog>
  );
});
```

## Aceptación

- [ ] Submit válido cierra modal y añade al tab.
- [ ] Error visible si parser falla.
