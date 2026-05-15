# Sub-05 — Migrar views de intake

**Task:** 12 · **Tamaño:** S

## Cambio

Sustituir checks bajo `apps/api/plane/app/views/intake.py` y `space/views/intake.py`.

## Cómo

Mapa:
- Submit (cualquier miembro) → `intake.submit`
- Triage (aceptar/rechazar/snoozar) → `intake.triage`
- Configurar formulario (épica 02) → `intake.manage_forms`

```python
class IntakeIssueViewSet(...):
    @action(detail=True, methods=["post"], required_permission="intake.triage")
    def accept(self, request, ...):
        ...
```

> Nota: épicas 01 y 02 aún no están implementadas. Esta sub-tarea cubre solo las views actuales del intake por proyecto. Los intakes workspace-level que llegarán con épica 01 ya nacen con los checks correctos.

## Aceptación

- [ ] Grep `role\s*[<>=]` en `views/intake.py` → 0.
- [ ] Test: Guest puede submit pero no triage.
- [ ] Test: Member con permiso `intake.triage` triarea correctamente.
