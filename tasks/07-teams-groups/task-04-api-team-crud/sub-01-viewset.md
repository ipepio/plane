# Sub-01 — `TeamViewSet`

**Task:** 04 · **Tamaño:** S

## Cambio

```python
# apps/api/plane/app/views/workspace/team.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status

from plane.db.models import Team, Workspace
from plane.app.serializers.team import TeamSerializer, TeamDetailSerializer


class TeamViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ("retrieve",):
            return TeamDetailSerializer
        return TeamSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["workspace"] = self._get_workspace()
        return ctx

    def _get_workspace(self):
        return Workspace.objects.get(slug=self.kwargs["slug"])

    def perform_create(self, serializer):
        serializer.save(workspace=self._get_workspace())

    def perform_destroy(self, instance):
        instance.deleted_at = timezone.now()
        instance.save(update_fields=["deleted_at"])
```

## Aceptación

- [ ] Create asigna `workspace` automáticamente desde el slug de URL.
- [ ] Destroy hace soft delete.
