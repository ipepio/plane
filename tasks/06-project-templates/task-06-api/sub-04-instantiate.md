# Sub-04 — Action instantiate

**Task:** 06 · **Tamaño:** S

## Cambio

```python
from plane.utils.project_template.instantiator import instantiate_template
from plane.app.serializers.project_template import InstantiatePayloadSerializer


@action(detail=True, methods=["post"], url_path="instantiate")
def instantiate(self, request, slug, pk):
    tpl = self.get_object()
    s = InstantiatePayloadSerializer(data=request.data)
    s.is_valid(raise_exception=True)

    project = instantiate_template(
        tpl, workspace=tpl.workspace,
        name=s.validated_data["name"],
        identifier=s.validated_data["identifier"],
        vars=s.validated_data.get("vars") or {},
        by=request.user,
    )
    from plane.app.serializers import ProjectSerializer
    return Response(ProjectSerializer(project).data, status=201)
```

## Aceptación

- [ ] POST `instantiate` devuelve el proyecto recién creado.
- [ ] Identifier duplicado → 400.
