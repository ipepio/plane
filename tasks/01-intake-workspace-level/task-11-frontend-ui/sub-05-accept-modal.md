# Sub-05 — Accept modal

**Task:** 11 · **Tamaño:** L

## Cambio

Modal con 3 pasos:
1. Seleccionar proyecto destino (select de proyectos del workspace donde el user es miembro).
2. (Opcional) elegir state (filtrado al proyecto destino, default = state default del proyecto).
3. (Opcional) elegir assignees (filtrado a project members).

Botón Accept → llama `store.acceptTicket` con payload. Al éxito, cierra modal y navega al issue creado (opcional).

## Aceptación

- [ ] Selector de proyecto solo muestra proyectos del workspace donde el user puede crear issues.
- [ ] State picker actualiza al cambiar proyecto.
- [ ] Tras accept exitoso, ticket pasa a Accepted y aparece link al issue.
