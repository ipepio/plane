# Sub-04 — Re-exports

**Task:** 01 · **Tamaño:** XS

## Cambio

1. Eliminar definición de `Team` en `workspace.py` y dejar `from plane.db.models.team import Team` arriba.
2. En `apps/api/plane/db/models/__init__.py` exponer ambos: `from .team import Team, TeamMember`.

## Cómo

```python
# apps/api/plane/db/models/workspace.py (arriba)
from plane.db.models.team import Team  # noqa: F401  (back-compat)
```

```python
# apps/api/plane/db/models/__init__.py
from .team import Team, TeamMember
```

## Aceptación

- [ ] Grep `class Team\b` en `db/models/` → solo aparece en `team.py`.
- [ ] Imports antiguos `from plane.db.models.workspace import Team` siguen vivos.
