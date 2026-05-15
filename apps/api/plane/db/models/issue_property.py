# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.conf import settings
from django.db import models
from django.db.models import Q

from .project import ProjectBaseModel
from .workspace import WorkspaceBaseModel


class IssuePropertyType(models.TextChoices):
    TEXT = "text", "Text"
    LONG_TEXT = "long_text", "Long text"
    NUMBER = "number", "Number"
    DATE = "date", "Date"
    BOOLEAN = "boolean", "Boolean"
    SELECT = "select", "Select"
    MULTI_SELECT = "multi_select", "Multi-select"
    USER = "user", "User"
    URL = "url", "URL"


class IssueProperty(WorkspaceBaseModel):
    issue_type = models.ForeignKey("db.IssueType", related_name="properties", on_delete=models.CASCADE)
    project = models.ForeignKey(
        "db.Project",
        related_name="issue_properties",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    name = models.SlugField(max_length=80)
    display_name = models.CharField(max_length=255)
    type = models.CharField(max_length=30, choices=IssuePropertyType.choices)
    config = models.JSONField(default=dict, blank=True)
    is_required = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    relative_order = models.FloatField(default=65535)

    class Meta:
        verbose_name = "Issue Property"
        verbose_name_plural = "Issue Properties"
        db_table = "issue_properties"
        ordering = ("relative_order", "created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["issue_type", "project", "name"],
                condition=Q(deleted_at__isnull=True),
                name="issue_property_unique_type_project_name",
            )
        ]

    def __str__(self):
        return self.display_name


class IssuePropertyOption(WorkspaceBaseModel):
    property = models.ForeignKey("db.IssueProperty", related_name="options", on_delete=models.CASCADE)
    project = models.ForeignKey(
        "db.Project",
        related_name="issue_property_options",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255)
    value = models.SlugField(max_length=80)
    color = models.CharField(max_length=20, blank=True)
    relative_order = models.FloatField(default=65535)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Issue Property Option"
        verbose_name_plural = "Issue Property Options"
        db_table = "issue_property_options"
        ordering = ("relative_order", "created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["property", "value"],
                condition=Q(deleted_at__isnull=True),
                name="issue_property_option_unique_property_value",
            )
        ]

    def __str__(self):
        return self.name


class IssuePropertyValue(ProjectBaseModel):
    issue = models.ForeignKey("db.Issue", related_name="property_values", on_delete=models.CASCADE)
    property = models.ForeignKey("db.IssueProperty", related_name="values", on_delete=models.CASCADE)
    value_text = models.TextField(blank=True, null=True)
    value_number = models.DecimalField(max_digits=18, decimal_places=6, null=True, blank=True)
    value_datetime = models.DateTimeField(null=True, blank=True)
    value_boolean = models.BooleanField(null=True, blank=True)
    value_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="issue_property_values",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    value_option = models.ForeignKey(
        "db.IssuePropertyOption",
        related_name="issue_property_values",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Issue Property Value"
        verbose_name_plural = "Issue Property Values"
        db_table = "issue_property_values"
        ordering = ("property__relative_order", "created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["issue", "property"],
                condition=Q(deleted_at__isnull=True),
                name="issue_property_value_unique_issue_property",
            )
        ]

    def __str__(self):
        return f"{self.issue_id} {self.property_id}"


class IssuePropertyValueOption(ProjectBaseModel):
    value = models.ForeignKey("db.IssuePropertyValue", related_name="selected_options", on_delete=models.CASCADE)
    option = models.ForeignKey("db.IssuePropertyOption", related_name="selected_values", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Issue Property Value Option"
        verbose_name_plural = "Issue Property Value Options"
        db_table = "issue_property_value_options"
        constraints = [
            models.UniqueConstraint(
                fields=["value", "option"],
                condition=Q(deleted_at__isnull=True),
                name="issue_property_value_option_unique",
            )
        ]

    def __str__(self):
        return f"{self.value_id} {self.option_id}"
