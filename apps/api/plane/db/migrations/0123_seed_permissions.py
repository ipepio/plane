from django.db import migrations


def seed_permissions_forward(apps, schema_editor):
    from plane.seeds.permissions import seed_permissions
    seed_permissions(apps=apps, schema_editor=schema_editor)


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0122_permission_role_rolepermission'),
    ]

    operations = [
        migrations.RunPython(
            seed_permissions_forward,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
