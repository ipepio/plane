# Sub-02 — `role_id` FK en `ProjectMember`

**Task:** 04 · **Tamaño:** S

## Cambio

Mismo patrón en `ProjectMember`.

## Cómo

`apps/api/plane/db/models/project.py`, dentro de `ProjectMember`:

```python
role_obj = models.ForeignKey(
    "db.Role",
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="project_members",
    db_column="role_id",
)
```

Incluir en la **misma** migración que sub-01 (`member_role_fk`) para mantener un solo paso de schema.

## Aceptación

- [ ] La migración añade `role_id` a `project_members`.
- [ ] El campo `role` int sigue presente.
