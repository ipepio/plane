# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from uuid import uuid4

import pytest
from django.db import IntegrityError

from plane.db.models import Team, TeamMember, Workspace


def make_workspace(owner, slug=None):
    return Workspace.objects.create(
        name=f"WS-{uuid4().hex[:6]}",
        slug=slug or f"ws-{uuid4().hex[:6]}",
        id=uuid4(),
        owner=owner,
    )


@pytest.mark.unit
class TestTeamModel:
    @pytest.mark.django_db
    def test_team_name_is_case_insensitive_unique_per_workspace(self, create_user):
        workspace = make_workspace(create_user)
        Team.objects.create(workspace=workspace, name="Backend")

        with pytest.raises(IntegrityError):
            Team.objects.create(workspace=workspace, name="backend")

    @pytest.mark.django_db
    def test_team_name_can_repeat_across_workspaces(self, create_user):
        first_workspace = make_workspace(create_user, slug="first")
        second_workspace = make_workspace(create_user, slug="second")

        Team.objects.create(workspace=first_workspace, name="Backend")
        team = Team.objects.create(workspace=second_workspace, name="Backend")

        assert team.id is not None

    @pytest.mark.django_db
    def test_team_member_is_unique_per_team(self, create_user):
        workspace = make_workspace(create_user)
        team = Team.objects.create(workspace=workspace, name="Backend")
        TeamMember.objects.create(workspace=workspace, team=team, member=create_user)

        with pytest.raises(IntegrityError):
            TeamMember.objects.create(workspace=workspace, team=team, member=create_user)
