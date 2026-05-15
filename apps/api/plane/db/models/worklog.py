# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

from .project import ProjectBaseModel


class IssueWorklog(ProjectBaseModel):
    issue = models.ForeignKey("db.Issue", on_delete=models.CASCADE, related_name="worklogs")
    logged_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="issue_worklogs")
    duration = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    started_at = models.DateTimeField(default=timezone.now)
    description = models.TextField(blank=True)
    is_billable = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Issue Worklog"
        verbose_name_plural = "Issue Worklogs"
        db_table = "issue_worklogs"
        ordering = ("-started_at", "-created_at")
        indexes = [
            models.Index(fields=["workspace", "started_at"], name="worklog_ws_started_idx"),
            models.Index(fields=["issue", "started_at"], name="worklog_issue_started_idx"),
            models.Index(fields=["logged_by", "started_at"], name="worklog_user_started_idx"),
        ]

    def __str__(self):
        return f"{self.issue_id} {self.logged_by_id} {self.duration}s"
