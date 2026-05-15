# Sub-01 — Vista list + filtros

**Task:** 05 · **Tamaño:** M

## Cambio

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from plane.db.models import IssueWorklog
from plane.app.serializers import WorkspaceWorklogReadSerializer


class WorkspaceWorklogView(APIView):
    def get(self, request, slug):
        qs = (
            IssueWorklog.objects.filter(workspace__slug=slug)
            .select_related("logged_by", "project", "issue")
        )
        p = request.query_params
        if p.get("from"):
            qs = qs.filter(started_at__gte=p["from"])
        if p.get("to"):
            qs = qs.filter(started_at__lt=p["to"])
        if p.getlist("user"):
            qs = qs.filter(logged_by_id__in=p.getlist("user"))
        if p.getlist("project"):
            qs = qs.filter(project_id__in=p.getlist("project"))
        if p.get("billable") in ("true", "false"):
            qs = qs.filter(is_billable=(p["billable"] == "true"))

        if p.get("group_by"):
            return Response(self._group(qs, p["group_by"]))

        page = self.paginate(qs.order_by("-started_at"), request)
        return Response(WorkspaceWorklogReadSerializer(page, many=True).data)
```

## Aceptación

- [ ] Filtros combinables funcionan.
