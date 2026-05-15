# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import re

from django.core.exceptions import ValidationError
from django.db import models

from .base import BaseModel
from .workspace import ROLE_CHOICES


DOMAIN_RE = re.compile(r"^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$")


def normalize_domain(domain: str) -> str:
    return str(domain).strip().lower().lstrip("@")


def validate_sso_domain(domain: str) -> str:
    normalized = normalize_domain(domain)
    if not normalized or not DOMAIN_RE.match(normalized):
        raise ValidationError("Enter a valid domain without @, for example goguest.com.")
    return normalized


class WorkspaceSSOConfig(BaseModel):
    workspace = models.OneToOneField(
        "db.Workspace",
        on_delete=models.CASCADE,
        related_name="sso_config",
    )
    enabled = models.BooleanField(default=False)
    allowed_domains = models.JSONField(default=list, blank=True)
    auto_provision_role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=15)

    class Meta:
        db_table = "workspace_sso_configs"
        verbose_name = "Workspace SSO Config"
        verbose_name_plural = "Workspace SSO Configs"

    def clean(self):
        super().clean()
        self.allowed_domains = self.normalized_domains(self.allowed_domains)
        if self.enabled and not self.allowed_domains:
            raise ValidationError({"allowed_domains": "At least one domain is required when SSO is enabled."})

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    @staticmethod
    def normalized_domains(domains) -> list[str]:
        if domains in (None, ""):
            return []
        if not isinstance(domains, list):
            raise ValidationError({"allowed_domains": "Must be a list of domains."})

        normalized = []
        seen = set()
        for domain in domains:
            value = validate_sso_domain(domain)
            if value not in seen:
                normalized.append(value)
                seen.add(value)
        return normalized

    def __str__(self):
        return f"{self.workspace_id}:sso"
