# Sub-03 — Crear `RolePermission` (through del M2M)

**Task:** 01 · **Tamaño:** XS

## Cambio

Tabla intermedia explícita para auditar quién dio qué permiso (campos created_by/at vienen de BaseModel).

## Cómo

```python
class RolePermission(BaseModel):
    role = models.ForeignKey("db.Role", on_delete=models.CASCADE, related_name="role_permissions")
    permission = models.ForeignKey("db.Permission", on_delete=models.CASCADE, related_name="role_permissions")

    class Meta:
        db_table = "role_permissions"
        unique_together = ["role", "permission"]
```

## Aceptación

- [ ] No se puede añadir el mismo permiso dos veces al mismo rol (`IntegrityError`).
- [ ] `role.permissions.all()` devuelve todos los `Permission` enlazados (M2M funciona via `through`).
