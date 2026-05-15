# Sub-03 — Data migration que invoca el seed

**Task:** 02 · **Tamaño:** XS

## Cambio

Migración Django que lanza `seed_permissions()` en cada deploy.

## Cómo

```bash
docker compose -f docker-compose-local.yml exec api python manage.py makemigrations db --empty --name seed_permissions
```

Editar el archivo generado:

```python
from django.db import migrations
from plane.seeds.permissions import seed_permissions

def forwards(apps, schema_editor):
    seed_permissions(apps)

def reverse(apps, schema_editor):
    Permission = apps.get_model("db", "Permission")
    Permission.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ("db", "00XX_role_permission"),  # de task-01
    ]
    operations = [migrations.RunPython(forwards, reverse)]
```

## Aceptación

- [ ] `migrate db` aplica y crea las filas.
- [ ] `migrate db 00XX_role_permission` (rollback) borra todas las permissions.
- [ ] Segunda aplicación es no-op.
