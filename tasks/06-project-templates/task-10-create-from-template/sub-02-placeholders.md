# Sub-02 — PlaceholderFields dinámicos

**Task:** 10 · **Tamaño:** S

## Cambio

```tsx
export const PlaceholderFields: FC<{
  templateId: string;
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}> = ({ templateId, values, onChange }) => {
  const { projectTemplateStore } = useStores();
  const { workspaceSlug } = useParams();
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    projectTemplateStore.fetchPlaceholders(workspaceSlug, templateId).then(setKeys);
  }, [templateId]);

  return (
    <div className="grid grid-cols-2 gap-2">
      {keys.map(k => (
        <Input
          key={k}
          label={k.replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          value={values[k] ?? ""}
          onChange={e => onChange({ ...values, [k]: e.target.value })}
        />
      ))}
    </div>
  );
};
```

## Aceptación

- [ ] Si template sin placeholders, no renderiza nada.
- [ ] Labels en Title Case.
