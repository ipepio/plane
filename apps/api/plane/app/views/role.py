# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.db import transaction
from django.db.models import Count

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from rest_framework.views import APIView

from plane.app.permissions import HasWorkspacePermission
from plane.app.serializers.role import (
    PermissionSerializer,
    RoleSerializer,
    RoleCreateSerializer,
)
from plane.db.models import Permission, Role, RolePermission, Workspace, WorkspaceMember


class RoleViewSet(ModelViewSet):
    required_permission = "workspace.manage_roles"
    permission_classes = [HasWorkspacePermission]

    def get_queryset(self):
        return (
            Role.objects.filter(workspace__slug=self.kwargs["slug"])
            .annotate(members_count=Count("workspace_members", distinct=True))
            .order_by("level", "name")
        )

    def get_serializer_class(self):
        if self.action in ("create",):
            return RoleCreateSerializer
        return RoleSerializer

    def perform_create(self, serializer):
        workspace = Workspace.objects.get(slug=self.kwargs["slug"])
        serializer.save(workspace=workspace, is_system=False)

    def _check_system_role(self, instance):
        if instance.is_system:
            return Response(
                {"error": "System roles cannot be modified."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        err = self._check_system_role(instance)
        if err:
            return err
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        err = self._check_system_role(instance)
        if err:
            return err
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        err = self._check_system_role(instance)
        if err:
            return err
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["get", "put"], url_path="permissions")
    def role_permissions(self, request, slug, pk=None):
        """GET: current codes. PUT: replace the full permission set."""
        role = self.get_object()

        if request.method == "GET":
            codes = list(role.permissions.values_list("code", flat=True))
            return Response({"permission_codes": codes})

        # PUT
        err = self._check_system_role(role)
        if err:
            return err

        codes = request.data.get("permission_codes", [])
        if not isinstance(codes, list):
            return Response(
                {"error": "permission_codes must be a list."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        valid_perms = Permission.objects.filter(code__in=codes)
        valid_codes = set(valid_perms.values_list("code", flat=True))
        invalid = [c for c in codes if c not in valid_codes]
        if invalid:
            return Response(
                {"invalid_codes": invalid},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            RolePermission.objects.filter(role=role).delete()
            RolePermission.objects.bulk_create(
                [RolePermission(role=role, permission=p) for p in valid_perms],
                ignore_conflicts=True,
            )

        return Response({"permission_codes": list(valid_codes)})

    @action(detail=False, methods=["get"], url_path="permissions")
    def list_permissions(self, request, slug):
        """Return the full permission catalog (read-only)."""
        perms = Permission.objects.all().order_by("category", "code")
        return Response(PermissionSerializer(perms, many=True).data)


class MePermissionsView(APIView):
    """GET /workspaces/<slug>/me/permissions/ — return caller's permission codes."""

    def get(self, request, slug):
        try:
            member = (
                WorkspaceMember.objects.select_related("role_id")
                .get(workspace__slug=slug, member=request.user, is_active=True)
            )
        except WorkspaceMember.DoesNotExist:
            return Response({"permission_codes": []})

        role = member.role_id
        if role is None:
            return Response({"permission_codes": [], "note": "No role assigned yet."})

        codes = list(role.permissions.values_list("code", flat=True))
        return Response({
            "role_id": str(role.id),
            "role_name": role.name,
            "permission_codes": codes,
        })
