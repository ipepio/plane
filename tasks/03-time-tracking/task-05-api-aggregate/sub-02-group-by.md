# Sub-02 — Agregado group_by

**Task:** 05 · **Tamaño:** M

## Cambio

```python
from django.db.models import Sum, Q
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth

TRUNC = {"day": TruncDay, "week": TruncWeek, "month": TruncMonth}


def _group(self, qs, group_by):
    if group_by in TRUNC:
        qs = qs.annotate(_bucket=TRUNC[group_by]("started_at"))
        key_field = "_bucket"
    elif group_by == "user":
        key_field = "logged_by_id"
    elif group_by == "project":
        key_field = "project_id"
    else:
        return {"error": "invalid group_by"}

    rows = (
        qs.values(key_field)
        .annotate(
            total_seconds=Sum("duration"),
            billable_seconds=Sum("duration", filter=Q(is_billable=True)),
        )
        .order_by(key_field)
    )
    return [
        {"key": r[key_field], "total_seconds": r["total_seconds"], "billable_seconds": r["billable_seconds"] or 0}
        for r in rows
    ]
```

## Aceptación

- [ ] `group_by=user` agrupa por usuario.
- [ ] `group_by=day` produce buckets diarios correctos.
