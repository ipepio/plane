# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

PERMISSIONS = [
    # workspace
    {"code": "workspace.invite_members", "category": "workspace", "name": "Invite members"},
    {"code": "workspace.manage_settings", "category": "workspace", "name": "Manage workspace settings"},
    {"code": "workspace.manage_roles", "category": "workspace", "name": "Manage roles"},
    {"code": "workspace.view_billing", "category": "workspace", "name": "View billing"},
    # project
    {"code": "project.create", "category": "project", "name": "Create project"},
    {"code": "project.archive", "category": "project", "name": "Archive project"},
    {"code": "project.delete", "category": "project", "name": "Delete project"},
    {"code": "project.manage_members", "category": "project", "name": "Manage project members"},
    {"code": "project.manage_settings", "category": "project", "name": "Manage project settings"},
    # issue
    {"code": "issue.create", "category": "issue", "name": "Create issue"},
    {"code": "issue.edit_own", "category": "issue", "name": "Edit own issue"},
    {"code": "issue.edit_any", "category": "issue", "name": "Edit any issue"},
    {"code": "issue.delete_own", "category": "issue", "name": "Delete own issue"},
    {"code": "issue.delete_any", "category": "issue", "name": "Delete any issue"},
    {"code": "issue.comment", "category": "issue", "name": "Comment on issues"},
    {"code": "issue.change_state", "category": "issue", "name": "Change issue state"},
    {"code": "issue.change_assignee", "category": "issue", "name": "Change issue assignee"},
    # intake
    {"code": "intake.submit", "category": "intake", "name": "Submit intake ticket"},
    {"code": "intake.triage", "category": "intake", "name": "Triage intake tickets"},
    {"code": "intake.manage_forms", "category": "intake", "name": "Manage intake forms"},
    # worklog
    {"code": "worklog.log_own", "category": "worklog", "name": "Log own time"},
    {"code": "worklog.view_others", "category": "worklog", "name": "View others' worklog"},
    {"code": "worklog.edit_others", "category": "worklog", "name": "Edit others' worklog"},
    {"code": "worklog.view_workspace_report", "category": "worklog", "name": "View workspace time report"},
    {"code": "worklog.create_self", "category": "worklog", "name": "Create own worklog entries"},
    {"code": "worklog.manage_others", "category": "worklog", "name": "Manage others' worklog entries"},
    # template
    {"code": "template.manage", "category": "template", "name": "Manage project templates"},
    {"code": "template.instantiate", "category": "template", "name": "Create project from template"},
    {"code": "template.view", "category": "template", "name": "View project templates"},
    # team
    {"code": "team.manage", "category": "team", "name": "Manage teams"},
    # sso
    {"code": "sso.manage", "category": "sso", "name": "Manage SSO settings"},
]


def seed_permissions(apps=None, schema_editor=None):
    """Idempotent: create or update all canonical permissions.

    Can be called from a data migration (apps + schema_editor provided)
    or directly in Django shell / tests (apps=None uses live models).
    """
    if apps is not None:
        Permission = apps.get_model("db", "Permission")
    else:
        from plane.db.models import Permission

    for entry in PERMISSIONS:
        Permission.objects.update_or_create(
            code=entry["code"],
            defaults={"name": entry["name"], "category": entry["category"]},
        )
