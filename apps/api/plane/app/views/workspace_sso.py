# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from plane.app.permissions import HasWorkspacePermission
from plane.app.serializers.workspace_sso import WorkspaceSSOConfigSerializer
from plane.db.models import Workspace, WorkspaceSSOConfig


class WorkspaceSSOConfigView(APIView):
    required_permission = "sso.manage"
    permission_classes = [HasWorkspacePermission]

    def get(self, request, slug):
        workspace = Workspace.objects.get(slug=slug)
        config = WorkspaceSSOConfig.objects.filter(workspace=workspace).first()
        if config is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(WorkspaceSSOConfigSerializer(config).data)

    def put(self, request, slug):
        return self._upsert(request, slug, partial=False)

    def patch(self, request, slug):
        return self._upsert(request, slug, partial=True)

    def delete(self, request, slug):
        workspace = Workspace.objects.get(slug=slug)
        config = WorkspaceSSOConfig.objects.filter(workspace=workspace).first()
        if config is None:
            return Response(status=status.HTTP_204_NO_CONTENT)
        config.enabled = False
        config.save(update_fields=["enabled", "updated_at"])
        return Response(WorkspaceSSOConfigSerializer(config).data)

    def _upsert(self, request, slug, partial):
        workspace = Workspace.objects.get(slug=slug)
        config = WorkspaceSSOConfig.objects.filter(workspace=workspace).first()
        serializer = WorkspaceSSOConfigSerializer(config, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save(workspace=workspace)
        return Response(serializer.data, status=status.HTTP_200_OK if config else status.HTTP_201_CREATED)
