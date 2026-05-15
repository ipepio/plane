# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from rest_framework import serializers

from plane.db.models import WorkspaceSSOConfig
from plane.db.models.workspace_sso import validate_sso_domain
from .base import BaseSerializer


class WorkspaceSSOConfigSerializer(BaseSerializer):
    class Meta:
        model = WorkspaceSSOConfig
        fields = [
            "id",
            "enabled",
            "allowed_domains",
            "auto_provision_role",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_allowed_domains(self, value):
        if value in (None, ""):
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError("Must be a list of domains.")

        normalized = []
        seen = set()
        for domain in value:
            try:
                normalized_domain = validate_sso_domain(domain)
            except Exception:
                raise serializers.ValidationError(f"Invalid domain: {domain}")
            if normalized_domain not in seen:
                normalized.append(normalized_domain)
                seen.add(normalized_domain)
        return normalized

    def validate(self, attrs):
        enabled = attrs.get("enabled", getattr(self.instance, "enabled", False))
        domains = attrs.get("allowed_domains", getattr(self.instance, "allowed_domains", []))
        if enabled and not domains:
            raise serializers.ValidationError({"allowed_domains": "Required when SSO is enabled."})
        return attrs
