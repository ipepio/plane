# Sub-06 — Signal sync `role` int ↔ `role_obj.level`

**Task:** 12 · **Tamaño:** S

## Cambio

Mientras el campo `role` int siga existiendo, mantenerlo sincronizado desde `role_obj`. Permite que código tercero / scripts antiguos sigan leyendo `member.role` con valor coherente.

## Cómo

`apps/api/plane/db/signals.py`:

```python
@receiver(pre_save, sender=WorkspaceMember)
def _sync_workspace_member_role(sender, instance, **kwargs):
    if instance.role_obj_id and instance.role_obj.is_system:
        instance.role = instance.role_obj.level

@receiver(pre_save, sender=ProjectMember)
def _sync_project_member_role(sender, instance, **kwargs):
    if instance.role_obj_id and instance.role_obj.is_system:
        instance.role = instance.role_obj.level
```

Para roles custom: el mejor `level` proxy es el más alto entre {Admin, Member, Guest} cuyas permissions sean subset/superset del rol custom. Demasiada complejidad. Decisión: dejar `role` int = 15 (Member) por defecto en custom roles, y dependerá de las permissions reales para el control. El campo entero queda como **legacy de compatibilidad**, no como fuente de verdad.

## Aceptación

- [ ] Cambiar `role_obj` a Admin del sistema actualiza `role` a 20.
- [ ] Cambiar a un rol custom deja `role` en 15 (default).
- [ ] El sync se dispara solo en escritura del FK, no en otras actualizaciones.
