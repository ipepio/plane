# Sub-01 — Vista CSV streaming

**Task:** 06 · **Tamaño:** S

## Cambio

```python
import csv
from django.http import StreamingHttpResponse


class Echo:
    def write(self, value): return value


class WorkspaceWorklogCSVExportView(WorkspaceWorklogView):
    def get(self, request, slug):
        qs = self._build_queryset(request, slug)  # mismo método del task-05
        writer = csv.writer(Echo())

        def rows():
            yield writer.writerow(["date", "user", "project", "issue", "duration_minutes", "billable", "description"])
            for w in qs.iterator(chunk_size=500):
                yield writer.writerow([
                    w.started_at.isoformat(),
                    w.logged_by.display_name or w.logged_by.email,
                    w.project.name,
                    f"{w.project.identifier}-{w.issue.sequence_id}",
                    round(w.duration / 60, 2),
                    "true" if w.is_billable else "false",
                    (w.description or "").replace("\n", " "),
                ])

        resp = StreamingHttpResponse(rows(), content_type="text/csv")
        resp["Content-Disposition"] = f'attachment; filename="worklogs_{slug}.csv"'
        return resp
```

## Aceptación

- [ ] Streaming, no carga todo en memoria.
