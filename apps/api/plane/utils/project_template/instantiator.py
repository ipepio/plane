# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from copy import deepcopy

from django.db import transaction
from django.utils.dateparse import parse_date, parse_datetime

from plane.db.models import (
    Cycle,
    CycleIssue,
    Issue,
    IssueLabel,
    IssueProperty,
    IssuePropertyOption,
    IssueType,
    Label,
    Module,
    ModuleIssue,
    Project,
    ProjectIdentifier,
    ProjectIssueType,
    ProjectMember,
    State,
)

from .placeholders import apply_vars

PROJECT_ADMIN_ROLE = 20


def _date(value):
    return parse_date(value) if isinstance(value, str) and value else value


def _datetime(value):
    if not isinstance(value, str) or not value:
        return value
    return parse_datetime(value) or parse_date(value)


def _clean_identifier(identifier):
    return identifier.strip().upper() if isinstance(identifier, str) else identifier


def _copy_project(payload, workspace, name, identifier):
    project_data = payload.get("project", {})
    return Project.objects.create(
        workspace=workspace,
        name=name or project_data.get("name") or "Project from template",
        identifier=_clean_identifier(identifier),
        description=project_data.get("description", ""),
        description_text=project_data.get("description_text"),
        description_html=project_data.get("description_html"),
        network=project_data.get("network", 2),
        emoji=project_data.get("emoji"),
        icon_prop=project_data.get("icon_prop"),
        module_view=project_data.get("module_view", False),
        cycle_view=project_data.get("cycle_view", False),
        issue_views_view=project_data.get("issue_views_view", False),
        page_view=project_data.get("page_view", True),
        intake_view=project_data.get("intake_view", False),
        is_time_tracking_enabled=project_data.get("is_time_tracking_enabled", False),
        is_issue_type_enabled=project_data.get("is_issue_type_enabled", False),
        cover_image=project_data.get("cover_image"),
        archive_in=project_data.get("archive_in", 0),
        close_in=project_data.get("close_in", 0),
        logo_props=project_data.get("logo_props") or {},
        timezone=project_data.get("timezone") or workspace.timezone,
    )


def _copy_states(payload, project):
    state_map = {}
    for state_data in payload.get("states", []):
        state = State.all_state_objects.create(
            project=project,
            workspace=project.workspace,
            name=state_data.get("name", "State"),
            description=state_data.get("description", ""),
            color=state_data.get("color") or "#60646C",
            sequence=state_data.get("sequence", 65535),
            group=state_data.get("group", "backlog"),
            is_triage=state_data.get("is_triage", False),
            default=state_data.get("default", False),
        )
        if "sequence" in state_data:
            State.all_state_objects.filter(pk=state.pk).update(sequence=state_data["sequence"])
            state.sequence = state_data["sequence"]
        state_map[state_data["key"]] = state

    default_state_key = payload.get("project", {}).get("default_state_key")
    if default_state_key and default_state_key in state_map:
        Project.objects.filter(pk=project.pk).update(default_state=state_map[default_state_key])
        project.default_state = state_map[default_state_key]

    return state_map


def _copy_labels(payload, project):
    label_map = {}
    pending_parent = []

    for label_data in payload.get("labels", []):
        label = Label.objects.filter(
            project=project,
            workspace=project.workspace,
            name=label_data.get("name", ""),
            deleted_at__isnull=True,
        ).first()
        if label is None:
            label = Label.objects.create(
                project=project,
                workspace=project.workspace,
                name=label_data.get("name", "Label"),
                description=label_data.get("description", ""),
                color=label_data.get("color", ""),
                sort_order=label_data.get("sort_order", 65535),
            )
        label_map[label_data["key"]] = label
        if label_data.get("parent_key"):
            pending_parent.append((label, label_data["parent_key"]))

    for label, parent_key in pending_parent:
        if parent_key in label_map:
            Label.objects.filter(pk=label.pk).update(parent=label_map[parent_key])

    return label_map


def _copy_modules(payload, project):
    module_map = {}
    for module_data in payload.get("modules", []):
        module = Module.objects.create(
            project=project,
            name=module_data.get("name", "Module"),
            description=module_data.get("description", ""),
            description_text=module_data.get("description_text"),
            description_html=module_data.get("description_html"),
            start_date=_date(module_data.get("start_date")),
            target_date=_date(module_data.get("target_date")),
            status=module_data.get("status", "planned"),
            view_props=module_data.get("view_props") or {},
            sort_order=module_data.get("sort_order", 65535),
            logo_props=module_data.get("logo_props") or {},
        )
        module_map[module_data["key"]] = module
    return module_map


def _copy_cycles(payload, project, user):
    cycle_map = {}
    for cycle_data in payload.get("cycles", []):
        cycle = Cycle.objects.create(
            project=project,
            name=cycle_data.get("name", "Cycle"),
            description=cycle_data.get("description", ""),
            start_date=_datetime(cycle_data.get("start_date")),
            end_date=_datetime(cycle_data.get("end_date")),
            owned_by=user,
            view_props=cycle_data.get("view_props") or {},
            sort_order=cycle_data.get("sort_order", 65535),
            progress_snapshot=cycle_data.get("progress_snapshot") or {},
            logo_props=cycle_data.get("logo_props") or {},
            timezone=cycle_data.get("timezone") or project.timezone,
            version=cycle_data.get("version", 1),
        )
        cycle_map[cycle_data["key"]] = cycle
    return cycle_map


def _copy_issue_types(payload, project):
    issue_type_map = {}
    for type_data in payload.get("issue_types", []):
        issue_type = IssueType.objects.filter(
            workspace=project.workspace,
            name__iexact=type_data.get("name", ""),
        ).first()
        if issue_type is None:
            issue_type = IssueType.objects.create(
                workspace=project.workspace,
                name=type_data.get("name", "Issue type"),
                description=type_data.get("description", ""),
                logo_props=type_data.get("logo_props") or {},
                is_epic=type_data.get("is_epic", False),
                is_default=type_data.get("is_default", False),
                is_active=type_data.get("is_active", True),
                level=type_data.get("level", 0),
            )

        ProjectIssueType.objects.get_or_create(
            project=project,
            issue_type=issue_type,
            defaults={
                "level": type_data.get("level", 0),
                "is_default": type_data.get("is_default", False),
            },
        )
        issue_type_map[type_data["key"]] = issue_type

        for property_data in type_data.get("properties", []):
            issue_property, _ = IssueProperty.objects.get_or_create(
                workspace=project.workspace,
                project=project,
                issue_type=issue_type,
                name=property_data.get("name", ""),
                defaults={
                    "display_name": property_data.get("display_name") or property_data.get("name", "Property"),
                    "type": property_data.get("type", "text"),
                    "config": property_data.get("config") or {},
                    "is_required": property_data.get("is_required", False),
                    "is_active": property_data.get("is_active", True),
                    "relative_order": property_data.get("relative_order", 65535),
                },
            )
            for option_data in property_data.get("options", []):
                IssuePropertyOption.objects.get_or_create(
                    workspace=project.workspace,
                    project=project,
                    property=issue_property,
                    value=option_data.get("value", ""),
                    defaults={
                        "name": option_data.get("name") or option_data.get("value", ""),
                        "color": option_data.get("color", ""),
                        "relative_order": option_data.get("relative_order", 65535),
                        "is_active": option_data.get("is_active", True),
                    },
                )

    return issue_type_map


def _copy_issues(payload, project, state_map, label_map, module_map, cycle_map, issue_type_map):
    issue_map = {}
    pending_parents = []

    for issue_data in payload.get("issues", []):
        issue = Issue.objects.create(
            project=project,
            state=state_map.get(issue_data.get("state_key")),
            type=issue_type_map.get(issue_data.get("type_key")),
            name=issue_data.get("name", "Work item"),
            description_json=issue_data.get("description_json") or {},
            description_html=issue_data.get("description_html") or "<p></p>",
            priority=issue_data.get("priority", "none"),
            start_date=_date(issue_data.get("start_date")),
            target_date=_date(issue_data.get("target_date")),
            sort_order=issue_data.get("sort_order", 65535),
        )
        issue_map[issue_data["key"]] = issue

        if issue_data.get("parent_key"):
            pending_parents.append((issue, issue_data["parent_key"]))

        for label_key in issue_data.get("label_keys", []):
            label = label_map.get(label_key)
            if label:
                IssueLabel.objects.get_or_create(project=project, issue=issue, label=label)

        for module_key in issue_data.get("module_keys", []):
            module = module_map.get(module_key)
            if module:
                ModuleIssue.objects.get_or_create(project=project, issue=issue, module=module)

        for cycle_key in issue_data.get("cycle_keys", []):
            cycle = cycle_map.get(cycle_key)
            if cycle:
                CycleIssue.objects.get_or_create(project=project, issue=issue, cycle=cycle)

    for issue, parent_key in pending_parents:
        parent = issue_map.get(parent_key)
        if parent:
            Issue.objects.filter(pk=issue.pk).update(parent=parent)

    return issue_map


@transaction.atomic
def instantiate_project_template(template, workspace, *, name, identifier, variables, user):
    payload = apply_vars(deepcopy(template.payload), variables or {})
    schema_version = payload.get("schema_version")
    if schema_version != 1:
        raise ValueError("Unsupported project template schema version")

    project = _copy_project(payload, workspace, name, identifier)
    ProjectIdentifier.objects.create(name=project.identifier, project=project, workspace=workspace)
    ProjectMember.objects.create(project=project, member=user, role=PROJECT_ADMIN_ROLE)

    state_map = _copy_states(payload, project)
    label_map = _copy_labels(payload, project)
    module_map = _copy_modules(payload, project)
    cycle_map = _copy_cycles(payload, project, user)
    issue_type_map = _copy_issue_types(payload, project)
    _copy_issues(payload, project, state_map, label_map, module_map, cycle_map, issue_type_map)

    return project
