# Sub-01 — TemplateSelector con search

**Task:** 10 · **Tamaño:** S

## Cambio

```tsx
export const TemplateSelector: FC<{ value: string | null; onChange: (id: string | null) => void }> = observer(
  ({ value, onChange }) => {
    const { projectTemplateStore } = useStores();
    const { workspaceSlug } = useParams();
    const [query, setQuery] = useState("");

    useEffect(() => { projectTemplateStore.fetch(workspaceSlug); }, [workspaceSlug]);

    const filtered = projectTemplateStore.all.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));

    return (
      <Combobox value={value} onChange={onChange}>
        <ComboboxInput placeholder="Start blank or choose template" onChange={e => setQuery(e.target.value)} />
        <ComboboxOptions>
          <ComboboxOption value={null}>Blank project</ComboboxOption>
          {filtered.map(t => (
            <ComboboxOption key={t.id} value={t.id}>
              <span>{t.name}</span>
              <span className="text-xs text-muted">{t.description}</span>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    );
  }
);
```

## Aceptación

- [ ] Opción "Blank" siempre visible al principio.
- [ ] Filtro por nombre case-insensitive.
