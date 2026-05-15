# Task 05 — API miembros del team

**Épica:** 07 · **Tamaño:** S

## Contexto

Añadir y quitar miembros de un team, listar miembros del team, cambiar rol.

## Diseño

- Acciones nested bajo `TeamViewSet` vía `@action`:
  - `POST /teams/<id>/members/` — añadir miembros (bulk).
  - `DELETE /teams/<id>/members/<member_id>/` — quitar.
  - `PATCH /teams/<id>/members/<member_id>/` — cambiar rol.
- `GET` lista miembros ya viene en `TeamDetailSerializer`.

## Aceptación

- [ ] Bulk add: `POST {"members": [{"member": "<uuid>", "role": "lead"}, ...]}`.
- [ ] Duplicate (mismo user) → 400 con el listado conflictivo.
- [ ] Remove existente → 204.
- [ ] User no debe ser miembro del workspace → 400.

## Sub-tareas

1. [sub-01 — Endpoint POST bulk add](./sub-01-add-members.md)
2. [sub-02 — Endpoint DELETE remove](./sub-02-remove-member.md)
3. [sub-03 — Endpoint PATCH change role](./sub-03-change-role.md)
4. [sub-04 — Validación user-en-workspace](./sub-04-validation.md)
