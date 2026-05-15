# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import csv

from django.db.models import F, Q, Sum
from django.db.models.functions import TruncDay, TruncMonth, TruncWeek
from django.http import HttpResponse
from django.utils.dateparse import parse_date

from rest_framework import status
from rest_framework.response import Response

from plane.app.permissions import ROLE, allow_permission
from plane.app.serializers import IssueWorklogSerializer, WorkspaceWorklogReadSerializer
from plane.app.views.base import BaseAPIView, BaseViewSet
from plane.db.models import Issue, IssueWorklog, ProjectMember, WorkspaceMember


def _ids_from_query(request, key):
    return request.GET.getlist(key) or request.GET.getlist(f"{key}[]") or ([request.GET.get(key)] if request.GET.get(key) else [])


def _is_workspace_admin_or_member(user, slug):
    return WorkspaceMember.objects.filter(
        member=user,
        workspace__slug=slug,
        role__in=[ROLE.ADMIN.value, ROLE.MEMBER.value],
        is_active=True,
    ).exists()


def _is_project_admin(user, slug, project_id):
    return ProjectMember.objects.filter(
        member=user,
        workspace__slug=slug,
        project_id=project_id,
        role=ROLE.ADMIN.value,
        is_active=True,
    ).exists() or WorkspaceMember.objects.filter(
        member=user,
        workspace__slug=slug,
        role=ROLE.ADMIN.value,
        is_active=True,
    ).exists()


def _workspace_worklogs_queryset(request, slug):
    queryset = IssueWorklog.objects.filter(workspace__slug=slug).select_related("logged_by", "project", "issue")

    start = parse_date(request.GET.get("from") or "")
    end = parse_date(request.GET.get("to") or "")
    if start:
        queryset = queryset.filter(started_at__date__gte=start)
    if end:
        queryset = queryset.filter(started_at__date__lte=end)

    user_ids = _ids_from_query(request, "user")
    if user_ids:
        queryset = queryset.filter(logged_by_id__in=user_ids)

    project_ids = _ids_from_query(request, "project")
    if project_ids:
        queryset = queryset.filter(project_id__in=project_ids)

    billable = request.GET.get("billable")
    if billable in ["true", "false"]:
        queryset = queryset.filter(is_billable=billable == "true")

    if not _is_workspace_admin_or_member(request.user, slug):
        queryset = queryset.filter(logged_by=request.user)

    return queryset


class IssueWorklogViewSet(BaseViewSet):
    serializer_class = IssueWorklogSerializer
    model = IssueWorklog

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                workspace__slug=self.kwargs.get("slug"),
                project_id=self.kwargs.get("project_id"),
                issue_id=self.kwargs.get("issue_id"),
            )
            .select_related("logged_by", "project", "issue")
        )

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def list(self, request, slug, project_id, issue_id):
        queryset = self.get_queryset()
        return self.paginate(
            request=request,
            queryset=queryset,
            on_results=lambda worklogs: IssueWorklogSerializer(worklogs, many=True).data,
            default_per_page=50,
            max_per_page=100,
        )

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def create(self, request, slug, project_id, issue_id):
        if not Issue.objects.filter(id=issue_id, project_id=project_id, workspace__slug=slug).exists():
            return Response({"error": "The required issue does not exist."}, status=status.HTTP_404_NOT_FOUND)

        serializer = IssueWorklogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        worklog = serializer.save(project_id=project_id, issue_id=issue_id, logged_by=request.user)
        return Response(IssueWorklogSerializer(worklog).data, status=status.HTTP_201_CREATED)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def retrieve(self, request, slug, project_id, issue_id, pk=None):
        return Response(IssueWorklogSerializer(self.get_object()).data)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def partial_update(self, request, slug, project_id, issue_id, pk=None):
        worklog = self.get_object()
        if worklog.logged_by_id != request.user.id and not _is_project_admin(request.user, slug, project_id):
            return Response({"error": "You cannot update this worklog."}, status=status.HTTP_403_FORBIDDEN)

        serializer = IssueWorklogSerializer(worklog, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def destroy(self, request, slug, project_id, issue_id, pk=None):
        worklog = self.get_object()
        if worklog.logged_by_id != request.user.id and not _is_project_admin(request.user, slug, project_id):
            return Response({"error": "You cannot delete this worklog."}, status=status.HTTP_403_FORBIDDEN)
        worklog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WorkspaceWorklogView(BaseAPIView):
    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST], level="WORKSPACE")
    def get(self, request, slug):
        queryset = _workspace_worklogs_queryset(request, slug)
        group_by = request.GET.get("group_by")

        if group_by:
            grouped = self._group_queryset(queryset, group_by)
            if grouped is None:
                return Response({"error": "Invalid group_by value."}, status=status.HTTP_400_BAD_REQUEST)
            return Response(grouped)

        return self.paginate(
            request=request,
            queryset=queryset,
            on_results=lambda worklogs: WorkspaceWorklogReadSerializer(worklogs, many=True).data,
            default_per_page=50,
            max_per_page=100,
        )

    def _group_queryset(self, queryset, group_by):
        if group_by == "day":
            queryset = queryset.annotate(group=TruncDay("started_at")).values("group")
        elif group_by == "week":
            queryset = queryset.annotate(group=TruncWeek("started_at")).values("group")
        elif group_by == "month":
            queryset = queryset.annotate(group=TruncMonth("started_at")).values("group")
        elif group_by == "user":
            queryset = queryset.values(group=F("logged_by_id"), label=F("logged_by__display_name"))
        elif group_by == "project":
            queryset = queryset.values(group=F("project_id"), label=F("project__name"))
        else:
            return None

        rows = queryset.annotate(
            total_seconds=Sum("duration"),
            billable_seconds=Sum("duration", filter=Q(is_billable=True)),
        ).order_by("group")

        response = []
        for row in rows:
            group = row.get("group")
            response.append(
                {
                    "group": group.isoformat() if hasattr(group, "isoformat") else str(group),
                    "label": row.get("label") or (group.isoformat() if hasattr(group, "isoformat") else str(group)),
                    "total_seconds": row.get("total_seconds") or 0,
                    "billable_seconds": row.get("billable_seconds") or 0,
                }
            )
        return response


class WorkspaceWorklogCSVExportView(BaseAPIView):
    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST], level="WORKSPACE")
    def get(self, request, slug):
        queryset = _workspace_worklogs_queryset(request, slug)
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="worklogs.csv"'

        writer = csv.writer(response)
        writer.writerow(["date", "user", "project", "issue", "duration_minutes", "billable", "description"])
        for worklog in queryset.order_by("started_at"):
            writer.writerow(
                [
                    worklog.started_at.date().isoformat(),
                    worklog.logged_by.display_name,
                    worklog.project.name,
                    f"{worklog.project.identifier}-{worklog.issue.sequence_id}",
                    round(worklog.duration / 60, 2),
                    "true" if worklog.is_billable else "false",
                    worklog.description,
                ]
            )

        return response
