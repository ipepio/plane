# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from datetime import date, datetime
from decimal import Decimal

from plane.db.models import (
    Cycle,
    CycleIssue,
    Issue,
    IssueLabel,
    IssueProperty,
    Label,
    Module,
    ModuleIssue,
    ProjectIssueType,
    State,
)


def _json_value(value):
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, Decimal):
        return str(value)
    if isinstance(value, list):
        return [_json_value(item) for item in value]
    if isinstance(value, dict):
        return {key: _json_value(item) for key, item in value.items()}
    return value


def _key(prefix, index):
    return f"{prefix}_{index + 1}"


def build_project_template_snapshot(project):
    states = list(State.all_state_objects.filter(project=project, deleted_at__isnull=True).order_by("sequence", "created_at"))
    labels = list(Label.objects.filter(project=project, workspace=project.workspace, deleted_at__isnull=True).order_by("sort_order", "created_at"))
    modules = list(Module.objects.filter(project=project, deleted_at__isnull=True).order_by("sort_order", "created_at"))
    cycles = list(Cycle.objects.filter(project=project, deleted_at__isnull=True).order_by("sort_order", "created_at"))
    project_issue_types = list(
        ProjectIssueType.objects.filter(project=project, deleted_at__isnull=True)
        .select_related("issue_type")
        .order_by("level", "created_at")
    )
    issues = list(
        Issue.objects.filter(project=project, deleted_at__isnull=True, is_draft=False)
        .select_related("state", "type", "parent")
        .order_by("parent_id", "sequence_id", "created_at")
    )

    state_keys = {state.id: _key("state", index) for index, state in enumerate(states)}
    label_keys = {label.id: _key("label", index) for index, label in enumerate(labels)}
    module_keys = {module.id: _key("module", index) for index, module in enumerate(modules)}
    cycle_keys = {cycle.id: _key("cycle", index) for index, cycle in enumerate(cycles)}
    issue_type_keys = {
        project_issue_type.issue_type_id: _key("issue_type", index)
        for index, project_issue_type in enumerate(project_issue_types)
    }
    issue_keys = {issue.id: _key("issue", index) for index, issue in enumerate(issues)}

    module_issue_keys = {}
    for module_issue in ModuleIssue.objects.filter(issue__in=issues, module__in=modules, deleted_at__isnull=True):
        module_issue_keys.setdefault(module_issue.issue_id, []).append(module_keys[module_issue.module_id])

    cycle_issue_keys = {}
    for cycle_issue in CycleIssue.objects.filter(issue__in=issues, cycle__in=cycles, deleted_at__isnull=True):
        cycle_issue_keys.setdefault(cycle_issue.issue_id, []).append(cycle_keys[cycle_issue.cycle_id])

    label_issue_keys = {}
    for issue_label in IssueLabel.objects.filter(issue__in=issues, label__in=labels, deleted_at__isnull=True):
        label_issue_keys.setdefault(issue_label.issue_id, []).append(label_keys[issue_label.label_id])

    type_payload = []
    for project_issue_type in project_issue_types:
        issue_type = project_issue_type.issue_type
        properties = []
        for prop_index, issue_property in enumerate(
            IssueProperty.objects.filter(
                issue_type=issue_type,
                project=project,
                deleted_at__isnull=True,
            )
            .prefetch_related("options")
            .order_by("relative_order", "created_at")
        ):
            properties.append(
                {
                    "key": _key(f"{issue_type_keys[issue_type.id]}_property", prop_index),
                    "name": issue_property.name,
                    "display_name": issue_property.display_name,
                    "type": issue_property.type,
                    "config": _json_value(issue_property.config),
                    "is_required": issue_property.is_required,
                    "is_active": issue_property.is_active,
                    "relative_order": issue_property.relative_order,
                    "options": [
                        {
                            "name": option.name,
                            "value": option.value,
                            "color": option.color,
                            "relative_order": option.relative_order,
                            "is_active": option.is_active,
                        }
                        for option in issue_property.options.filter(deleted_at__isnull=True).order_by(
                            "relative_order", "created_at"
                        )
                    ],
                }
            )

        type_payload.append(
            {
                "key": issue_type_keys[issue_type.id],
                "name": issue_type.name,
                "description": issue_type.description,
                "logo_props": _json_value(issue_type.logo_props),
                "is_epic": issue_type.is_epic,
                "is_default": project_issue_type.is_default or issue_type.is_default,
                "is_active": issue_type.is_active,
                "level": project_issue_type.level,
                "properties": properties,
            }
        )

    return _json_value(
        {
            "schema_version": 1,
            "project": {
                "name": project.name,
                "description": project.description,
                "description_text": project.description_text,
                "description_html": project.description_html,
                "network": project.network,
                "emoji": project.emoji,
                "icon_prop": project.icon_prop,
                "module_view": project.module_view,
                "cycle_view": project.cycle_view,
                "issue_views_view": project.issue_views_view,
                "page_view": project.page_view,
                "intake_view": project.intake_view,
                "is_time_tracking_enabled": project.is_time_tracking_enabled,
                "is_issue_type_enabled": project.is_issue_type_enabled,
                "cover_image": project.cover_image,
                "archive_in": project.archive_in,
                "close_in": project.close_in,
                "logo_props": project.logo_props,
                "timezone": project.timezone,
                "default_state_key": state_keys.get(project.default_state_id),
            },
            "states": [
                {
                    "key": state_keys[state.id],
                    "name": state.name,
                    "description": state.description,
                    "color": state.color,
                    "sequence": state.sequence,
                    "group": state.group,
                    "is_triage": state.is_triage,
                    "default": state.default,
                }
                for state in states
            ],
            "labels": [
                {
                    "key": label_keys[label.id],
                    "parent_key": label_keys.get(label.parent_id),
                    "name": label.name,
                    "description": label.description,
                    "color": label.color,
                    "sort_order": label.sort_order,
                }
                for label in labels
            ],
            "modules": [
                {
                    "key": module_keys[module.id],
                    "name": module.name,
                    "description": module.description,
                    "description_text": module.description_text,
                    "description_html": module.description_html,
                    "start_date": module.start_date,
                    "target_date": module.target_date,
                    "status": module.status,
                    "view_props": module.view_props,
                    "sort_order": module.sort_order,
                    "logo_props": module.logo_props,
                }
                for module in modules
            ],
            "cycles": [
                {
                    "key": cycle_keys[cycle.id],
                    "name": cycle.name,
                    "description": cycle.description,
                    "start_date": cycle.start_date,
                    "end_date": cycle.end_date,
                    "view_props": cycle.view_props,
                    "sort_order": cycle.sort_order,
                    "progress_snapshot": cycle.progress_snapshot,
                    "logo_props": cycle.logo_props,
                    "timezone": cycle.timezone,
                    "version": cycle.version,
                }
                for cycle in cycles
            ],
            "issue_types": type_payload,
            "issues": [
                {
                    "key": issue_keys[issue.id],
                    "parent_key": issue_keys.get(issue.parent_id),
                    "state_key": state_keys.get(issue.state_id),
                    "type_key": issue_type_keys.get(issue.type_id),
                    "label_keys": label_issue_keys.get(issue.id, []),
                    "module_keys": module_issue_keys.get(issue.id, []),
                    "cycle_keys": cycle_issue_keys.get(issue.id, []),
                    "name": issue.name,
                    "description_json": issue.description_json,
                    "description_html": issue.description_html,
                    "priority": issue.priority,
                    "start_date": issue.start_date,
                    "target_date": issue.target_date,
                    "sort_order": issue.sort_order,
                }
                for issue in issues
            ],
        }
    )
