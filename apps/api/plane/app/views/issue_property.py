# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.db import transaction

from rest_framework import status
from rest_framework.response import Response

from plane.app.permissions import ProjectEntityPermission, ROLE, allow_permission
from plane.app.serializers import (
    IssuePropertyOptionSerializer,
    IssuePropertySerializer,
    IssuePropertyValueSerializer,
    ProjectIssueTypeSerializer,
)
from plane.app.serializers.issue_property import upsert_issue_property_values
from plane.app.views.base import BaseAPIView, BaseViewSet
from plane.db.models import Issue, IssueProperty, IssuePropertyOption, IssuePropertyValue, IssueType, ProjectIssueType


class ProjectIssueTypeViewSet(BaseViewSet):
    serializer_class = ProjectIssueTypeSerializer
    model = ProjectIssueType
    permission_classes = [ProjectEntityPermission]

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(workspace__slug=self.kwargs.get("slug"), project_id=self.kwargs.get("project_id"))
            .select_related("issue_type")
            .order_by("level", "issue_type__name")
        )


class IssuePropertyViewSet(BaseViewSet):
    serializer_class = IssuePropertySerializer
    model = IssueProperty

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                workspace__slug=self.kwargs.get("slug"),
                project_id=self.kwargs.get("project_id"),
                issue_type_id=self.kwargs.get("issue_type_id"),
                deleted_at__isnull=True,
            )
            .prefetch_related("options")
        )

    def _issue_type(self):
        return IssueType.objects.get(id=self.kwargs.get("issue_type_id"), workspace__slug=self.kwargs.get("slug"))

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def list(self, request, slug, project_id, issue_type_id):
        return Response(IssuePropertySerializer(self.get_queryset(), many=True).data)

    @allow_permission([ROLE.ADMIN])
    def create(self, request, slug, project_id, issue_type_id):
        if not ProjectIssueType.objects.filter(project_id=project_id, issue_type_id=issue_type_id, workspace__slug=slug).exists():
            return Response({"error": "Issue type is not enabled for this project."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = IssuePropertySerializer(
            data=request.data,
            context={"issue_type": self._issue_type(), "project_id": project_id},
        )
        serializer.is_valid(raise_exception=True)
        property = serializer.save(workspace_id=self._issue_type().workspace_id, project_id=project_id, issue_type_id=issue_type_id)
        return Response(IssuePropertySerializer(property).data, status=status.HTTP_201_CREATED)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def retrieve(self, request, slug, project_id, issue_type_id, pk=None):
        return Response(IssuePropertySerializer(self.get_object()).data)

    @allow_permission([ROLE.ADMIN])
    def partial_update(self, request, slug, project_id, issue_type_id, pk=None):
        property = self.get_object()
        serializer = IssuePropertySerializer(
            property,
            data=request.data,
            partial=True,
            context={"issue_type": self._issue_type(), "project_id": project_id},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @allow_permission([ROLE.ADMIN])
    def destroy(self, request, slug, project_id, issue_type_id, pk=None):
        self.get_object().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @allow_permission([ROLE.ADMIN])
    def reorder(self, request, slug, project_id, issue_type_id):
        ordered_ids = request.data.get("property_ids", [])
        if not isinstance(ordered_ids, list):
            return Response({"property_ids": "Expected a list."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            for index, property_id in enumerate(ordered_ids):
                self.get_queryset().filter(id=property_id).update(relative_order=(index + 1) * 1000)
        return Response(IssuePropertySerializer(self.get_queryset(), many=True).data)


class IssuePropertyOptionViewSet(BaseViewSet):
    serializer_class = IssuePropertyOptionSerializer
    model = IssuePropertyOption

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                workspace__slug=self.kwargs.get("slug"),
                project_id=self.kwargs.get("project_id"),
                property_id=self.kwargs.get("property_id"),
                deleted_at__isnull=True,
            )
        )

    def _property(self):
        return IssueProperty.objects.get(
            id=self.kwargs.get("property_id"),
            project_id=self.kwargs.get("project_id"),
            issue_type_id=self.kwargs.get("issue_type_id"),
            workspace__slug=self.kwargs.get("slug"),
        )

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def list(self, request, slug, project_id, issue_type_id, property_id):
        return Response(IssuePropertyOptionSerializer(self.get_queryset(), many=True).data)

    @allow_permission([ROLE.ADMIN])
    def create(self, request, slug, project_id, issue_type_id, property_id):
        property = self._property()
        serializer = IssuePropertyOptionSerializer(data=request.data, context={"property": property})
        serializer.is_valid(raise_exception=True)
        option = serializer.save(workspace_id=property.workspace_id, project_id=project_id, property=property)
        return Response(IssuePropertyOptionSerializer(option).data, status=status.HTTP_201_CREATED)

    @allow_permission([ROLE.ADMIN])
    def partial_update(self, request, slug, project_id, issue_type_id, property_id, pk=None):
        property = self._property()
        option = self.get_object()
        serializer = IssuePropertyOptionSerializer(option, data=request.data, partial=True, context={"property": property})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @allow_permission([ROLE.ADMIN])
    def destroy(self, request, slug, project_id, issue_type_id, property_id, pk=None):
        self.get_object().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @allow_permission([ROLE.ADMIN])
    def reorder(self, request, slug, project_id, issue_type_id, property_id):
        ordered_ids = request.data.get("option_ids", [])
        if not isinstance(ordered_ids, list):
            return Response({"option_ids": "Expected a list."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            for index, option_id in enumerate(ordered_ids):
                self.get_queryset().filter(id=option_id).update(relative_order=(index + 1) * 1000)
        return Response(IssuePropertyOptionSerializer(self.get_queryset(), many=True).data)


class IssuePropertyValueEndpoint(BaseAPIView):
    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def get(self, request, slug, project_id, issue_id):
        queryset = (
            IssuePropertyValue.objects.filter(issue_id=issue_id, project_id=project_id, workspace__slug=slug)
            .select_related("property", "value_user", "value_option")
            .prefetch_related("property__options", "selected_options__option")
        )
        return Response(IssuePropertyValueSerializer(queryset, many=True).data)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER])
    def post(self, request, slug, project_id, issue_id):
        issue = Issue.objects.get(id=issue_id, project_id=project_id, workspace__slug=slug)
        payload = request.data.get("values", request.data)
        upsert_issue_property_values(issue, payload, enforce_required=False)
        queryset = (
            IssuePropertyValue.objects.filter(issue=issue)
            .select_related("property", "value_user", "value_option")
            .prefetch_related("property__options", "selected_options__option")
        )
        return Response(IssuePropertyValueSerializer(queryset, many=True).data)
