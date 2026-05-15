# Sub-03 — Data migration para workspaces existentes

**Task:** 03 · **Tamaño:** XS

## Cambio

Recorrer todos los workspaces ya creados y aplicarles el seed.

## Cómo

```bash
docker compose -f docker-compose-local.yml exec api python manage.py makemigrations db --empty --name seed_system_roles
```

Edit:

```python
from django.db import migrations
from plane.seeds.system_roles import seed_system_roles_for_workspace

def forwards(apps, schema_editor):
    Workspace = apps.get_model("db", "Workspace")
    for ws in Workspace.objects.all():
        seed_system_roles_for_workspace(ws, apps=apps)

def reverse(apps, schema_editor):
    Role = apps.get_model("db", "Role")
    Role.objects.filter(is_system=True).delete()

class Migration(migrations.Migration):
    dependencies = [("db", "00XX_seed_permissions")]
    operations = [migrations.RunPython(forwards, reverse)]
```

## Aceptación

- [ ] Aplicar sobre BD con N workspaces deja `Role.objects.filter(is_system=True).count() == N * 3`.
- [ ] Rollback elimina solo los del sistema.
