# Sub-03 — Edit drawer

**Task:** 10 · **Tamaño:** M

## Cambio

Drawer con:
- `label`, `placeholder`, `help_text`, `is_required`, `is_active`.
- Config específica:
  - short_text → `max_length`.
  - long_text → `max_length`.
  - number → `min`, `max`, `step`.
  - date → `time_disabled`.
  - file → `max_size_mb`, `accept` (mime types).
  - select/multi → tab "Options".

`type` no editable (rompe respuestas existentes).

## Aceptación

- [ ] Cambios se autosalvan on blur.
- [ ] Type read-only.
