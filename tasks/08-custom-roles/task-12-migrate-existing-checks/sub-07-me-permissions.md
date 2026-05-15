# Sub-07 — Endpoint `GET /workspaces/{slug}/me/permissions/`

**Task:** 12 · **Tamaño:** XS

## Cambio

Endpoint que devuelve los codes que el usuario actual tiene en un workspace. Necesario para `usePermission` en frontend (task-09 sub-06).

## Cómo

`apps/api/plane/app/views/me.py`:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from plane.db.models import WorkspaceMember

class WorkspaceMyPermissionsView(APIView):
    def get(self, request, slug):
        member = (
            WorkspaceMember.objects
            .filter(workspace__slug=slug, member=request.user, deleted_at__isnull=True)
            .select_related("role_obj")
            .first()
        )
        if not member or not member.role_obj:
            return Response({"codes": []})
        codes = list(member.role_obj.permissions.values_list("code", flat=True))
        return Response({"codes": codes})
```

URL en `apps/api/plane/app/urls/me.py`:

```python
path("workspaces/<str:slug>/me/permissions/", WorkspaceMyPermissionsView.as_view(), name="me-permissions"),
```

## Aceptación

- [ ] Admin recibe lista completa.
- [ ] Guest recibe lista corta.
- [ ] Usuario fuera del workspace recibe `{"codes": []}` (no 404, frontend ya filtra).
