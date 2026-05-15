# Sub-03 — Action save_as

**Task:** 06 · **Tamaño:** S

## Cambio

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from plane.utils.project_template.snapshot import build_project_snapshot
from plane.db.models import Project


@action(detail=False, methods=["post"], url_path="save-as")
def save_as(self, request, slug):
    project_id = request.data.get("project")
    name = request.data.get("name")
    description = request.data.get("description", "")
    if not project_id or not name:
        return Response({"error": "project and name required"}, status=400)

    project = Project.objects.get(workspace__slug=slug, id=project_id)
    payload = build_project_snapshot(project)
    ws = project.workspace

    tpl = ProjectTemplate.objects.create(
        workspace=ws, name=name, description=description,
        payload=payload, created_by=request.user,
    )
    return Response(ProjectTemplateDetailSerializer(tpl).data, status=status.HTTP_201_CREATED)
```

## Aceptación

- [ ] POST `save-as` crea plantilla y devuelve detail.
- [ ] Nombre duplicado → 400/409.
