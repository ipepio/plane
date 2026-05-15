# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from uuid import uuid4

import pytest
from django.db import IntegrityError

from plane.app.serializers import IntakeFormFieldSerializer, WorkspaceIntakeIssueSerializer, persist_workspace_intake_form_values
from plane.db.models import IntakeFormField, Workspace, WorkspaceIntake, WorkspaceIntakeIssue
from plane.db.models.intake import IntakeFormFieldType, IntakeIssueStatus


def make_workspace(owner, slug=None):
    return Workspace.objects.create(
        name=f"WS-{uuid4().hex[:6]}",
        slug=slug or f"ws-{uuid4().hex[:6]}",
        id=uuid4(),
        owner=owner,
    )


@pytest.mark.unit
class TestWorkspaceIntakeModel:
    @pytest.mark.django_db
    def test_workspace_intake_creation(self, create_user):
        workspace = make_workspace(create_user)
        intake = WorkspaceIntake.objects.create(workspace=workspace, name="Support", is_default=True)

        assert intake.id is not None
        assert intake.is_default is True
        assert str(intake) == f"Support <{workspace.name}>"

    @pytest.mark.django_db
    def test_workspace_intake_name_is_case_insensitive_unique_per_workspace(self, create_user):
        workspace = make_workspace(create_user)
        WorkspaceIntake.objects.create(workspace=workspace, name="Support")

        with pytest.raises(IntegrityError):
            WorkspaceIntake.objects.create(workspace=workspace, name="support")

    @pytest.mark.django_db
    def test_only_one_default_workspace_intake_is_allowed(self, create_user):
        workspace = make_workspace(create_user)
        WorkspaceIntake.objects.create(workspace=workspace, name="Default", is_default=True)

        with pytest.raises(IntegrityError):
            WorkspaceIntake.objects.create(workspace=workspace, name="Second default", is_default=True)


@pytest.mark.unit
class TestWorkspaceIntakeIssueModel:
    @pytest.mark.django_db
    def test_workspace_intake_issue_creation(self, create_user):
        workspace = make_workspace(create_user)
        intake = WorkspaceIntake.objects.create(workspace=workspace, name="Default", is_default=True)
        intake_issue = WorkspaceIntakeIssue.objects.create(
            workspace=workspace,
            intake=intake,
            name="Need access",
            description_html="<p>Please add access.</p>",
        )

        assert intake_issue.id is not None
        assert intake_issue.status == IntakeIssueStatus.PENDING
        assert str(intake_issue) == f"Need access <{intake.name}>"


@pytest.mark.unit
class TestWorkspaceIntakeIssueSerializer:
    @pytest.mark.django_db
    def test_rejects_intake_from_another_workspace(self, create_user):
        workspace = make_workspace(create_user, slug="primary")
        other_workspace = make_workspace(create_user, slug="secondary")
        other_intake = WorkspaceIntake.objects.create(workspace=other_workspace, name="Other")

        serializer = WorkspaceIntakeIssueSerializer(
            data={
                "intake": str(other_intake.id),
                "name": "Need access",
                "description_html": "<p>Please add access.</p>",
                "priority": "none",
            },
            context={"slug": workspace.slug},
        )

        assert serializer.is_valid() is False
        assert "intake" in serializer.errors


@pytest.mark.unit
class TestIntakeFormFields:
    @pytest.mark.django_db
    def test_field_creation_for_workspace_intake(self, create_user):
        workspace = make_workspace(create_user)
        intake = WorkspaceIntake.objects.create(workspace=workspace, name="Default", is_default=True)
        field = IntakeFormField.objects.create(
            workspace=workspace,
            workspace_intake=intake,
            label="Customer",
            type=IntakeFormFieldType.SHORT_TEXT,
            is_required=True,
        )

        assert field.id is not None
        assert field.workspace_intake == intake
        assert field.intake_id is None

    @pytest.mark.django_db
    def test_field_requires_supported_type(self, create_user):
        serializer = IntakeFormFieldSerializer(
            data={
                "label": "Customer",
                "type": "unknown",
            }
        )

        assert serializer.is_valid() is False
        assert "type" in serializer.errors

    @pytest.mark.django_db
    def test_required_form_value_is_enforced(self, create_user):
        workspace = make_workspace(create_user)
        intake = WorkspaceIntake.objects.create(workspace=workspace, name="Default", is_default=True)
        field = IntakeFormField.objects.create(
            workspace=workspace,
            workspace_intake=intake,
            label="Customer",
            type=IntakeFormFieldType.SHORT_TEXT,
            is_required=True,
        )
        intake_issue = WorkspaceIntakeIssue.objects.create(workspace=workspace, intake=intake, name="Need help")

        with pytest.raises(Exception):
            persist_workspace_intake_form_values(intake_issue, [{"field": str(field.id), "value": ""}])
