# Sub-01 — `role_id` FK en `WorkspaceMember`

**Task:** 04 · **Tamaño:** S

## Cambio

Añadir el FK nullable. NO tocar el campo `role` int.

## Cómo

`apps/api/plane/db/models/workspace.py`, dentro de `WorkspaceMember`:

```python
role_obj = models.ForeignKey(
    "db.Role",
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="workspace_members",
    db_column="role_id",
)
```

> Nombre del atributo: `role_obj` para evitar colisión con el `role` int existente. La columna SQL es `role_id`.

Generar migración:

```bash
python manage.py makemigrations db --name member_role_fk
```

## Aceptación

- [ ] La migración añade columna `role_id` a `workspace_members` y un FK constraint.
- [ ] El campo `role` (int) sigue presente.
- [ ] `WorkspaceMember.objects.create(...)` con `role=15` y sin `role_obj` sigue funcionando.
