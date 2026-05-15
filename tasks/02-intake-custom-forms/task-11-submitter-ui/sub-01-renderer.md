# Sub-01 — `IntakeFormRenderer`

**Task:** 11 · **Tamaño:** S

## Cambio

```tsx
export function IntakeFormRenderer({ fields, values, errors, onChange }) {
  return (
    <div className="space-y-4">
      {fields.filter(f => f.is_active).sort((a,b)=>a.relative_order-b.relative_order).map(f => (
        <FieldRow key={f.id} field={f} error={errors[f.id]}>
          <FieldInput field={f} value={values[f.id]} onChange={v => onChange(f.id, v)} />
        </FieldRow>
      ))}
    </div>
  );
}
```

`FieldRow` muestra label, required indicator, help_text, error.

## Aceptación

- [ ] Renderiza fields ordenados.
- [ ] Error inline visible.
