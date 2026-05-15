# Sub-02 — ViewSet base

**Task:** 06 · **Tamaño:** S

## Cambio

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from plane.db.models import ProjectTemplate, Workspace
from plane.app.serializers.project_template import (
    ProjectTemplateListSerializer, ProjectTemplateDetailSerializer,
)


class ProjectTemplateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProjectTemplate.objects.filter(workspace__slug=self.kwargs["slug"]).order_by("-created_at")

    def get_serializer_class(self):
        return ProjectTemplateListSerializer if self.action == "list" else ProjectTemplateDetailSerializer

    def perform_create(self, serializer):
        ws = Workspace.objects.get(slug=self.kwargs["slug"])
        serializer.save(workspace=ws, created_by=self.request.user)
```

## Aceptación

- [ ] List devuelve sin payload (lighter).
- [ ] Retrieve incluye payload.
