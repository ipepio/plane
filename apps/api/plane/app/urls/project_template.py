# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.urls import path

from plane.app.views import ProjectTemplateViewSet


urlpatterns = [
    path(
        "workspaces/<str:slug>/project-templates/",
        ProjectTemplateViewSet.as_view({"get": "list", "post": "create"}),
        name="project-template",
    ),
    path(
        "workspaces/<str:slug>/project-templates/save-as/",
        ProjectTemplateViewSet.as_view({"post": "save_as"}),
        name="project-template-save-as",
    ),
    path(
        "workspaces/<str:slug>/project-templates/<uuid:pk>/",
        ProjectTemplateViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="project-template",
    ),
    path(
        "workspaces/<str:slug>/project-templates/<uuid:pk>/instantiate/",
        ProjectTemplateViewSet.as_view({"post": "instantiate"}),
        name="project-template-instantiate",
    ),
    path(
        "workspaces/<str:slug>/project-templates/<uuid:pk>/placeholders/",
        ProjectTemplateViewSet.as_view({"get": "placeholders"}),
        name="project-template-placeholders",
    ),
]
