# Sub-03 — `EditPropertyDrawer`

**Task:** 10 · **Tamaño:** M

## Cambio

Drawer lateral con:
- `display_name`, `is_required`, `is_active`.
- Editor de `config` específico por tipo:
  - text → `max_length`, `regex` opcional.
  - number → `min`, `max`, `step`.
  - date → `time_disabled` toggle.
  - select/multi → tab "Options" (sub-04).

Nota: no permitir cambiar `type` (rompe values existentes). Forzar borrar+recrear.

## Aceptación

- [ ] Cambio de config persiste.
- [ ] Field `type` aparece disabled con tooltip.
