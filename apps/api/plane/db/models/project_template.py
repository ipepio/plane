# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.db import models
from django.db.models import Q
from django.db.models.functions import Lower

from .workspace import WorkspaceBaseModel


class ProjectTemplate(WorkspaceBaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    icon_props = models.JSONField(default=dict, blank=True)
    payload = models.JSONField(default=dict)

    class Meta:
        verbose_name = "Project Template"
        verbose_name_plural = "Project Templates"
        db_table = "project_templates"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["workspace"], name="project_template_ws_idx"),
        ]
        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                "workspace",
                condition=Q(deleted_at__isnull=True),
                name="project_template_unique_ws_name_ci",
            )
        ]

    def __str__(self):
        return self.name
