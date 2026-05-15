# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response

from plane.app.permissions import WorkspaceUserPermission, has_permission
from plane.app.serializers import (
    IntakeFormFieldOptionSerializer,
    IntakeFormFieldSerializer,
    IssueCreateSerializer,
    WorkspaceIntakeAcceptSerializer,
    WorkspaceIntakeDuplicateSerializer,
    WorkspaceIntakeIssueSerializer,
    WorkspaceIntakeRejectSerializer,
    WorkspaceIntakeSerializer,
    WorkspaceIntakeSnoozeSerializer,
    persist_workspace_intake_form_values,
    render_workspace_intake_form_values_html,
)
from plane.app.views.base import BaseViewSet
from plane.db.models import (
    Intake,
    IntakeFormField,
    IntakeFormFieldOption,
    IntakeIssue,
    Project,
    Workspace,
    WorkspaceIntake,
    WorkspaceIntakeIssue,
)
from plane.db.models.intake import IntakeIssueStatus, SourceType


class WorkspaceIntakeViewSet(BaseViewSet):
    serializer_class = WorkspaceIntakeSerializer
    model = WorkspaceIntake
    permission_classes = [WorkspaceUserPermission]

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(workspace__slug=self.kwargs.get("slug"))
            .annotate(pending_issue_count=Count("issues", filter=Q(issues__status=IntakeIssueStatus.PENDING.value)))
            .select_related("workspace")
        )

    def _workspace(self):
        return Workspace.objects.get(slug=self.kwargs.get("slug"))

    def _require_manage_forms(self, request, workspace):
        if not has_permission(request.user, workspace, "intake.manage_forms"):
            return Response({"error": "You cannot manage workspace intake forms."}, status=status.HTTP_403_FORBIDDEN)
        return None

    def create(self, request, slug):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        return super().create(request, slug)

    def update(self, request, slug, pk):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        return super().update(request)

    def partial_update(self, request, slug, pk):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        return super().partial_update(request)

    def perform_create(self, serializer):
        workspace = self._workspace()
        with transaction.atomic():
            if serializer.validated_data.get("is_default"):
                WorkspaceIntake.objects.filter(workspace=workspace, is_default=True).update(is_default=False)
            serializer.save(workspace=workspace)

    def perform_update(self, serializer):
        with transaction.atomic():
            if serializer.validated_data.get("is_default"):
                WorkspaceIntake.objects.filter(
                    workspace__slug=self.kwargs.get("slug"), is_default=True
                ).exclude(pk=serializer.instance.pk).update(is_default=False)
            serializer.save()

    def destroy(self, request, slug, pk):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error

        intake = self.get_object()
        if intake.is_default:
            return Response({"error": "You cannot delete the default intake"}, status=status.HTTP_400_BAD_REQUEST)
        intake.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WorkspaceIntakeIssueViewSet(BaseViewSet):
    serializer_class = WorkspaceIntakeIssueSerializer
    model = WorkspaceIntakeIssue
    permission_classes = [WorkspaceUserPermission]
    filterset_fields = ["status", "intake"]

    def get_queryset(self):
        queryset = (
            super()
            .get_queryset()
            .filter(workspace__slug=self.kwargs.get("slug"))
            .select_related("workspace", "intake", "issue", "duplicate_to")
            .order_by(self.request.GET.get("order_by", "-created_at"))
        )
        if getattr(self, "action", None) in ["retrieve", "partial_update", "destroy"]:
            workspace = self._workspace()
            if not self._can_triage(self.request, workspace):
                queryset = queryset.filter(created_by=self.request.user)
        return queryset

    def _workspace(self):
        return Workspace.objects.get(slug=self.kwargs.get("slug"))

    def _can_triage(self, request, workspace):
        return has_permission(request.user, workspace, "intake.triage")

    def list(self, request, slug):
        workspace = self._workspace()
        queryset = self.get_queryset()

        statuses = [item for item in request.GET.get("status", "-2").split(",") if item != "null"]
        if statuses:
            queryset = queryset.filter(status__in=statuses)

        if not self._can_triage(request, workspace):
            queryset = queryset.filter(created_by=request.user)

        return self.paginate(
            request=request,
            queryset=queryset,
            on_results=lambda issues: WorkspaceIntakeIssueSerializer(
                issues, many=True, context={"slug": slug}
            ).data,
        )

    def create(self, request, slug):
        data = request.data.copy()
        form_values = data.pop("form_values", [])
        if not data.get("intake"):
            default_intake = WorkspaceIntake.objects.filter(workspace__slug=slug, is_default=True).first()
            if default_intake is None:
                return Response({"error": "No default workspace intake configured."}, status=status.HTTP_400_BAD_REQUEST)
            data["intake"] = default_intake.id

        serializer = WorkspaceIntakeIssueSerializer(data=data, context={"slug": slug})
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            intake_issue = serializer.save(workspace=self._workspace(), source=SourceType.IN_APP)
            persist_workspace_intake_form_values(intake_issue, form_values)
        return Response(WorkspaceIntakeIssueSerializer(intake_issue, context={"slug": slug}).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, slug, pk):
        workspace = self._workspace()
        intake_issue = self.get_object()
        if not self._can_triage(request, workspace) and intake_issue.created_by_id != request.user.id:
            return Response({"error": "You cannot edit this intake ticket."}, status=status.HTTP_403_FORBIDDEN)

        allowed_fields = {"name", "description_json", "description_html", "priority", "extra"}
        if self._can_triage(request, workspace):
            allowed_fields.update({"decision_note", "snoozed_till"})
        data = {key: value for key, value in request.data.items() if key in allowed_fields}
        serializer = WorkspaceIntakeIssueSerializer(intake_issue, data=data, partial=True, context={"slug": slug})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, slug, pk):
        workspace = self._workspace()
        intake_issue = self.get_object()
        if not self._can_triage(request, workspace) and intake_issue.created_by_id != request.user.id:
            return Response({"error": "You cannot delete this intake ticket."}, status=status.HTTP_403_FORBIDDEN)
        intake_issue.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _require_triage(self, request, workspace):
        if not self._can_triage(request, workspace):
            return Response({"error": "You cannot triage workspace intake tickets."}, status=status.HTTP_403_FORBIDDEN)
        return None

    def accept(self, request, slug, pk):
        workspace = self._workspace()
        permission_error = self._require_triage(request, workspace)
        if permission_error:
            return permission_error

        intake_issue = self.get_object()
        serializer = WorkspaceIntakeAcceptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        project = Project.objects.filter(id=serializer.validated_data["project"], workspace=workspace).first()
        if project is None:
            return Response({"project": "Project does not belong to this workspace."}, status=status.HTTP_400_BAD_REQUEST)

        destination_intake = None
        if serializer.validated_data.get("intake"):
            destination_intake = Intake.objects.filter(
                id=serializer.validated_data["intake"], workspace=workspace, project=project
            ).first()
            if destination_intake is None:
                return Response({"intake": "Intake does not belong to this project."}, status=status.HTTP_400_BAD_REQUEST)

        issue_payload = {
            "name": intake_issue.name,
            "description_html": intake_issue.description_html,
            "description_json": intake_issue.description_json,
            "priority": intake_issue.priority,
        }
        rendered_form_values = render_workspace_intake_form_values_html(intake_issue)
        if rendered_form_values:
            issue_payload["description_html"] = f"{rendered_form_values}{issue_payload['description_html']}"
        if serializer.validated_data.get("state"):
            issue_payload["state_id"] = serializer.validated_data["state"]
        if serializer.validated_data.get("assignee_ids"):
            issue_payload["assignee_ids"] = serializer.validated_data["assignee_ids"]

        issue_serializer = IssueCreateSerializer(
            data=issue_payload,
            context={
                "project_id": project.id,
                "workspace_id": workspace.id,
                "default_assignee_id": project.default_assignee_id,
            },
        )
        issue_serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            issue = issue_serializer.save()
            intake_issue.issue = issue
            intake_issue.status = IntakeIssueStatus.ACCEPTED.value
            intake_issue.snoozed_till = None
            intake_issue.save(update_fields=["issue", "status", "snoozed_till", "updated_at"])

            if destination_intake:
                IntakeIssue.objects.create(
                    intake=destination_intake,
                    issue=issue,
                    workspace=workspace,
                    project=project,
                    status=IntakeIssueStatus.ACCEPTED.value,
                    source=SourceType.IN_APP,
                )

        return Response(WorkspaceIntakeIssueSerializer(intake_issue, context={"slug": slug}).data)

    def reject(self, request, slug, pk):
        workspace = self._workspace()
        permission_error = self._require_triage(request, workspace)
        if permission_error:
            return permission_error

        serializer = WorkspaceIntakeRejectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        intake_issue = self.get_object()
        intake_issue.status = IntakeIssueStatus.REJECTED.value
        intake_issue.decision_note = serializer.validated_data["decision_note"]
        intake_issue.save(update_fields=["status", "decision_note", "updated_at"])
        return Response(WorkspaceIntakeIssueSerializer(intake_issue, context={"slug": slug}).data)

    def snooze(self, request, slug, pk):
        workspace = self._workspace()
        permission_error = self._require_triage(request, workspace)
        if permission_error:
            return permission_error

        serializer = WorkspaceIntakeSnoozeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data["snoozed_till"] <= timezone.now():
            return Response({"snoozed_till": "Snooze date must be in the future."}, status=status.HTTP_400_BAD_REQUEST)

        intake_issue = self.get_object()
        intake_issue.status = IntakeIssueStatus.SNOOZED.value
        intake_issue.snoozed_till = serializer.validated_data["snoozed_till"]
        intake_issue.save(update_fields=["status", "snoozed_till", "updated_at"])
        return Response(WorkspaceIntakeIssueSerializer(intake_issue, context={"slug": slug}).data)

    def duplicate(self, request, slug, pk):
        workspace = self._workspace()
        permission_error = self._require_triage(request, workspace)
        if permission_error:
            return permission_error

        serializer = WorkspaceIntakeDuplicateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        target = WorkspaceIntakeIssue.objects.filter(
            workspace=workspace, id=serializer.validated_data["duplicate_to"]
        ).first()
        if target is None or str(target.id) == str(pk):
            return Response({"duplicate_to": "Target ticket is not valid."}, status=status.HTTP_400_BAD_REQUEST)

        intake_issue = self.get_object()
        intake_issue.status = IntakeIssueStatus.DUPLICATE.value
        intake_issue.duplicate_to = target
        intake_issue.decision_note = serializer.validated_data.get("decision_note", "")
        intake_issue.save(update_fields=["status", "duplicate_to", "decision_note", "updated_at"])
        return Response(WorkspaceIntakeIssueSerializer(intake_issue, context={"slug": slug}).data)


class IntakeFormFieldViewSet(BaseViewSet):
    serializer_class = IntakeFormFieldSerializer
    model = IntakeFormField
    permission_classes = [WorkspaceUserPermission]

    def _workspace(self):
        return Workspace.objects.get(slug=self.kwargs.get("slug"))

    def _require_manage_forms(self, request, workspace):
        if not has_permission(request.user, workspace, "intake.manage_forms"):
            return Response({"error": "You cannot manage intake form fields."}, status=status.HTTP_403_FORBIDDEN)
        return None

    def _workspace_intake(self):
        return WorkspaceIntake.objects.get(workspace__slug=self.kwargs.get("slug"), id=self.kwargs.get("intake_id"))

    def _project_intake(self):
        return Intake.objects.get(
            workspace__slug=self.kwargs.get("slug"),
            project_id=self.kwargs.get("project_id"),
            id=self.kwargs.get("intake_id"),
        )

    def get_queryset(self):
        queryset = (
            super()
            .get_queryset()
            .filter(workspace__slug=self.kwargs.get("slug"))
            .prefetch_related("options")
            .select_related("workspace", "project", "workspace_intake", "intake")
        )
        if self.kwargs.get("project_id"):
            queryset = queryset.filter(project_id=self.kwargs.get("project_id"), intake_id=self.kwargs.get("intake_id"))
        else:
            queryset = queryset.filter(workspace_intake_id=self.kwargs.get("intake_id"))
        return queryset

    def create(self, request, slug, intake_id, project_id=None):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error

        serializer = IntakeFormFieldSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if project_id:
            intake = self._project_intake()
            field = serializer.save(workspace=workspace, project_id=project_id, intake=intake)
        else:
            workspace_intake = self._workspace_intake()
            field = serializer.save(workspace=workspace, workspace_intake=workspace_intake)
        return Response(IntakeFormFieldSerializer(field).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, slug, intake_id, pk, project_id=None):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        return super().partial_update(request)

    def update(self, request, slug, intake_id, pk, project_id=None):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        return super().update(request)

    def destroy(self, request, slug, intake_id, pk, project_id=None):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        field = self.get_object()
        field.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def reorder(self, request, slug, intake_id, project_id=None):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error

        field_orders = request.data.get("fields", [])
        order_by_id = {str(item.get("id")): item.get("relative_order") for item in field_orders}
        fields = list(self.get_queryset().filter(id__in=order_by_id.keys()))
        for field in fields:
            field.relative_order = order_by_id[str(field.id)]
        IntakeFormField.objects.bulk_update(fields, ["relative_order"], batch_size=50)
        return Response(IntakeFormFieldSerializer(self.get_queryset(), many=True).data)


class IntakeFormFieldOptionViewSet(BaseViewSet):
    serializer_class = IntakeFormFieldOptionSerializer
    model = IntakeFormFieldOption
    permission_classes = [WorkspaceUserPermission]

    def _workspace(self):
        return Workspace.objects.get(slug=self.kwargs.get("slug"))

    def _require_manage_forms(self, request, workspace):
        if not has_permission(request.user, workspace, "intake.manage_forms"):
            return Response({"error": "You cannot manage intake form options."}, status=status.HTTP_403_FORBIDDEN)
        return None

    def _field_queryset(self):
        queryset = IntakeFormField.objects.filter(
            workspace__slug=self.kwargs.get("slug"),
            id=self.kwargs.get("field_id"),
        )
        if self.kwargs.get("project_id"):
            queryset = queryset.filter(project_id=self.kwargs.get("project_id"), intake_id=self.kwargs.get("intake_id"))
        else:
            queryset = queryset.filter(workspace_intake_id=self.kwargs.get("intake_id"))
        return queryset

    def _field(self):
        return self._field_queryset().get()

    def get_queryset(self):
        return super().get_queryset().filter(field__in=self._field_queryset()).select_related("field")

    def create(self, request, slug, intake_id, field_id, project_id=None):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        field = self._field()
        serializer = IntakeFormFieldOptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        option = serializer.save(field=field)
        return Response(IntakeFormFieldOptionSerializer(option).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, slug, intake_id, field_id, pk, project_id=None):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        return super().partial_update(request)

    def update(self, request, slug, intake_id, field_id, pk, project_id=None):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        return super().update(request)

    def destroy(self, request, slug, intake_id, field_id, pk, project_id=None):
        workspace = self._workspace()
        permission_error = self._require_manage_forms(request, workspace)
        if permission_error:
            return permission_error
        option = self.get_object()
        option.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
