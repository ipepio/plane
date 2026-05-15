# Sub-01 — ViewSet base

**Task:** 04 · **Tamaño:** S

## Cambio

```python
from rest_framework import viewsets
from plane.db.models import IssueWorklog
from plane.app.serializers import IssueWorklogSerializer
from plane.app.permissions import ProjectEntityPermission


class IssueWorklogViewSet(viewsets.ModelViewSet):
    serializer_class = IssueWorklogSerializer
    permission_classes = [ProjectEntityPermission]

    def get_queryset(self):
        return (
            IssueWorklog.objects.filter(
                workspace__slug=self.kwargs["slug"],
                project_id=self.kwargs["project_id"],
                issue_id=self.kwargs["issue_id"],
            )
            .select_related("logged_by", "issue", "project")
            .order_by("-started_at")
        )

    def perform_create(self, serializer):
        serializer.save(
            logged_by=self.request.user,
            workspace_id=self._workspace_id(),
            project_id=self.kwargs["project_id"],
            issue_id=self.kwargs["issue_id"],
        )

    def _workspace_id(self):
        from plane.db.models import Workspace
        return Workspace.objects.values_list("id", flat=True).get(slug=self.kwargs["slug"])
```

## Aceptación

- [ ] `logged_by` se asigna a `request.user` siempre.
