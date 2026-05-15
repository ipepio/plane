# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.db import IntegrityError, transaction
from django.db.models import Count, Q

from rest_framework import status
from rest_framework.response import Response

from plane.app.permissions import WorkspaceUserPermission, has_permission
from plane.app.serializers import TeamDetailSerializer, TeamMemberSerializer, TeamSerializer
from plane.app.views.base import BaseViewSet
from plane.db.models import Team, TeamMember, Workspace


class TeamViewSet(BaseViewSet):
    serializer_class = TeamSerializer
    model = Team
    permission_classes = [WorkspaceUserPermission]
    search_fields = ["name", "description"]

    def _workspace(self):
        return Workspace.objects.get(slug=self.kwargs.get("slug"))

    def _require_manage_teams(self, request, workspace):
        if not has_permission(request.user, workspace, "team.manage"):
            return Response({"error": "You cannot manage workspace teams."}, status=status.HTTP_403_FORBIDDEN)
        return None

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TeamDetailSerializer
        return TeamSerializer

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(workspace__slug=self.kwargs.get("slug"), deleted_at__isnull=True)
            .select_related("workspace")
            .prefetch_related("team_members__member")
            .annotate(member_count=Count("team_members", filter=Q(team_members__deleted_at__isnull=True)))
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["workspace"] = self._workspace()
        return context

    def create(self, request, slug):
        workspace = self._workspace()
        permission_error = self._require_manage_teams(request, workspace)
        if permission_error:
            return permission_error

        serializer = TeamSerializer(data=request.data, context={"workspace": workspace})
        serializer.is_valid(raise_exception=True)
        team = serializer.save(workspace=workspace)
        return Response(TeamDetailSerializer(team, context={"workspace": workspace}).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, slug, pk=None, *args, **kwargs):
        workspace = self._workspace()
        permission_error = self._require_manage_teams(request, workspace)
        if permission_error:
            return permission_error
        return super().partial_update(request, *args, **kwargs)

    def update(self, request, slug, pk=None, *args, **kwargs):
        workspace = self._workspace()
        permission_error = self._require_manage_teams(request, workspace)
        if permission_error:
            return permission_error
        return super().update(request, *args, **kwargs)

    def destroy(self, request, slug, pk):
        workspace = self._workspace()
        permission_error = self._require_manage_teams(request, workspace)
        if permission_error:
            return permission_error
        team = self.get_object()
        team.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def search(self, request, slug):
        query = request.GET.get("q", "").strip()
        queryset = self.get_queryset()
        if query:
            queryset = queryset.filter(Q(name__icontains=query) | Q(description__icontains=query))
        return Response(TeamSerializer(queryset[:20], many=True, context=self.get_serializer_context()).data)

    def add_members(self, request, slug, pk):
        workspace = self._workspace()
        permission_error = self._require_manage_teams(request, workspace)
        if permission_error:
            return permission_error

        team = self.get_object()
        incoming_members = request.data.get("members", [])
        if not isinstance(incoming_members, list) or not incoming_members:
            return Response({"members": "Provide at least one member."}, status=status.HTTP_400_BAD_REQUEST)

        serializers = [TeamMemberSerializer(data=item, context={"workspace": workspace}) for item in incoming_members]
        for serializer in serializers:
            serializer.is_valid(raise_exception=True)

        member_ids = [serializer.validated_data["member"].id for serializer in serializers]
        conflicts = list(
            TeamMember.objects.filter(team=team, member_id__in=member_ids, deleted_at__isnull=True).values_list(
                "member_id", flat=True
            )
        )
        if conflicts:
            return Response({"members": [str(member_id) for member_id in conflicts]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                created = [
                    TeamMember.objects.create(
                        workspace=workspace,
                        team=team,
                        member=serializer.validated_data["member"],
                        role=serializer.validated_data.get("role", "member"),
                    )
                    for serializer in serializers
                ]
        except IntegrityError:
            return Response({"error": "One or more members already belong to this team."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(TeamMemberSerializer(created, many=True, context={"workspace": workspace}).data, status=status.HTTP_201_CREATED)

    def update_member(self, request, slug, pk, member_id):
        workspace = self._workspace()
        permission_error = self._require_manage_teams(request, workspace)
        if permission_error:
            return permission_error

        team_member = TeamMember.objects.get(team_id=pk, member_id=member_id, team__workspace=workspace)
        serializer = TeamMemberSerializer(team_member, data=request.data, partial=True, context={"workspace": workspace})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def remove_member(self, request, slug, pk, member_id):
        workspace = self._workspace()
        permission_error = self._require_manage_teams(request, workspace)
        if permission_error:
            return permission_error

        team_member = TeamMember.objects.get(team_id=pk, member_id=member_id, team__workspace=workspace)
        team_member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
