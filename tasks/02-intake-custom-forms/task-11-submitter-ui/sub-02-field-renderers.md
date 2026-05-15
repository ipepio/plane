# Sub-02 — Renderers por tipo

**Task:** 11 · **Tamaño:** M

## Cambio

```tsx
function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case "short_text": return <Input value={value ?? ""} onChange={e => onChange(e.target.value)} maxLength={field.config.max_length} placeholder={field.placeholder} />;
    case "long_text":  return <Textarea ... />;
    case "number":     return <NumberInput min={field.config.min} max={field.config.max} step={field.config.step} ... />;
    case "date":       return <DatePicker timeDisabled={field.config.time_disabled} ... />;
    case "boolean":    return <Checkbox checked={!!value} onChange={onChange} />;
    case "select":     return <SelectDropdown options={field.options} ... />;
    case "multi_select": return <MultiSelectDropdown ... />;
    case "user":       return <UserPicker workspaceSlug={...} ... />;
    case "file":       return <FileUploadInput field={field} value={value} onChange={onChange} />;
  }
}
```

## Aceptación

- [ ] Los 9 tipos renderizan adecuadamente.
- [ ] Validación inline antes del submit.
