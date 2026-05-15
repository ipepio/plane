# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Django imports
from django.db import models
from django.db.models.functions import Lower

# Module imports
from .base import BaseModel
from plane.db.models.project import ProjectBaseModel


class Intake(ProjectBaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(verbose_name="Intake Description", blank=True)
    is_default = models.BooleanField(default=False)
    view_props = models.JSONField(default=dict)
    logo_props = models.JSONField(default=dict)

    def __str__(self):
        """Return name of the intake"""
        return f"{self.name} <{self.project.name}>"

    class Meta:
        unique_together = ["name", "project", "deleted_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "project"],
                condition=models.Q(deleted_at__isnull=True),
                name="intake_unique_name_project_when_deleted_at_null",
            )
        ]
        verbose_name = "Intake"
        verbose_name_plural = "Intakes"
        db_table = "intakes"
        ordering = ("name",)


class SourceType(models.TextChoices):
    IN_APP = "IN_APP"


class IntakeIssueStatus(models.IntegerChoices):
    PENDING = -2
    REJECTED = -1
    SNOOZED = 0
    ACCEPTED = 1
    DUPLICATE = 2


class IntakeFormFieldType(models.TextChoices):
    SHORT_TEXT = "short_text", "Short text"
    LONG_TEXT = "long_text", "Long text"
    NUMBER = "number", "Number"
    DATE = "date", "Date"
    BOOLEAN = "boolean", "Boolean"
    SELECT = "select", "Select"
    MULTI_SELECT = "multi_select", "Multi-select"
    FILE = "file", "File"
    USER = "user", "User"


class IntakeIssue(ProjectBaseModel):
    intake = models.ForeignKey("db.Intake", related_name="issue_intake", on_delete=models.CASCADE)
    issue = models.ForeignKey("db.Issue", related_name="issue_intake", on_delete=models.CASCADE)
    status = models.IntegerField(
        choices=(
            (-2, "Pending"),
            (-1, "Rejected"),
            (0, "Snoozed"),
            (1, "Accepted"),
            (2, "Duplicate"),
        ),
        default=-2,
    )
    snoozed_till = models.DateTimeField(null=True)
    duplicate_to = models.ForeignKey(
        "db.Issue",
        related_name="intake_duplicate",
        on_delete=models.SET_NULL,
        null=True,
    )
    source = models.CharField(max_length=255, default="IN_APP", null=True, blank=True)
    source_email = models.TextField(blank=True, null=True)
    external_source = models.CharField(max_length=255, null=True, blank=True)
    external_id = models.CharField(max_length=255, blank=True, null=True)
    extra = models.JSONField(default=dict)

    class Meta:
        verbose_name = "IntakeIssue"
        verbose_name_plural = "IntakeIssues"
        db_table = "intake_issues"
        ordering = ("-created_at",)

    def __str__(self):
        """Return name of the Issue"""
        return f"{self.issue.name} <{self.intake.name}>"


class WorkspaceIntake(BaseModel):
    workspace = models.ForeignKey("db.Workspace", on_delete=models.CASCADE, related_name="workspace_intakes")
    name = models.CharField(max_length=255)
    description = models.TextField(verbose_name="Workspace Intake Description", blank=True)
    is_default = models.BooleanField(default=False)
    view_props = models.JSONField(default=dict)
    logo_props = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.name} <{self.workspace.name}>"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                "workspace",
                condition=models.Q(deleted_at__isnull=True),
                name="workspace_intake_unique_lower_name_workspace_active",
            ),
            models.UniqueConstraint(
                fields=["workspace"],
                condition=models.Q(is_default=True, deleted_at__isnull=True),
                name="workspace_intake_one_default_per_workspace_active",
            ),
        ]
        verbose_name = "Workspace Intake"
        verbose_name_plural = "Workspace Intakes"
        db_table = "workspace_intakes"
        ordering = ("name",)


class WorkspaceIntakeIssue(BaseModel):
    workspace = models.ForeignKey("db.Workspace", on_delete=models.CASCADE, related_name="workspace_intake_issues")
    intake = models.ForeignKey("db.WorkspaceIntake", related_name="issues", on_delete=models.CASCADE)
    issue = models.ForeignKey(
        "db.Issue",
        related_name="workspace_intake_source",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255)
    description_json = models.JSONField(blank=True, default=dict)
    description_html = models.TextField(blank=True, default="<p></p>")
    priority = models.CharField(
        max_length=30,
        choices=(
            ("urgent", "Urgent"),
            ("high", "High"),
            ("medium", "Medium"),
            ("low", "Low"),
            ("none", "None"),
        ),
        default="none",
    )
    status = models.IntegerField(
        choices=IntakeIssueStatus.choices,
        default=IntakeIssueStatus.PENDING,
    )
    snoozed_till = models.DateTimeField(null=True, blank=True)
    duplicate_to = models.ForeignKey(
        "self",
        related_name="duplicates",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    decision_note = models.TextField(blank=True)
    source = models.CharField(max_length=255, default=SourceType.IN_APP, null=True, blank=True)
    source_email = models.TextField(blank=True, null=True)
    external_source = models.CharField(max_length=255, null=True, blank=True)
    external_id = models.CharField(max_length=255, blank=True, null=True)
    extra = models.JSONField(default=dict)

    class Meta:
        verbose_name = "WorkspaceIntakeIssue"
        verbose_name_plural = "WorkspaceIntakeIssues"
        db_table = "workspace_intake_issues"
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.name} <{self.intake.name}>"


class IntakeFormField(BaseModel):
    workspace = models.ForeignKey("db.Workspace", on_delete=models.CASCADE, related_name="intake_form_fields")
    project = models.ForeignKey(
        "db.Project",
        related_name="intake_form_fields",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    workspace_intake = models.ForeignKey(
        "db.WorkspaceIntake",
        related_name="form_fields",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    intake = models.ForeignKey(
        "db.Intake",
        related_name="form_fields",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    label = models.CharField(max_length=255)
    placeholder = models.CharField(max_length=255, blank=True)
    help_text = models.TextField(blank=True)
    type = models.CharField(max_length=32, choices=IntakeFormFieldType.choices)
    config = models.JSONField(default=dict)
    is_required = models.BooleanField(default=False)
    relative_order = models.PositiveIntegerField(default=65535)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(workspace_intake__isnull=False, intake__isnull=True)
                    | models.Q(workspace_intake__isnull=True, intake__isnull=False)
                ),
                name="intake_form_field_one_owner",
            )
        ]
        verbose_name = "IntakeFormField"
        verbose_name_plural = "IntakeFormFields"
        db_table = "intake_form_fields"
        ordering = ("relative_order", "created_at")

    def __str__(self):
        return self.label


class IntakeFormFieldOption(BaseModel):
    field = models.ForeignKey("db.IntakeFormField", related_name="options", on_delete=models.CASCADE)
    label = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    relative_order = models.PositiveIntegerField(default=65535)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["field", "value"],
                condition=models.Q(deleted_at__isnull=True),
                name="intake_form_option_unique_value_active",
            )
        ]
        verbose_name = "IntakeFormFieldOption"
        verbose_name_plural = "IntakeFormFieldOptions"
        db_table = "intake_form_field_options"
        ordering = ("relative_order", "created_at")

    def __str__(self):
        return f"{self.label} <{self.field.label}>"


class IntakeFormFieldValue(BaseModel):
    workspace = models.ForeignKey("db.Workspace", on_delete=models.CASCADE, related_name="intake_form_values")
    project = models.ForeignKey(
        "db.Project",
        related_name="intake_form_values",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    field = models.ForeignKey("db.IntakeFormField", related_name="values", on_delete=models.CASCADE)
    workspace_intake_issue = models.ForeignKey(
        "db.WorkspaceIntakeIssue",
        related_name="form_values",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    intake_issue = models.ForeignKey(
        "db.IntakeIssue",
        related_name="form_values",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    value_text = models.TextField(blank=True)
    value_number = models.DecimalField(max_digits=18, decimal_places=6, null=True, blank=True)
    value_datetime = models.DateTimeField(null=True, blank=True)
    value_boolean = models.BooleanField(null=True, blank=True)
    value_option = models.ForeignKey(
        "db.IntakeFormFieldOption",
        related_name="single_values",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    value_file_url = models.TextField(blank=True)
    value_user = models.ForeignKey(
        "db.User",
        related_name="intake_form_values",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(workspace_intake_issue__isnull=False, intake_issue__isnull=True)
                    | models.Q(workspace_intake_issue__isnull=True, intake_issue__isnull=False)
                ),
                name="intake_form_value_one_ticket",
            ),
            models.UniqueConstraint(
                fields=["field", "workspace_intake_issue"],
                condition=models.Q(workspace_intake_issue__isnull=False, deleted_at__isnull=True),
                name="intake_form_value_unique_ws_issue_field",
            ),
            models.UniqueConstraint(
                fields=["field", "intake_issue"],
                condition=models.Q(intake_issue__isnull=False, deleted_at__isnull=True),
                name="intake_form_value_unique_project_issue_field",
            ),
        ]
        verbose_name = "IntakeFormFieldValue"
        verbose_name_plural = "IntakeFormFieldValues"
        db_table = "intake_form_field_values"
        ordering = ("field__relative_order", "created_at")

    def __str__(self):
        return f"{self.field.label}"


class IntakeFormFieldValueOption(BaseModel):
    value = models.ForeignKey("db.IntakeFormFieldValue", related_name="selected_options", on_delete=models.CASCADE)
    option = models.ForeignKey("db.IntakeFormFieldOption", related_name="multi_values", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["value", "option"],
                condition=models.Q(deleted_at__isnull=True),
                name="intake_form_value_option_unique_active",
            )
        ]
        verbose_name = "IntakeFormFieldValueOption"
        verbose_name_plural = "IntakeFormFieldValueOptions"
        db_table = "intake_form_field_value_options"

    def __str__(self):
        return f"{self.value.field.label}: {self.option.label}"
