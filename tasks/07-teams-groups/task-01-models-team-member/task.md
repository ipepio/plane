# Task 01 — Modelos `Team` y `TeamMember`

**Épica:** 07 · **Tamaño:** M

## Contexto

`Team` ya existe en `apps/api/plane/db/models/workspace.py:261` pero esquelético. No hay `TeamMember`.

Esta tarea:
1. Mueve `Team` a `apps/api/plane/db/models/team.py`.
2. Crea `TeamMember(team, member, role)`.
3. Mantiene re-export en `workspace.py` durante migración (otros imports siguen funcionando).

## Diseño

- `TeamMember.role`: enum `lead` / `member`. No otorga permisos (los permisos viven en épica 08).
- Un usuario puede pertenecer a varios teams → `unique_together = (team, member)`.
- `Team.name` único dentro del workspace (case-insensitive).
- Soft delete heredado de `BaseModel` (`deleted_at`).

## Archivos

- Crear: `apps/api/plane/db/models/team.py`
- Editar: `apps/api/plane/db/models/workspace.py` (eliminar definición, importar y re-exportar)
- Editar: `apps/api/plane/db/models/__init__.py` (exportar `TeamMember`)

## Aceptación

- [ ] `from plane.db.models import Team, TeamMember` funciona.
- [ ] Crear team con mismo nombre en mismo workspace → IntegrityError.
- [ ] Crear team con mismo nombre en workspace distinto → OK.
- [ ] Añadir mismo user dos veces al mismo team → IntegrityError.

## Sub-tareas

1. [sub-01 — Crear archivo team.py y mover modelo](./sub-01-move-team.md)
2. [sub-02 — Añadir constraint case-insensitive nombre](./sub-02-unique-name.md)
3. [sub-03 — Crear modelo TeamMember](./sub-03-team-member.md)
4. [sub-04 — Re-export y __init__ updates](./sub-04-reexport.md)
