# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Django imports
from django.db import models

# Module imports
from .base import BaseModel


class Permission(BaseModel):
    code = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=32)

    class Meta:
        db_table = "permissions"
        ordering = ("category", "code")

    def __str__(self):
        return self.code


class Role(BaseModel):
    workspace = models.ForeignKey(
        "db.Workspace", on_delete=models.CASCADE, related_name="roles"
    )
    name = models.CharField(max_length=64)
    description = models.TextField(blank=True)
    is_system = models.BooleanField(default=False)
    # 20 = Admin, 15 = Member, 5 = Guest for system roles; null for custom
    level = models.PositiveSmallIntegerField(null=True, blank=True)
    permissions = models.ManyToManyField(
        "db.Permission", through="db.RolePermission", related_name="roles"
    )

    class Meta:
        db_table = "roles"
        constraints = [
            models.UniqueConstraint(
                fields=["workspace", "name"],
                condition=models.Q(deleted_at__isnull=True),
                name="role_unique_name_per_workspace_when_active",
            )
        ]

    def delete(self, *args, **kwargs):
        if self.is_system:
            raise models.deletion.ProtectedError(
                "System roles cannot be deleted.", [self]
            )
        return super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.workspace_id}:{self.name}"


class RolePermission(BaseModel):
    role = models.ForeignKey(
        "db.Role", on_delete=models.CASCADE, related_name="role_permissions"
    )
    permission = models.ForeignKey(
        "db.Permission", on_delete=models.CASCADE, related_name="role_permissions"
    )

    class Meta:
        db_table = "role_permissions"
        unique_together = ["role", "permission"]

    def __str__(self):
        return f"{self.role_id}:{self.permission_id}"
