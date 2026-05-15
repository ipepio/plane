# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.conf import settings
from django.db import models
from django.db.models import Q
from django.db.models.functions import Lower

from .base import BaseModel


class Team(BaseModel):
    name = models.CharField(max_length=255, verbose_name="Team Name")
    description = models.TextField(verbose_name="Team Description", blank=True)
    workspace = models.ForeignKey("db.Workspace", on_delete=models.CASCADE, related_name="workspace_team")
    logo_props = models.JSONField(default=dict)

    def __str__(self):
        """Return name of the team."""
        return f"{self.name} <{self.workspace.name}>"

    class Meta:
        unique_together = ["name", "workspace", "deleted_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "workspace"],
                condition=Q(deleted_at__isnull=True),
                name="team_unique_name_workspace_when_deleted_at_null",
            ),
            models.UniqueConstraint(
                Lower("name"),
                "workspace",
                condition=Q(deleted_at__isnull=True),
                name="team_unique_lower_name_workspace_when_deleted_at_null",
            ),
        ]
        verbose_name = "Team"
        verbose_name_plural = "Teams"
        db_table = "teams"
        ordering = ("-created_at",)


class TeamMemberRole(models.TextChoices):
    LEAD = "lead", "Lead"
    MEMBER = "member", "Member"


class TeamMember(BaseModel):
    team = models.ForeignKey("db.Team", on_delete=models.CASCADE, related_name="team_members")
    workspace = models.ForeignKey("db.Workspace", on_delete=models.CASCADE, related_name="workspace_team_members")
    member = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="team_memberships")
    role = models.CharField(max_length=16, choices=TeamMemberRole.choices, default=TeamMemberRole.MEMBER)

    def __str__(self):
        return f"{self.team.name} {self.member.email}"

    class Meta:
        unique_together = ["team", "member", "deleted_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["team", "member"],
                condition=Q(deleted_at__isnull=True),
                name="team_member_unique_team_member_when_deleted_at_null",
            )
        ]
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"
        db_table = "team_members"
        ordering = ("-created_at",)
