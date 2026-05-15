# Sub-04 — Form de creación de issue con required

**Task:** 11 · **Tamaño:** M

## Cambio

En el modal de "Create issue", al elegir `issue_type`, cargar sus properties y renderizar los campos required obligatoriamente. Las no-required en sección colapsable.

Al submit, enviar `property_values` en el payload.

## Aceptación

- [ ] No se puede crear Bug sin severity (si severity es required).
- [ ] El form muestra error inline sin perder otros valores.
