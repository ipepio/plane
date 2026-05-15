# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import functools

from django.http import JsonResponse

from rest_framework.permissions import BasePermission


_CACHE_ATTR = "_permission_cache"


def has_permission(user, workspace, code: str) -> bool:
    """Return True if `user` holds `code` in `workspace`.

    Results are cached on the current thread's request object when called
    via `has_permission_for_request`. Call this directly in tests.
    """
    from plane.db.models import WorkspaceMember, RolePermission

    if user is None or not user.is_authenticated:
        return False

    try:
        member = WorkspaceMember.objects.select_related("role_id").get(
            workspace=workspace, member=user, is_active=True
        )
    except WorkspaceMember.DoesNotExist:
        return False

    role = member.role_id  # FK to Role
    if role is None:
        # Fallback: no Role FK yet — trust legacy int field
        return member.role >= 15

    return RolePermission.objects.filter(
        role=role, permission__code=code
    ).exists()


def has_permission_for_request(request, workspace, code: str) -> bool:
    """Like `has_permission` but caches the result on `request`."""
    cache = getattr(request, _CACHE_ATTR, None)
    if cache is None:
        cache = {}
        setattr(request, _CACHE_ATTR, cache)

    ws_id = workspace.id if hasattr(workspace, "id") else workspace
    key = (str(ws_id), code)
    if key not in cache:
        cache[key] = has_permission(request.user, workspace, code)
    return cache[key]


class HasWorkspacePermission(BasePermission):
    """DRF permission class.  Set `required_permission` on the view class."""

    message_template = "Missing permission: {code}"

    def has_permission(self, request, view):
        code = getattr(view, "required_permission", None)
        if not code:
            return True  # no requirement declared → pass through

        workspace = self._resolve_workspace(request, view)
        if workspace is None:
            return False

        allowed = has_permission_for_request(request, workspace, code)
        if not allowed:
            self.message = self.message_template.format(code=code)
        return allowed

    @staticmethod
    def _resolve_workspace(request, view):
        """Try common patterns to find the workspace object."""
        from plane.db.models import Workspace

        slug = (
            view.kwargs.get("slug")
            or request.parser_context.get("kwargs", {}).get("slug")
        )
        if slug:
            try:
                return Workspace.objects.get(slug=slug)
            except Workspace.DoesNotExist:
                return None
        return None


def require_permission(code: str):
    """Decorator for DRF APIView methods or plain Django views.

    Usage::

        @require_permission("project.delete")
        def my_view(request, slug, ...):
            ...
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(request_or_self, *args, **kwargs):
            # Support both FBVs (request as first arg) and CBV methods
            # (self as first arg, request as second).
            if hasattr(request_or_self, "user"):
                request = request_or_self
            else:
                request = args[0] if args else None

            if request is None or not hasattr(request, "user"):
                return JsonResponse({"error": "Unauthorized"}, status=401)

            from plane.db.models import Workspace
            slug = kwargs.get("slug") or (args[1] if len(args) > 1 else None)
            try:
                workspace = Workspace.objects.get(slug=slug) if slug else None
            except Workspace.DoesNotExist:
                workspace = None

            if workspace is None or not has_permission_for_request(request, workspace, code):
                return JsonResponse(
                    {"error": f"Missing permission: {code}"}, status=403
                )

            return func(request_or_self, *args, **kwargs)

        return wrapper
    return decorator
