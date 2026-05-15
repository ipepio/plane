# Sub-03 — Frontend filters UI

**Task:** 07 · **Tamaño:** M

## Cambio

En el FilterBar de la lista de issues, añadir sección "Custom properties" que liste las properties del issue type vigente. Cada una abre dropdown adecuado:
- select → multi-checkbox de opciones.
- user → user picker.
- boolean → toggle tri-state.
- text/number/date → input.

Persistir en URL params como `property_filters=...`.

## Aceptación

- [ ] Filtros aplican y refrescan la lista.
- [ ] URL refleja el estado.
