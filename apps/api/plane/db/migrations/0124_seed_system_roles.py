from django.db import migrations


def seed_all_workspaces(apps, schema_editor):
    Workspace = apps.get_model("db", "Workspace")
    from plane.seeds.system_roles import seed_system_roles_for_workspace

    for workspace in Workspace.objects.filter(deleted_at__isnull=True).iterator(chunk_size=200):
        seed_system_roles_for_workspace(workspace, apps=apps)


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0123_seed_permissions'),
    ]

    operations = [
        migrations.RunPython(
            seed_all_workspaces,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
