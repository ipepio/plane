# Sub-02 — Crear `Role` model + protección is_system

**Task:** 01 · **Tamaño:** S

## Cambio

Clase `Role` con FK a workspace, flag `is_system` y override de `delete()`.

## Cómo

```python
class Role(BaseModel):
    workspace = models.ForeignKey("db.Workspace", on_delete=models.CASCADE, related_name="roles")
    name = models.CharField(max_length=64)
    description = models.TextField(blank=True)
    is_system = models.BooleanField(default=False)
    level = models.PositiveSmallIntegerField(null=True, blank=True)
    permissions = models.ManyToManyField("db.Permission", through="db.RolePermission", related_name="roles")

    class Meta:
        db_table = "roles"
        unique_together = ["workspace", "name", "deleted_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["workspace", "name"],
                condition=models.Q(deleted_at__isnull=True),
                name="role_unique_name_per_workspace_when_active",
            )
        ]

    def delete(self, *args, **kwargs):
        if self.is_system:
            from django.db.models import ProtectedError
            raise ProtectedError("System roles cannot be deleted", [self])
        return super().delete(*args, **kwargs)
```

## Aceptación

- [ ] Crear `Role(name="Admin", is_system=True)` y llamar `.delete()` → `ProtectedError`.
- [ ] Soft-delete (cambiar `deleted_at`) sigue funcionando para roles custom.
