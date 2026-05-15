# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.urls import path

from plane.app.views import IssueWorklogViewSet, WorkspaceWorklogCSVExportView, WorkspaceWorklogView

urlpatterns = [
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/worklogs/",
        IssueWorklogViewSet.as_view({"get": "list", "post": "create"}),
        name="issue-worklogs",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/worklogs/<uuid:pk>/",
        IssueWorklogViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="issue-worklogs",
    ),
    path(
        "workspaces/<str:slug>/worklogs/",
        WorkspaceWorklogView.as_view(),
        name="workspace-worklogs",
    ),
    path(
        "workspaces/<str:slug>/worklogs/export/",
        WorkspaceWorklogCSVExportView.as_view(),
        name="workspace-worklogs-export",
    ),
]
