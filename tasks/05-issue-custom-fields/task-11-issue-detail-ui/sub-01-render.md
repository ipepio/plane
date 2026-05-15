# Sub-01 — Render dinámico

**Task:** 11 · **Tamaño:** M

## Cambio

```tsx
<CustomPropertiesPanel issueId={issue.id} issueTypeId={issue.type}>
  {properties.map(p => (
    <PropertyRow key={p.id} property={p}>
      <PropertyValueRenderer property={p} value={values.get(p.id)} />
    </PropertyRow>
  ))}
</CustomPropertiesPanel>
```

`PropertyValueRenderer` switchea por `property.type` y renderiza el widget read-only adecuado (text, badge, avatar, etc.).

## Aceptación

- [ ] Properties activas se muestran ordenadas por `relative_order`.
- [ ] Properties inactivas: ocultas (a menos que tengan value, en cuyo caso se muestran con flag).
