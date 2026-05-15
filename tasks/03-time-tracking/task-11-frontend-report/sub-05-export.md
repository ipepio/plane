# Sub-05 — Botón export

**Task:** 11 · **Tamaño:** XS

## Cambio

```tsx
export const ExportCsvButton: FC = observer(() => {
  const { worklogStore } = useStores();
  const { workspaceSlug } = useParams();
  const service = useMemo(() => new WorklogService(), []);
  const href = service.exportCsvUrl(workspaceSlug, worklogStore.filters);

  return (
    <a href={href} download>
      <Button variant="outline">Export CSV</Button>
    </a>
  );
});
```

## Aceptación

- [ ] Click descarga CSV con filtros aplicados.
