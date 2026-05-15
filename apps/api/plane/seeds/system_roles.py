# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from .permissions import PERMISSIONS

# Codes that Admin gets (all of them)
_ALL_CODES = {p["code"] for p in PERMISSIONS}

SYSTEM_ROLE_PERMISSIONS = {
    "Admin": "*",  # all permissions
    "Member": [
        "workspace.invite_members",
        "project.create",
        "project.manage_members",
        "project.manage_settings",
        "issue.create",
        "issue.edit_own",
        "issue.edit_any",
        "issue.delete_own",
        "issue.comment",
        "issue.change_state",
        "issue.change_assignee",
        "intake.submit",
        "intake.triage",
        "worklog.log_own",
        "worklog.view_others",
        "worklog.create_self",
        "worklog.view_workspace_report",
        "template.instantiate",
        "template.view",
        "team.manage",
    ],
    "Guest": [
        "issue.create",
        "issue.edit_own",
        "issue.delete_own",
        "issue.comment",
        "intake.submit",
        "worklog.log_own",
        "worklog.create_self",
    ],
}

LEVEL_BY_ROLE = {"Admin": 20, "Member": 15, "Guest": 5}


def seed_system_roles_for_workspace(workspace, apps=None):
    """Create or update the three system roles for a workspace.

    Idempotent: safe to call multiple times. Can be invoked from a data
    migration (pass apps=<historical apps registry>) or live code (apps=None).
    """
    if apps is not None:
        Role = apps.get_model("db", "Role")
        Permission = apps.get_model("db", "Permission")
        RolePermission = apps.get_model("db", "RolePermission")
    else:
        from plane.db.models import Role, Permission, RolePermission

    all_perm_map = {p.code: p for p in Permission.objects.all()}

    for role_name, perm_codes in SYSTEM_ROLE_PERMISSIONS.items():
        role, _ = Role.objects.update_or_create(
            workspace=workspace,
            name=role_name,
            defaults={
                "is_system": True,
                "level": LEVEL_BY_ROLE[role_name],
                "description": f"System role: {role_name}",
            },
        )

        if perm_codes == "*":
            target_codes = set(all_perm_map.keys())
        else:
            target_codes = set(perm_codes)

        existing_codes = set(
            RolePermission.objects.filter(role=role).values_list("permission__code", flat=True)
        )

        # Add missing
        to_add = target_codes - existing_codes
        RolePermission.objects.bulk_create(
            [
                RolePermission(role=role, permission=all_perm_map[code])
                for code in to_add
                if code in all_perm_map
            ],
            ignore_conflicts=True,
        )

        # Remove revoked (only relevant if permission catalog shrinks)
        to_remove = existing_codes - target_codes
        if to_remove:
            RolePermission.objects.filter(
                role=role, permission__code__in=to_remove
            ).delete()
