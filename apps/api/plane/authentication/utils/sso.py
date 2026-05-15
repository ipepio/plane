# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from urllib.parse import urlparse
from typing import Optional

from django.db import IntegrityError, transaction

from plane.db.models import Role, Workspace, WorkspaceMember, WorkspaceSSOConfig


class SSORestrictedError(Exception):
    def __init__(self, workspace_slug: str):
        self.workspace_slug = workspace_slug
        super().__init__(f"SSO domain is not allowed for workspace {workspace_slug}.")


def get_email_domain(email: str) -> str:
    return str(email).strip().lower().rsplit("@", 1)[-1]


def find_eligible_workspaces(email: str):
    domain = get_email_domain(email)
    configs = WorkspaceSSOConfig.objects.select_related("workspace").filter(enabled=True)
    return [config.workspace for config in configs if domain in config.allowed_domains]


def get_workspace_from_next_path(next_path: Optional[str]):
    if not next_path:
        return None

    parsed = urlparse(next_path)
    path = parsed.path or next_path
    slug = path.strip("/").split("/", 1)[0]
    if not slug:
        return None
    return Workspace.objects.filter(slug=slug).first()


def get_system_role(workspace, role_level: int):
    return Role.objects.filter(workspace=workspace, is_system=True, level=role_level).first()


def auto_provision_membership(user, workspace, role: Optional[int] = None):
    role_level = role or workspace.sso_config.auto_provision_role
    system_role = get_system_role(workspace, role_level)

    with transaction.atomic():
        membership = WorkspaceMember.objects.filter(workspace=workspace, member=user).first()
        if membership:
            changed_fields = []
            if not membership.is_active:
                membership.is_active = True
                changed_fields.append("is_active")
            if membership.role != role_level:
                membership.role = role_level
                changed_fields.append("role")
            if system_role and membership.role_id_id != system_role.id:
                membership.role_id = system_role
                changed_fields.append("role_id")
            if changed_fields:
                changed_fields.append("updated_at")
                membership.save(update_fields=changed_fields)
            return membership

        try:
            return WorkspaceMember.objects.create(
                workspace=workspace,
                member=user,
                role=role_level,
                role_id=system_role,
                is_active=True,
            )
        except IntegrityError:
            return WorkspaceMember.objects.get(workspace=workspace, member=user)


def enforce_sso_or_fail(workspace, email: str):
    config = WorkspaceSSOConfig.objects.filter(workspace=workspace, enabled=True).first()
    if config is None:
        return

    if get_email_domain(email) not in config.allowed_domains:
        raise SSORestrictedError(workspace.slug)
