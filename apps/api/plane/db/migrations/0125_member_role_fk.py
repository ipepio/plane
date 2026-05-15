import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0124_seed_system_roles'),
    ]

    operations = [
        migrations.AddField(
            model_name='workspacemember',
            name='role_id',
            field=models.ForeignKey(
                blank=True,
                db_column='role_id',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='workspace_members',
                to='db.role',
            ),
        ),
        migrations.AddField(
            model_name='projectmember',
            name='role_id',
            field=models.ForeignKey(
                blank=True,
                db_column='role_id',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='project_members',
                to='db.role',
            ),
        ),
    ]
