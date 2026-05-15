# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from rest_framework import serializers

from plane.app.serializers.base import BaseSerializer
from plane.app.serializers.issue import IssueFlatSerializer
from plane.app.serializers.project import ProjectLiteSerializer
from plane.app.serializers.user import UserLiteSerializer
from plane.db.models import IssueWorklog


class IssueWorklogSerializer(BaseSerializer):
    logged_by_detail = UserLiteSerializer(source="logged_by", read_only=True)

    class Meta:
        model = IssueWorklog
        fields = [
            "id",
            "workspace",
            "project",
            "issue",
            "logged_by",
            "logged_by_detail",
            "duration",
            "started_at",
            "description",
            "is_billable",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = [
            "workspace",
            "project",
            "issue",
            "logged_by",
            "logged_by_detail",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]

    def validate_duration(self, value):
        if value <= 0:
            raise serializers.ValidationError("Duration must be greater than zero.")
        return value


class WorkspaceWorklogReadSerializer(IssueWorklogSerializer):
    issue_detail = IssueFlatSerializer(source="issue", read_only=True)
    project_detail = ProjectLiteSerializer(source="project", read_only=True)

    class Meta(IssueWorklogSerializer.Meta):
        fields = IssueWorklogSerializer.Meta.fields + ["issue_detail", "project_detail"]
        read_only_fields = IssueWorklogSerializer.Meta.read_only_fields + ["issue_detail", "project_detail"]
