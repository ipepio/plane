# Sub-03 — Data migration: int → Role del sistema

**Task:** 04 · **Tamaño:** M

## Cambio

Para cada miembro existente, mapear su `role` int al `Role` del sistema correspondiente del mismo workspace.

## Cómo

```bash
python manage.py makemigrations db --empty --name member_role_data
```

```python
from django.db import migrations

LEVEL_TO_NAME = {20: "Admin", 15: "Member", 5: "Guest"}

def forwards(apps, schema_editor):
    Role = apps.get_model("db", "Role")
    WorkspaceMember = apps.get_model("db", "WorkspaceMember")
    ProjectMember = apps.get_model("db", "ProjectMember")

    role_index = {}  # (workspace_id, level) -> role_id
    for r in Role.objects.filter(is_system=True):
        role_index[(r.workspace_id, r.level)] = r.id

    for m in WorkspaceMember.objects.filter(role_obj__isnull=True).iterator():
        rid = role_index.get((m.workspace_id, m.role))
        if rid:
            m.role_obj_id = rid
            m.save(update_fields=["role_obj"])

    # ProjectMember: el workspace se obtiene vía m.project.workspace_id
    for m in ProjectMember.objects.filter(role_obj__isnull=True).select_related("project").iterator():
        rid = role_index.get((m.project.workspace_id, m.role))
        if rid:
            m.role_obj_id = rid
            m.save(update_fields=["role_obj"])

def reverse(apps, schema_editor):
    apps.get_model("db", "WorkspaceMember").objects.update(role_obj=None)
    apps.get_model("db", "ProjectMember").objects.update(role_obj=None)

class Migration(migrations.Migration):
    dependencies = [("db", "00XX_member_role_fk")]
    operations = [migrations.RunPython(forwards, reverse)]
```

## Aceptación

- [ ] `WorkspaceMember.objects.filter(role_obj__isnull=True).count() == 0` post-migración.
- [ ] `ProjectMember.objects.filter(role_obj__isnull=True).count() == 0`.
- [ ] Rollback deja `role_obj=None` sin borrar miembros.
