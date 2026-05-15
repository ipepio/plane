# Sub-01 — View singular

**Task:** 07 · **Tamaño:** S

## Cambio

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from plane.db.models import Workspace, WorkspaceSSOConfig
from plane.app.serializers.workspace_sso import WorkspaceSSOConfigSerializer
from plane.app.permissions import WorkSpaceAdminPermission


class WorkspaceSSOConfigView(APIView):
    permission_classes = [WorkSpaceAdminPermission]

    def _get_ws(self, slug):
        return Workspace.objects.get(slug=slug)

    def get(self, request, slug):
        ws = self._get_ws(slug)
        cfg = getattr(ws, "sso_config", None)
        if not cfg:
            return Response({"enabled": False, "allowed_domains": [], "auto_provision_role": 15})
        return Response(WorkspaceSSOConfigSerializer(cfg).data)

    def put(self, request, slug):
        ws = self._get_ws(slug)
        cfg, _ = WorkspaceSSOConfig.objects.get_or_create(workspace=ws)
        s = WorkspaceSSOConfigSerializer(cfg, data=request.data, partial=False)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)

    def patch(self, request, slug):
        ws = self._get_ws(slug)
        cfg, _ = WorkspaceSSOConfig.objects.get_or_create(workspace=ws)
        s = WorkspaceSSOConfigSerializer(cfg, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)
```

## Aceptación

- [ ] GET sin config devuelve defaults.
- [ ] PUT/PATCH hace upsert.
- [ ] Solo Admin entra.
