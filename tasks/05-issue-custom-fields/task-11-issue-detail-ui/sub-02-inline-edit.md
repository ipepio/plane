# Sub-02 — Inline edit

**Task:** 11 · **Tamaño:** L

## Cambio

`<PropertyValueEditor>` por tipo:
- text/number/url → `<InlineEdit>` con submit on blur/Enter.
- date → date picker.
- boolean → toggle.
- select → dropdown.
- multi_select → multi-tag dropdown.
- user → user picker.

Cada cambio llama `valueStore.setValue(...)`.

## Aceptación

- [ ] Cambiar value persiste y refleja al instante (optimistic).
- [ ] Validation errors del backend se muestran inline.
