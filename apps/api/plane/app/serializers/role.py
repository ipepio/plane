# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from rest_framework import serializers

from plane.db.models import Permission, Role, RolePermission
from .base import BaseSerializer


class PermissionSerializer(BaseSerializer):
    class Meta:
        model = Permission
        fields = ["id", "code", "name", "description", "category"]
        read_only_fields = fields


class RoleSerializer(BaseSerializer):
    members_count = serializers.IntegerField(read_only=True)
    permission_codes = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = [
            "id", "name", "description", "is_system", "level",
            "members_count", "permission_codes",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "is_system", "level", "created_at", "updated_at"]

    def get_permission_codes(self, obj):
        return list(obj.permissions.values_list("code", flat=True))

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be blank.")
        return value.strip()


class RoleCreateSerializer(BaseSerializer):
    class Meta:
        model = Role
        fields = ["id", "name", "description"]
        read_only_fields = ["id"]

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be blank.")
        return value.strip()
