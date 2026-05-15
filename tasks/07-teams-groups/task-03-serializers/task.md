# Task 03 — Serializers Team / TeamMember

**Épica:** 07 · **Tamaño:** S

## Contexto

Necesitamos serializers DRF para responder a la API:
- `TeamSerializer` — `id`, `name`, `description`, `logo_props`, `member_count`.
- `TeamDetailSerializer` — adicionalmente `members` (lista de `TeamMemberSerializer`).
- `TeamMemberSerializer` — `id`, `member`, `member_detail` (nested user básico), `role`.

## Diseño

- `member_count` calculado via `annotate(Count("team_members"))` en el queryset → no en `SerializerMethodField` (perf).
- Validar nombre único en `validate_name` (case-insensitive contra el workspace en URL).

## Archivos

- Crear: `apps/api/plane/app/serializers/team.py`
- Editar: `apps/api/plane/app/serializers/__init__.py`

## Aceptación

- [ ] `TeamSerializer(team).data` devuelve campos esperados.
- [ ] `TeamDetailSerializer` incluye `members`.
- [ ] Validación: crear team con nombre duplicado → error 400.

## Sub-tareas

1. [sub-01 — TeamSerializer](./sub-01-team-serializer.md)
2. [sub-02 — TeamMemberSerializer](./sub-02-team-member-serializer.md)
3. [sub-03 — TeamDetailSerializer + validación nombre](./sub-03-team-detail.md)
