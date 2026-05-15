# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from rest_framework import status
from rest_framework.response import Response
from django.db import IntegrityError

from plane.app.permissions import ROLE, allow_permission
from plane.app.serializers import (
    ProjectListSerializer,
    ProjectTemplateInstantiateSerializer,
    ProjectTemplateSaveAsSerializer,
    ProjectTemplateSerializer,
)
from plane.app.views.base import BaseViewSet
from plane.db.models import Project, ProjectTemplate, Workspace
from plane.utils.project_template import (
    build_project_template_snapshot,
    extract_placeholders,
    instantiate_project_template,
)


class ProjectTemplateViewSet(BaseViewSet):
    serializer_class = ProjectTemplateSerializer
    model = ProjectTemplate
    search_fields = ["name"]

    def get_queryset(self):
        return self.filter_queryset(
            super()
            .get_queryset()
            .filter(workspace__slug=self.kwargs.get("slug"), deleted_at__isnull=True)
            .select_related("workspace", "created_by")
            .order_by("-created_at")
        )

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER], level="WORKSPACE")
    def create(self, request, slug):
        workspace = Workspace.objects.filter(slug=slug).first()
        if workspace is None:
            return Response({"error": "Workspace does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectTemplateSerializer(
            data=request.data,
            context={"workspace_id": workspace.id},
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(workspace=workspace)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST], level="WORKSPACE")
    def list(self, request, slug):
        serializer = ProjectTemplateSerializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST], level="WORKSPACE")
    def retrieve(self, request, slug, pk):
        template = self.get_queryset().filter(pk=pk).first()
        if template is None:
            return Response({"error": "Project template does not exist"}, status=status.HTTP_404_NOT_FOUND)

        return Response(ProjectTemplateSerializer(template).data, status=status.HTTP_200_OK)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER], level="WORKSPACE")
    def partial_update(self, request, slug, pk):
        template = self.get_queryset().filter(pk=pk).first()
        if template is None:
            return Response({"error": "Project template does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectTemplateSerializer(
            template,
            data=request.data,
            partial=True,
            context={"workspace_id": template.workspace_id},
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER], level="WORKSPACE")
    def destroy(self, request, slug, pk):
        template = self.get_queryset().filter(pk=pk).first()
        if template is None:
            return Response({"error": "Project template does not exist"}, status=status.HTTP_404_NOT_FOUND)

        template.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER], level="WORKSPACE")
    def save_as(self, request, slug):
        workspace = Workspace.objects.filter(slug=slug).first()
        if workspace is None:
            return Response({"error": "Workspace does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectTemplateSaveAsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        project = Project.objects.filter(
            pk=serializer.validated_data["project_id"],
            workspace=workspace,
            deleted_at__isnull=True,
        ).first()
        if project is None:
            return Response({"error": "Project does not exist"}, status=status.HTTP_404_NOT_FOUND)

        template_serializer = ProjectTemplateSerializer(
            data={
                "name": serializer.validated_data["name"],
                "description": serializer.validated_data.get("description", ""),
                "icon_props": serializer.validated_data.get("icon_props", {}),
                "payload": build_project_template_snapshot(project),
            },
            context={"workspace_id": workspace.id},
        )
        if not template_serializer.is_valid():
            return Response(template_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        template_serializer.save(workspace=workspace, project=project)
        return Response(template_serializer.data, status=status.HTTP_201_CREATED)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER], level="WORKSPACE")
    def instantiate(self, request, slug, pk):
        workspace = Workspace.objects.filter(slug=slug).first()
        if workspace is None:
            return Response({"error": "Workspace does not exist"}, status=status.HTTP_404_NOT_FOUND)

        template = self.get_queryset().filter(pk=pk).first()
        if template is None:
            return Response({"error": "Project template does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectTemplateInstantiateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        project_name = (
            serializer.validated_data.get("name")
            or template.payload.get("project", {}).get("name")
            or "Project from template"
        )
        project_identifier = serializer.validated_data["identifier"].strip().upper()
        if Project.objects.filter(workspace=workspace, name=project_name, deleted_at__isnull=True).exists():
            return Response({"error": "PROJECT_NAME_ALREADY_EXIST"}, status=status.HTTP_400_BAD_REQUEST)
        if Project.objects.filter(workspace=workspace, identifier=project_identifier, deleted_at__isnull=True).exists():
            return Response({"error": "PROJECT_IDENTIFIER_ALREADY_EXIST"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = instantiate_project_template(
                template,
                workspace,
                name=project_name,
                identifier=project_identifier,
                variables=serializer.validated_data.get("variables") or {},
                user=request.user,
            )
        except (IntegrityError, ValueError) as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(ProjectListSerializer(project).data, status=status.HTTP_201_CREATED)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST], level="WORKSPACE")
    def placeholders(self, request, slug, pk):
        template = self.get_queryset().filter(pk=pk).first()
        if template is None:
            return Response({"error": "Project template does not exist"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"placeholders": extract_placeholders(template.payload)}, status=status.HTTP_200_OK)
