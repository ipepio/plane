# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from decimal import Decimal, InvalidOperation

from django.core.validators import URLValidator
from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime

from rest_framework import serializers

from plane.app.serializers.base import BaseSerializer
from plane.app.serializers.user import UserLiteSerializer
from plane.db.models import (
    IssueProperty,
    IssuePropertyOption,
    IssuePropertyType,
    IssuePropertyValue,
    IssuePropertyValueOption,
    IssueType,
    ProjectIssueType,
    ProjectMember,
)


def _is_empty_value(value):
    return value is None or value == "" or value == []


def normalize_property_values_payload(payload):
    if payload in [None, "", []]:
        return []
    if isinstance(payload, dict):
        return [{"property": key, "value": value} for key, value in payload.items()]
    if isinstance(payload, list):
        return payload
    raise serializers.ValidationError({"property_values": "Expected a list or object."})


def decode_issue_property_value(instance):
    property_type = instance.property.type
    if property_type in [IssuePropertyType.TEXT, IssuePropertyType.LONG_TEXT, IssuePropertyType.URL]:
        return instance.value_text
    if property_type == IssuePropertyType.NUMBER:
        return str(instance.value_number) if instance.value_number is not None else None
    if property_type == IssuePropertyType.DATE:
        return instance.value_datetime.isoformat() if instance.value_datetime else None
    if property_type == IssuePropertyType.BOOLEAN:
        return instance.value_boolean
    if property_type == IssuePropertyType.USER:
        return str(instance.value_user_id) if instance.value_user_id else None
    if property_type == IssuePropertyType.SELECT:
        return str(instance.value_option_id) if instance.value_option_id else None
    if property_type == IssuePropertyType.MULTI_SELECT:
        return [str(option.option_id) for option in instance.selected_options.all()]
    return None


def active_issue_properties(issue_type_id, project_id):
    return IssueProperty.objects.filter(
        issue_type_id=issue_type_id,
        project_id=project_id,
        is_active=True,
        deleted_at__isnull=True,
    ).prefetch_related("options")


def validate_required_property_values(issue_type_id, project_id, payload):
    if not issue_type_id:
        return

    values = normalize_property_values_payload(payload)
    value_by_property = {str(item.get("property") or item.get("property_id")): item.get("value") for item in values}
    missing = [
        property.display_name
        for property in active_issue_properties(issue_type_id, project_id).filter(is_required=True)
        if _is_empty_value(value_by_property.get(str(property.id)))
    ]
    if missing:
        raise serializers.ValidationError({"property_values": [f"{name} is required." for name in missing]})


def _parse_property_value(property, value, project_id):
    if _is_empty_value(value):
        return None

    if property.type in [IssuePropertyType.TEXT, IssuePropertyType.LONG_TEXT]:
        text_value = str(value)
        max_length = property.config.get("max_length")
        if max_length and len(text_value) > int(max_length):
            raise serializers.ValidationError(f"{property.display_name} exceeds max length.")
        return {"value_text": text_value}

    if property.type == IssuePropertyType.URL:
        text_value = str(value)
        URLValidator()(text_value)
        return {"value_text": text_value}

    if property.type == IssuePropertyType.NUMBER:
        try:
            number_value = Decimal(str(value))
        except (InvalidOperation, TypeError):
            raise serializers.ValidationError(f"{property.display_name} must be a number.")
        if property.config.get("min") is not None and number_value < Decimal(str(property.config["min"])):
            raise serializers.ValidationError(f"{property.display_name} is below the minimum.")
        if property.config.get("max") is not None and number_value > Decimal(str(property.config["max"])):
            raise serializers.ValidationError(f"{property.display_name} is above the maximum.")
        return {"value_number": number_value}

    if property.type == IssuePropertyType.DATE:
        parsed = parse_datetime(str(value))
        if parsed is None:
            parsed_date = parse_date(str(value))
            parsed = timezone.make_aware(
                timezone.datetime.combine(parsed_date, timezone.datetime.min.time())
            ) if parsed_date else None
        if parsed is None:
            raise serializers.ValidationError(f"{property.display_name} must be a valid date.")
        return {"value_datetime": parsed}

    if property.type == IssuePropertyType.BOOLEAN:
        if isinstance(value, bool):
            return {"value_boolean": value}
        if str(value).lower() in ["true", "1", "yes"]:
            return {"value_boolean": True}
        if str(value).lower() in ["false", "0", "no"]:
            return {"value_boolean": False}
        raise serializers.ValidationError(f"{property.display_name} must be true or false.")

    if property.type == IssuePropertyType.USER:
        if not ProjectMember.objects.filter(project_id=project_id, member_id=value, is_active=True).exists():
            raise serializers.ValidationError(f"{property.display_name} must be a project member.")
        return {"value_user_id": value}

    if property.type == IssuePropertyType.SELECT:
        if not property.options.filter(id=value, is_active=True, deleted_at__isnull=True).exists():
            raise serializers.ValidationError(f"{property.display_name} option is not valid.")
        return {"value_option_id": value}

    if property.type == IssuePropertyType.MULTI_SELECT:
        if not isinstance(value, list):
            raise serializers.ValidationError(f"{property.display_name} must be a list.")
        valid_count = property.options.filter(id__in=value, is_active=True, deleted_at__isnull=True).count()
        if valid_count != len(set(value)):
            raise serializers.ValidationError(f"{property.display_name} contains an invalid option.")
        return {"option_ids": value}

    raise serializers.ValidationError(f"{property.display_name} type is not supported.")


def upsert_issue_property_values(issue, payload, enforce_required=True):
    values = normalize_property_values_payload(payload)
    if enforce_required:
        validate_required_property_values(issue.type_id, issue.project_id, values)

    properties = {
        str(property.id): property
        for property in active_issue_properties(issue.type_id, issue.project_id)
        .filter(id__in=[item.get("property") or item.get("property_id") for item in values])
        .prefetch_related("options")
    }

    saved = []
    for item in values:
        property_id = str(item.get("property") or item.get("property_id"))
        property = properties.get(property_id)
        if property is None:
            raise serializers.ValidationError({"property": f"{property_id} is not valid for this issue type."})

        raw_value = item.get("value")
        if _is_empty_value(raw_value):
            if property.is_required:
                raise serializers.ValidationError({"property_values": f"{property.display_name} is required."})
            IssuePropertyValue.objects.filter(issue=issue, property=property).delete()
            continue

        parsed = _parse_property_value(property, raw_value, issue.project_id)
        option_ids = parsed.pop("option_ids", None) if parsed else None
        value, _ = IssuePropertyValue.objects.update_or_create(
            issue=issue,
            property=property,
            defaults={
                "project_id": issue.project_id,
                "value_text": None,
                "value_number": None,
                "value_datetime": None,
                "value_boolean": None,
                "value_user_id": None,
                "value_option_id": None,
                **(parsed or {}),
            },
        )

        if option_ids is not None:
            IssuePropertyValueOption.objects.filter(value=value).delete()
            IssuePropertyValueOption.objects.bulk_create(
                [
                    IssuePropertyValueOption(
                        value=value,
                        option_id=option_id,
                        project_id=issue.project_id,
                        workspace_id=issue.workspace_id,
                    )
                    for option_id in option_ids
                ],
                ignore_conflicts=True,
            )
        saved.append(value)
    return saved


class IssueTypeLiteSerializer(BaseSerializer):
    class Meta:
        model = IssueType
        fields = ["id", "name", "description", "logo_props", "is_default", "is_active", "is_epic"]
        read_only_fields = fields


class ProjectIssueTypeSerializer(BaseSerializer):
    issue_type_detail = IssueTypeLiteSerializer(source="issue_type", read_only=True)

    class Meta:
        model = ProjectIssueType
        fields = ["id", "workspace", "project", "issue_type", "issue_type_detail", "level", "is_default"]
        read_only_fields = fields


class IssuePropertyOptionSerializer(BaseSerializer):
    class Meta:
        model = IssuePropertyOption
        fields = [
            "id",
            "workspace",
            "project",
            "property",
            "name",
            "value",
            "color",
            "relative_order",
            "is_active",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = ["workspace", "project", "property", "created_at", "updated_at", "created_by", "updated_by"]

    def validate(self, attrs):
        property = self.context.get("property")
        if property and property.type not in [IssuePropertyType.SELECT, IssuePropertyType.MULTI_SELECT]:
            raise serializers.ValidationError("Options are only available for select properties.")
        return attrs


class IssuePropertySerializer(BaseSerializer):
    options = IssuePropertyOptionSerializer(many=True, read_only=True)

    class Meta:
        model = IssueProperty
        fields = [
            "id",
            "workspace",
            "project",
            "issue_type",
            "name",
            "display_name",
            "type",
            "config",
            "is_required",
            "is_active",
            "relative_order",
            "options",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = [
            "workspace",
            "project",
            "issue_type",
            "options",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]

    def validate_name(self, value):
        issue_type = self.context.get("issue_type")
        project_id = self.context.get("project_id")
        queryset = IssueProperty.objects.filter(
            issue_type=issue_type,
            project_id=project_id,
            name__iexact=value,
            deleted_at__isnull=True,
        )
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A property with this name already exists for this issue type.")
        return value


class IssuePropertyValueSerializer(BaseSerializer):
    property_detail = IssuePropertySerializer(source="property", read_only=True)
    value = serializers.SerializerMethodField()
    value_user_detail = UserLiteSerializer(source="value_user", read_only=True)
    selected_option_details = serializers.SerializerMethodField()

    class Meta:
        model = IssuePropertyValue
        fields = [
            "id",
            "workspace",
            "project",
            "issue",
            "property",
            "property_detail",
            "value",
            "value_text",
            "value_number",
            "value_datetime",
            "value_boolean",
            "value_user",
            "value_user_detail",
            "value_option",
            "selected_option_details",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = fields

    def get_value(self, obj):
        return decode_issue_property_value(obj)

    def get_selected_option_details(self, obj):
        return IssuePropertyOptionSerializer([selected.option for selected in obj.selected_options.all()], many=True).data
