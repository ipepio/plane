# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.urls import path

from plane.app.views.workspace_intake import (
    IntakeFormFieldOptionViewSet,
    IntakeFormFieldViewSet,
    WorkspaceIntakeIssueViewSet,
    WorkspaceIntakeViewSet,
)


urlpatterns = [
    path(
        "workspaces/<str:slug>/workspace-intakes/",
        WorkspaceIntakeViewSet.as_view({"get": "list", "post": "create"}),
        name="workspace-intake",
    ),
    path(
        "workspaces/<str:slug>/workspace-intakes/<uuid:pk>/",
        WorkspaceIntakeViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="workspace-intake",
    ),
    path(
        "workspaces/<str:slug>/intakes/<uuid:intake_id>/form-fields/",
        IntakeFormFieldViewSet.as_view({"get": "list", "post": "create"}),
        name="workspace-intake-form-field",
    ),
    path(
        "workspaces/<str:slug>/intakes/<uuid:intake_id>/form-fields/reorder/",
        IntakeFormFieldViewSet.as_view({"post": "reorder"}),
        name="workspace-intake-form-field-reorder",
    ),
    path(
        "workspaces/<str:slug>/intakes/<uuid:intake_id>/form-fields/<uuid:pk>/",
        IntakeFormFieldViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="workspace-intake-form-field",
    ),
    path(
        "workspaces/<str:slug>/intakes/<uuid:intake_id>/form-fields/<uuid:field_id>/options/",
        IntakeFormFieldOptionViewSet.as_view({"get": "list", "post": "create"}),
        name="workspace-intake-form-field-option",
    ),
    path(
        "workspaces/<str:slug>/intakes/<uuid:intake_id>/form-fields/<uuid:field_id>/options/<uuid:pk>/",
        IntakeFormFieldOptionViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="workspace-intake-form-field-option",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/intakes/<uuid:intake_id>/form-fields/",
        IntakeFormFieldViewSet.as_view({"get": "list", "post": "create"}),
        name="project-intake-form-field",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/intakes/<uuid:intake_id>/form-fields/reorder/",
        IntakeFormFieldViewSet.as_view({"post": "reorder"}),
        name="project-intake-form-field-reorder",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/intakes/<uuid:intake_id>/form-fields/<uuid:pk>/",
        IntakeFormFieldViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="project-intake-form-field",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/intakes/<uuid:intake_id>/form-fields/<uuid:field_id>/options/",
        IntakeFormFieldOptionViewSet.as_view({"get": "list", "post": "create"}),
        name="project-intake-form-field-option",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/intakes/<uuid:intake_id>/form-fields/<uuid:field_id>/options/<uuid:pk>/",
        IntakeFormFieldOptionViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="project-intake-form-field-option",
    ),
    path(
        "workspaces/<str:slug>/workspace-intake-issues/",
        WorkspaceIntakeIssueViewSet.as_view({"get": "list", "post": "create"}),
        name="workspace-intake-issue",
    ),
    path(
        "workspaces/<str:slug>/workspace-intake-issues/<uuid:pk>/",
        WorkspaceIntakeIssueViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="workspace-intake-issue",
    ),
    path(
        "workspaces/<str:slug>/workspace-intake-issues/<uuid:pk>/accept/",
        WorkspaceIntakeIssueViewSet.as_view({"post": "accept"}),
        name="workspace-intake-issue-accept",
    ),
    path(
        "workspaces/<str:slug>/workspace-intake-issues/<uuid:pk>/reject/",
        WorkspaceIntakeIssueViewSet.as_view({"post": "reject"}),
        name="workspace-intake-issue-reject",
    ),
    path(
        "workspaces/<str:slug>/workspace-intake-issues/<uuid:pk>/snooze/",
        WorkspaceIntakeIssueViewSet.as_view({"post": "snooze"}),
        name="workspace-intake-issue-snooze",
    ),
    path(
        "workspaces/<str:slug>/workspace-intake-issues/<uuid:pk>/duplicate/",
        WorkspaceIntakeIssueViewSet.as_view({"post": "duplicate"}),
        name="workspace-intake-issue-duplicate",
    ),
]
