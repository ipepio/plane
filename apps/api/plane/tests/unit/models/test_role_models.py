# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import pytest
from uuid import uuid4
from django.db import IntegrityError
from django.db.models import ProtectedError

from plane.db.models import Permission, Role, RolePermission, Workspace


def make_workspace(owner):
    return Workspace.objects.create(
        name=f"WS-{uuid4().hex[:6]}",
        slug=f"ws-{uuid4().hex[:6]}",
        id=uuid4(),
        owner=owner,
    )


@pytest.mark.unit
class TestPermissionModel:
    @pytest.mark.django_db
    def test_permission_creation(self):
        p = Permission.objects.create(
            code="issue.create", name="Create issue", category="issue"
        )
        assert p.id is not None
        assert str(p) == "issue.create"

    @pytest.mark.django_db
    def test_permission_unique_code(self):
        Permission.objects.create(code="issue.delete", name="Delete issue", category="issue")
        with pytest.raises(IntegrityError):
            Permission.objects.create(code="issue.delete", name="dup", category="issue")


@pytest.mark.unit
class TestRoleModel:
    @pytest.mark.django_db
    def test_role_creation(self, create_user):
        ws = make_workspace(create_user)
        role = Role.objects.create(workspace=ws, name="Triador")
        assert role.id is not None
        assert role.is_system is False
        assert role.level is None

    @pytest.mark.django_db
    def test_role_unique_name_per_workspace(self, create_user):
        ws = make_workspace(create_user)
        Role.objects.create(workspace=ws, name="Triador")
        with pytest.raises(Exception):
            Role.objects.create(workspace=ws, name="Triador")

    @pytest.mark.django_db
    def test_same_name_different_workspaces_ok(self, create_user):
        ws1 = make_workspace(create_user)
        ws2 = make_workspace(create_user)
        Role.objects.create(workspace=ws1, name="Triador")
        r2 = Role.objects.create(workspace=ws2, name="Triador")
        assert r2.id is not None

    @pytest.mark.django_db
    def test_system_role_delete_raises(self, create_user):
        ws = make_workspace(create_user)
        role = Role.objects.create(workspace=ws, name="Admin", is_system=True, level=20)
        with pytest.raises(ProtectedError):
            role.delete()

    @pytest.mark.django_db
    def test_custom_role_soft_delete_ok(self, create_user):
        ws = make_workspace(create_user)
        role = Role.objects.create(workspace=ws, name="Custom")
        role.delete()  # soft delete via SoftDeleteModel
        assert Role.all_objects.filter(id=role.id).exists()
        assert not Role.objects.filter(id=role.id).exists()


@pytest.mark.unit
class TestRolePermissionModel:
    @pytest.mark.django_db
    def test_rolepermission_creation(self, create_user):
        ws = make_workspace(create_user)
        role = Role.objects.create(workspace=ws, name="Triador")
        perm = Permission.objects.create(code="intake.triage", name="Triage intake", category="intake")
        rp = RolePermission.objects.create(role=role, permission=perm)
        assert rp.id is not None

    @pytest.mark.django_db
    def test_rolepermission_unique(self, create_user):
        ws = make_workspace(create_user)
        role = Role.objects.create(workspace=ws, name="Triador2")
        perm = Permission.objects.create(code="issue.comment", name="Comment", category="issue")
        RolePermission.objects.create(role=role, permission=perm)
        with pytest.raises(IntegrityError):
            RolePermission.objects.create(role=role, permission=perm)

    @pytest.mark.django_db
    def test_m2m_through_works(self, create_user):
        ws = make_workspace(create_user)
        role = Role.objects.create(workspace=ws, name="PM")
        p1 = Permission.objects.create(code="project.create", name="Create project", category="project")
        p2 = Permission.objects.create(code="project.archive", name="Archive project", category="project")
        RolePermission.objects.create(role=role, permission=p1)
        RolePermission.objects.create(role=role, permission=p2)
        assert set(role.permissions.values_list("code", flat=True)) == {"project.create", "project.archive"}
