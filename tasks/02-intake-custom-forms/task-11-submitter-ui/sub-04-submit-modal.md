# Sub-04 — Integrar en submit modal

**Task:** 11 · **Tamaño:** S

## Cambio

En el "New ticket" modal del intake (épica 01 task-11 sub-03), después de los campos built-in (`name`, `description`, `priority`), renderizar `<IntakeFormRenderer ... />` con los fields del intake.

Al submit, incluir `form_values` en el payload del POST.

## Aceptación

- [ ] Validación frontend de required.
- [ ] Payload backend incluye form_values.
- [ ] Tras submit, ticket aparece con campos custom visibles en el detalle.
