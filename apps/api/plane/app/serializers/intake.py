# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from datetime import datetime, time
from decimal import Decimal, InvalidOperation
from html import escape

from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime

# Third party frameworks
from rest_framework import serializers

# Module imports
from .base import BaseSerializer
from .issue import IssueIntakeSerializer, LabelLiteSerializer, IssueDetailSerializer
from .project import ProjectLiteSerializer
from .state import StateLiteSerializer
from .user import UserLiteSerializer
from plane.db.models import (
    Intake,
    IntakeFormField,
    IntakeFormFieldOption,
    IntakeFormFieldValue,
    IntakeFormFieldValueOption,
    IntakeIssue,
    Issue,
    State,
    StateGroup,
    WorkspaceIntake,
    WorkspaceIntakeIssue,
    WorkspaceMember,
)
from plane.db.models.intake import IntakeFormFieldType
from plane.utils.content_validator import validate_html_content


class IntakeSerializer(BaseSerializer):
    project_detail = ProjectLiteSerializer(source="project", read_only=True)
    pending_issue_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Intake
        fields = "__all__"
        read_only_fields = ["project", "workspace"]


class IntakeIssueSerializer(BaseSerializer):
    issue = IssueIntakeSerializer(read_only=True)

    class Meta:
        model = IntakeIssue
        fields = [
            "id",
            "status",
            "duplicate_to",
            "snoozed_till",
            "source",
            "issue",
            "created_by",
        ]
        read_only_fields = ["project", "workspace"]

    def validate(self, attrs):
        """
        Validate that if status is being changed to accepted (1),
        the project has a default state to transition to.
        """

        # Check if status is being updated to accepted
        if attrs.get("status") == 1:
            intake_issue = self.instance
            issue = intake_issue.issue

            # Check if issue is in TRIAGE state
            if issue.state and issue.state.group == StateGroup.TRIAGE.value:
                # Verify default state exists before allowing the update
                default_state = State.objects.filter(
                    workspace=intake_issue.workspace, project=intake_issue.project, default=True
                ).first()

                if not default_state:
                    raise serializers.ValidationError(
                        {"status": "Cannot accept intake issue: No default state found for the project"}
                    )

        return attrs

    def update(self, instance, validated_data):
        # Update the intake issue
        instance = super().update(instance, validated_data)

        # If status is accepted (1), transition the issue state from TRIAGE to default
        if validated_data.get("status") == 1:
            issue = instance.issue
            if issue.state and issue.state.group == StateGroup.TRIAGE.value:
                # Get the default project state
                default_state = State.objects.filter(
                    workspace=instance.workspace, project=instance.project, default=True
                ).first()
                if default_state:
                    issue.state = default_state
                    issue.save()

        return instance

    def to_representation(self, instance):
        # Pass the annotated fields to the Issue instance if they exist
        if hasattr(instance, "label_ids"):
            instance.issue.label_ids = instance.label_ids
        return super().to_representation(instance)


class IntakeIssueDetailSerializer(BaseSerializer):
    issue = IssueDetailSerializer(read_only=True)
    duplicate_issue_detail = IssueIntakeSerializer(read_only=True, source="duplicate_to")

    class Meta:
        model = IntakeIssue
        fields = [
            "id",
            "status",
            "duplicate_to",
            "snoozed_till",
            "duplicate_issue_detail",
            "source",
            "issue",
        ]
        read_only_fields = ["project", "workspace"]

    def to_representation(self, instance):
        # Pass the annotated fields to the Issue instance if they exist
        if hasattr(instance, "assignee_ids"):
            instance.issue.assignee_ids = instance.assignee_ids
        if hasattr(instance, "label_ids"):
            instance.issue.label_ids = instance.label_ids

        return super().to_representation(instance)


class IntakeIssueLiteSerializer(BaseSerializer):
    class Meta:
        model = IntakeIssue
        fields = ["id", "status", "duplicate_to", "snoozed_till", "source"]
        read_only_fields = fields


class IssueStateIntakeSerializer(BaseSerializer):
    state_detail = StateLiteSerializer(read_only=True, source="state")
    project_detail = ProjectLiteSerializer(read_only=True, source="project")
    label_details = LabelLiteSerializer(read_only=True, source="labels", many=True)
    assignee_details = UserLiteSerializer(read_only=True, source="assignees", many=True)
    sub_issues_count = serializers.IntegerField(read_only=True)
    issue_intake = IntakeIssueLiteSerializer(read_only=True, many=True)

    class Meta:
        model = Issue
        fields = "__all__"


class WorkspaceIntakeSerializer(BaseSerializer):
    pending_issue_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = WorkspaceIntake
        fields = "__all__"
        read_only_fields = ["workspace"]

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Name is required.")
        return value.strip()


class IntakeFormFieldOptionSerializer(BaseSerializer):
    class Meta:
        model = IntakeFormFieldOption
        fields = [
            "id",
            "field",
            "label",
            "value",
            "relative_order",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["field", "created_at", "updated_at"]

    def validate_label(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Label is required.")
        return value.strip()

    def validate_value(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Value is required.")
        return value.strip()


class IntakeFormFieldSerializer(BaseSerializer):
    options = IntakeFormFieldOptionSerializer(many=True, read_only=True)

    class Meta:
        model = IntakeFormField
        fields = [
            "id",
            "workspace",
            "project",
            "workspace_intake",
            "intake",
            "label",
            "placeholder",
            "help_text",
            "type",
            "config",
            "is_required",
            "relative_order",
            "is_active",
            "options",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["workspace", "project", "workspace_intake", "intake", "created_at", "updated_at"]

    def validate_label(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Label is required.")
        return value.strip()

    def validate_type(self, value):
        if value not in IntakeFormFieldType.values:
            raise serializers.ValidationError("Unsupported field type.")
        return value


class IntakeFormFieldValueReadSerializer(BaseSerializer):
    field_detail = IntakeFormFieldSerializer(source="field", read_only=True)
    selected_options_detail = serializers.SerializerMethodField()
    value_user_detail = UserLiteSerializer(source="value_user", read_only=True)

    class Meta:
        model = IntakeFormFieldValue
        fields = [
            "id",
            "field",
            "field_detail",
            "value_text",
            "value_number",
            "value_datetime",
            "value_boolean",
            "value_option",
            "selected_options_detail",
            "value_file_url",
            "value_user",
            "value_user_detail",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_selected_options_detail(self, obj):
        return [
            {
                "id": value_option.option_id,
                "label": value_option.option.label,
                "value": value_option.option.value,
            }
            for value_option in obj.selected_options.all()
        ]


class IntakeFormFieldValueWriteSerializer(serializers.Serializer):
    field = serializers.UUIDField()
    value = serializers.JSONField(required=False, allow_null=True)


def _is_empty_form_value(value):
    return value is None or value == "" or value == [] or value == {}


def _parse_form_datetime(value):
    if isinstance(value, datetime):
        parsed = value
    elif isinstance(value, str):
        parsed = parse_datetime(value)
        if parsed is None:
            parsed_date = parse_date(value)
            parsed = datetime.combine(parsed_date, time.min) if parsed_date else None
    else:
        parsed = None

    if parsed is None:
        raise serializers.ValidationError("Enter a valid date.")
    if timezone.is_naive(parsed):
        parsed = timezone.make_aware(parsed, timezone.get_current_timezone())
    return parsed


def _coerce_form_value(field, raw_value, workspace):
    data = {
        "value_text": "",
        "value_number": None,
        "value_datetime": None,
        "value_boolean": None,
        "value_option": None,
        "value_file_url": "",
        "value_user": None,
    }
    selected_options = []

    if _is_empty_form_value(raw_value):
        return data, selected_options

    if field.type in [IntakeFormFieldType.SHORT_TEXT, IntakeFormFieldType.LONG_TEXT]:
        data["value_text"] = str(raw_value)
        max_length = field.config.get("max_length")
        if max_length and len(data["value_text"]) > int(max_length):
            raise serializers.ValidationError("Text exceeds the configured max length.")
    elif field.type == IntakeFormFieldType.NUMBER:
        try:
            data["value_number"] = Decimal(str(raw_value))
        except (InvalidOperation, ValueError):
            raise serializers.ValidationError("Enter a valid number.")
    elif field.type == IntakeFormFieldType.DATE:
        data["value_datetime"] = _parse_form_datetime(raw_value)
    elif field.type == IntakeFormFieldType.BOOLEAN:
        if not isinstance(raw_value, bool):
            raise serializers.ValidationError("Enter a valid boolean.")
        data["value_boolean"] = raw_value
    elif field.type == IntakeFormFieldType.SELECT:
        option = IntakeFormFieldOption.objects.filter(field=field, id=raw_value, is_active=True).first()
        if option is None:
            raise serializers.ValidationError("Select a valid option.")
        data["value_option"] = option
    elif field.type == IntakeFormFieldType.MULTI_SELECT:
        if not isinstance(raw_value, list):
            raise serializers.ValidationError("Enter a valid option list.")
        selected_options = list(IntakeFormFieldOption.objects.filter(field=field, id__in=raw_value, is_active=True))
        if len(selected_options) != len(set([str(item) for item in raw_value])):
            raise serializers.ValidationError("Select valid options.")
    elif field.type == IntakeFormFieldType.FILE:
        data["value_file_url"] = str(raw_value)
    elif field.type == IntakeFormFieldType.USER:
        membership = WorkspaceMember.objects.filter(workspace=workspace, member_id=raw_value, is_active=True).first()
        if membership is None:
            raise serializers.ValidationError("Select a valid workspace member.")
        data["value_user"] = membership.member
    else:
        raise serializers.ValidationError("Unsupported field type.")

    return data, selected_options


def persist_workspace_intake_form_values(workspace_intake_issue, form_values):
    fields = list(
        IntakeFormField.objects.filter(
            workspace=workspace_intake_issue.workspace,
            workspace_intake=workspace_intake_issue.intake,
            is_active=True,
        ).prefetch_related("options")
    )
    fields_by_id = {str(field.id): field for field in fields}
    values_by_field = {}

    for item in form_values or []:
        serializer = IntakeFormFieldValueWriteSerializer(data=item)
        serializer.is_valid(raise_exception=True)
        field_id = str(serializer.validated_data["field"])
        if field_id not in fields_by_id:
            raise serializers.ValidationError({"form_values": "Field does not belong to this intake."})
        values_by_field[field_id] = serializer.validated_data.get("value")

    missing_required = [
        field.label for field in fields if field.is_required and _is_empty_form_value(values_by_field.get(str(field.id)))
    ]
    if missing_required:
        raise serializers.ValidationError({"form_values": f"Required fields missing: {', '.join(missing_required)}"})

    saved_values = []
    for field_id, raw_value in values_by_field.items():
        field = fields_by_id[field_id]
        value_data, selected_options = _coerce_form_value(field, raw_value, workspace_intake_issue.workspace)
        value, _created = IntakeFormFieldValue.objects.update_or_create(
            field=field,
            workspace_intake_issue=workspace_intake_issue,
            defaults={
                "workspace": workspace_intake_issue.workspace,
                "project": None,
                "intake_issue": None,
                **value_data,
            },
        )
        value.selected_options.all().delete()
        if selected_options:
            IntakeFormFieldValueOption.objects.bulk_create(
                [IntakeFormFieldValueOption(value=value, option=option) for option in selected_options],
                batch_size=20,
            )
        saved_values.append(value)

    return saved_values


def _display_form_value(value):
    field_type = value.field.type
    if field_type in [IntakeFormFieldType.SHORT_TEXT, IntakeFormFieldType.LONG_TEXT]:
        return value.value_text
    if field_type == IntakeFormFieldType.NUMBER:
        return "" if value.value_number is None else str(value.value_number.normalize())
    if field_type == IntakeFormFieldType.DATE:
        return "" if value.value_datetime is None else value.value_datetime.date().isoformat()
    if field_type == IntakeFormFieldType.BOOLEAN:
        if value.value_boolean is None:
            return ""
        return "Yes" if value.value_boolean else "No"
    if field_type == IntakeFormFieldType.SELECT:
        return value.value_option.label if value.value_option else ""
    if field_type == IntakeFormFieldType.MULTI_SELECT:
        return ", ".join([item.option.label for item in value.selected_options.all()])
    if field_type == IntakeFormFieldType.FILE:
        return value.value_file_url
    if field_type == IntakeFormFieldType.USER:
        return value.value_user.display_name if value.value_user else ""
    return ""


def render_workspace_intake_form_values_html(workspace_intake_issue):
    values = (
        workspace_intake_issue.form_values.select_related("field", "value_option", "value_user")
        .prefetch_related("selected_options__option")
        .order_by("field__relative_order", "created_at")
    )
    rows = []
    for value in values:
        display_value = _display_form_value(value)
        if display_value == "":
            continue
        rows.append(
            f"<li><strong>{escape(value.field.label)}:</strong> {escape(display_value)}</li>"
        )

    if not rows:
        return ""
    return "<section><h3>Form responses</h3><ul>" + "".join(rows) + "</ul></section>"


class WorkspaceIntakeIssueSerializer(BaseSerializer):
    intake_detail = WorkspaceIntakeSerializer(read_only=True, source="intake")
    issue_detail = IssueIntakeSerializer(read_only=True, source="issue")
    duplicate_issue_detail = serializers.SerializerMethodField()
    form_values = IntakeFormFieldValueReadSerializer(many=True, read_only=True)

    class Meta:
        model = WorkspaceIntakeIssue
        fields = [
            "id",
            "workspace",
            "intake",
            "intake_detail",
            "issue",
            "issue_detail",
            "name",
            "description_json",
            "description_html",
            "priority",
            "status",
            "snoozed_till",
            "duplicate_to",
            "duplicate_issue_detail",
            "decision_note",
            "source",
            "source_email",
            "external_source",
            "external_id",
            "extra",
            "form_values",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["workspace", "issue", "created_by", "updated_by", "created_at", "updated_at"]

    def get_duplicate_issue_detail(self, obj):
        if obj.duplicate_to_id is None:
            return None
        return {
            "id": obj.duplicate_to_id,
            "name": obj.duplicate_to.name,
            "status": obj.duplicate_to.status,
        }

    def validate(self, attrs):
        intake = attrs.get("intake") or getattr(self.instance, "intake", None)
        if intake and intake.workspace.slug != self.context.get("slug"):
            raise serializers.ValidationError({"intake": "Intake does not belong to this workspace."})

        if attrs.get("description_html"):
            is_valid, _error_msg, sanitized_html = validate_html_content(attrs["description_html"])
            if not is_valid:
                raise serializers.ValidationError({"description_html": "HTML content is not valid."})
            if sanitized_html is not None:
                attrs["description_html"] = sanitized_html

        priority = attrs.get("priority")
        if priority and priority not in ["urgent", "high", "medium", "low", "none"]:
            raise serializers.ValidationError({"priority": "Invalid priority."})

        return attrs

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Name is required.")
        return value.strip()


class WorkspaceIntakeAcceptSerializer(serializers.Serializer):
    project = serializers.UUIDField()
    intake = serializers.UUIDField(required=False, allow_null=True)
    state = serializers.UUIDField(required=False, allow_null=True)
    assignee_ids = serializers.ListField(child=serializers.UUIDField(), required=False)


class WorkspaceIntakeRejectSerializer(serializers.Serializer):
    decision_note = serializers.CharField(required=True, allow_blank=False)


class WorkspaceIntakeSnoozeSerializer(serializers.Serializer):
    snoozed_till = serializers.DateTimeField(required=True)


class WorkspaceIntakeDuplicateSerializer(serializers.Serializer):
    duplicate_to = serializers.UUIDField(required=True)
    decision_note = serializers.CharField(required=False, allow_blank=True)
