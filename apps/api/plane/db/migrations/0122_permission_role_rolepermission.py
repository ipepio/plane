import uuid
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0121_alter_estimate_type'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # ── Permission ─────────────────────────────────────────────────────
        migrations.CreateModel(
            name='Permission',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('deleted_at', models.DateTimeField(blank=True, null=True, verbose_name='Deleted At')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('code', models.CharField(max_length=64, unique=True)),
                ('name', models.CharField(max_length=128)),
                ('description', models.TextField(blank=True)),
                ('category', models.CharField(max_length=32)),
                ('created_by', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL,
                    related_name='permission_created_by', to=settings.AUTH_USER_MODEL,
                    verbose_name='Created By',
                )),
                ('updated_by', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL,
                    related_name='permission_updated_by', to=settings.AUTH_USER_MODEL,
                    verbose_name='Last Modified By',
                )),
            ],
            options={
                'db_table': 'permissions',
                'ordering': ('category', 'code'),
                'abstract': False,
            },
        ),

        # ── Role ───────────────────────────────────────────────────────────
        migrations.CreateModel(
            name='Role',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('deleted_at', models.DateTimeField(blank=True, null=True, verbose_name='Deleted At')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=64)),
                ('description', models.TextField(blank=True)),
                ('is_system', models.BooleanField(default=False)),
                ('level', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('workspace', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='roles', to='db.workspace',
                )),
                ('created_by', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL,
                    related_name='role_created_by', to=settings.AUTH_USER_MODEL,
                    verbose_name='Created By',
                )),
                ('updated_by', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL,
                    related_name='role_updated_by', to=settings.AUTH_USER_MODEL,
                    verbose_name='Last Modified By',
                )),
            ],
            options={
                'db_table': 'roles',
                'abstract': False,
            },
        ),
        migrations.AddConstraint(
            model_name='role',
            constraint=models.UniqueConstraint(
                condition=models.Q(deleted_at__isnull=True),
                fields=['workspace', 'name'],
                name='role_unique_name_per_workspace_when_active',
            ),
        ),

        # ── RolePermission ─────────────────────────────────────────────────
        migrations.CreateModel(
            name='RolePermission',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('deleted_at', models.DateTimeField(blank=True, null=True, verbose_name='Deleted At')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('role', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='role_permissions', to='db.role',
                )),
                ('permission', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='role_permissions', to='db.permission',
                )),
                ('created_by', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL,
                    related_name='rolepermission_created_by', to=settings.AUTH_USER_MODEL,
                    verbose_name='Created By',
                )),
                ('updated_by', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL,
                    related_name='rolepermission_updated_by', to=settings.AUTH_USER_MODEL,
                    verbose_name='Last Modified By',
                )),
            ],
            options={
                'db_table': 'role_permissions',
                'unique_together': {('role', 'permission')},
                'abstract': False,
            },
        ),

        # ── M2M through field on Role ───────────────────────────────────────
        migrations.AddField(
            model_name='role',
            name='permissions',
            field=models.ManyToManyField(
                related_name='roles',
                through='db.RolePermission',
                to='db.permission',
            ),
        ),
    ]
