# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from rest_framework import serializers

from plane.app.serializers.base import BaseSerializer
from plane.db.models import ProjectTemplate


class ProjectTemplateSerializer(BaseSerializer):
    class Meta:
        model = ProjectTemplate
        fields = "__all__"
        read_only_fields = ["workspace", "project"]

    def validate_name(self, name):
        workspace_id = self.context.get("workspace_id")
        if not workspace_id:
            return name

        queryset = ProjectTemplate.objects.filter(
            workspace_id=workspace_id,
            name__iexact=name,
            deleted_at__isnull=True,
        )
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("PROJECT_TEMPLATE_NAME_ALREADY_EXISTS")
        return name


class ProjectTemplateSaveAsSerializer(serializers.Serializer):
    project_id = serializers.UUIDField()
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    icon_props = serializers.JSONField(required=False)


class ProjectTemplateInstantiateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    identifier = serializers.CharField(max_length=12)
    variables = serializers.JSONField(required=False)
