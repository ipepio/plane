# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.urls import path

from plane.app.views import (
    IssuePropertyOptionViewSet,
    IssuePropertyValueEndpoint,
    IssuePropertyViewSet,
    ProjectIssueTypeViewSet,
)

urlpatterns = [
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issue-types/",
        ProjectIssueTypeViewSet.as_view({"get": "list"}),
        name="project-issue-types",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issue-types/<uuid:issue_type_id>/properties/",
        IssuePropertyViewSet.as_view({"get": "list", "post": "create"}),
        name="issue-type-properties",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issue-types/<uuid:issue_type_id>/properties/reorder/",
        IssuePropertyViewSet.as_view({"post": "reorder"}),
        name="issue-type-properties-reorder",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issue-types/<uuid:issue_type_id>/properties/<uuid:pk>/",
        IssuePropertyViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="issue-type-properties",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issue-types/<uuid:issue_type_id>/properties/<uuid:property_id>/options/",
        IssuePropertyOptionViewSet.as_view({"get": "list", "post": "create"}),
        name="issue-property-options",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issue-types/<uuid:issue_type_id>/properties/<uuid:property_id>/options/reorder/",
        IssuePropertyOptionViewSet.as_view({"post": "reorder"}),
        name="issue-property-options-reorder",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issue-types/<uuid:issue_type_id>/properties/<uuid:property_id>/options/<uuid:pk>/",
        IssuePropertyOptionViewSet.as_view({"patch": "partial_update", "delete": "destroy"}),
        name="issue-property-options",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/property-values/",
        IssuePropertyValueEndpoint.as_view(),
        name="issue-property-values",
    ),
]
