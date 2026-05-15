# Sub-03 — Wire en create modal

**Task:** 10 · **Tamaño:** S

## Cambio

En `project-create-modal.tsx`, añadir:

```tsx
const [templateId, setTemplateId] = useState<string | null>(null);
const [vars, setVars] = useState<Record<string, string>>({});

// renderizado: encima de los campos del proyecto blank
<TemplateSelector value={templateId} onChange={setTemplateId} />
{templateId && (
  <PlaceholderFields templateId={templateId} values={vars} onChange={setVars} />
)}
```

Cuando `templateId` está set, esconder los campos estructurales (modules/cycles/etc.) que vendrán de la plantilla.

## Aceptación

- [ ] UI cambia según template seleccionado.
