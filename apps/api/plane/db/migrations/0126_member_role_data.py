from django.db import migrations


def link_members(apps, schema_editor):
    WorkspaceMember = apps.get_model("db", "WorkspaceMember")
    ProjectMember = apps.get_model("db", "ProjectMember")
    Role = apps.get_model("db", "Role")

    # For each workspace, map int level → role pk
    for role in Role.objects.filter(is_system=True, level__isnull=False):
        # WorkspaceMember
        WorkspaceMember.objects.filter(
            workspace=role.workspace,
            role=role.level,
            role_id__isnull=True,
        ).update(role_id=role)

        # ProjectMember — workspace is on the project
        ProjectMember.objects.filter(
            workspace=role.workspace,
            role=role.level,
            role_id__isnull=True,
        ).update(role_id=role)


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0125_member_role_fk'),
    ]

    operations = [
        migrations.RunPython(link_members, reverse_code=migrations.RunPython.noop),
    ]
