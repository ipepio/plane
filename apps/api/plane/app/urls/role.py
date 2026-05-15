# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.urls import path

from plane.app.views.role import MePermissionsView, RoleViewSet

urlpatterns = [
    path(
        "workspaces/<str:slug>/roles/",
        RoleViewSet.as_view({"get": "list", "post": "create"}),
        name="workspace-roles",
    ),
    path(
        "workspaces/<str:slug>/roles/<uuid:pk>/",
        RoleViewSet.as_view({
            "get": "retrieve",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="workspace-role-detail",
    ),
    path(
        "workspaces/<str:slug>/roles/permissions/",
        RoleViewSet.as_view({"get": "list_permissions"}),
        name="workspace-permission-catalog",
    ),
    path(
        "workspaces/<str:slug>/me/permissions/",
        MePermissionsView.as_view(),
        name="workspace-me-permissions",
    ),
]
