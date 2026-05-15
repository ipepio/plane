# Sub-02 — Domain list input

**Task:** 10 · **Tamaño:** S

## Cambio

```tsx
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;

export const DomainListInput: FC<{
  value: string[]; onChange: (v: string[]) => void;
}> = ({ value, onChange }) => {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    const d = draft.trim().toLowerCase();
    if (!DOMAIN_RE.test(d)) return setError("Invalid domain");
    if (value.includes(d)) return setError("Already added");
    onChange([...value, d]);
    setDraft("");
    setError(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="example.com"
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <Button onClick={add} variant="outline">Add</Button>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {value.map(d => (
          <Chip key={d} onRemove={() => onChange(value.filter(x => x !== d))}>{d}</Chip>
        ))}
      </div>
    </div>
  );
};
```

## Aceptación

- [ ] Validación frontend impide dominios mal formados.
- [ ] Chips removibles.
