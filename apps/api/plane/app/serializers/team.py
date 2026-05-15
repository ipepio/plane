# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from rest_framework import serializers

from plane.app.serializers.base import BaseSerializer
from plane.app.serializers.user import UserLiteSerializer
from plane.db.models import Team, TeamMember, WorkspaceMember


class TeamSerializer(BaseSerializer):
    member_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "description",
            "logo_props",
            "member_count",
            "workspace",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = ["workspace", "created_by", "updated_by", "created_at", "updated_at", "member_count"]

    def validate_name(self, value):
        workspace = self.context.get("workspace")
        queryset = Team.objects.filter(workspace=workspace, name__iexact=value, deleted_at__isnull=True)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A team with this name already exists in this workspace.")
        return value


class TeamMemberSerializer(BaseSerializer):
    member_detail = UserLiteSerializer(read_only=True, source="member")

    class Meta:
        model = TeamMember
        fields = [
            "id",
            "team",
            "workspace",
            "member",
            "member_detail",
            "role",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = ["team", "workspace", "member_detail", "created_by", "updated_by", "created_at", "updated_at"]

    def validate_member(self, value):
        workspace = self.context.get("workspace")
        if not WorkspaceMember.objects.filter(workspace=workspace, member=value, is_active=True).exists():
            raise serializers.ValidationError("User must be an active workspace member.")
        return value


class TeamDetailSerializer(TeamSerializer):
    members = TeamMemberSerializer(read_only=True, many=True, source="team_members")

    class Meta(TeamSerializer.Meta):
        fields = TeamSerializer.Meta.fields + ["members"]
        read_only_fields = TeamSerializer.Meta.read_only_fields + ["members"]


class TeamMemberBulkCreateSerializer(serializers.Serializer):
    members = TeamMemberSerializer(many=True)
