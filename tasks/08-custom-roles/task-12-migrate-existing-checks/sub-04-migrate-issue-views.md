# Sub-04 — Migrar views de issue

**Task:** 12 · **Tamaño:** M

## Cambio

Sustituir checks bajo `apps/api/plane/app/views/issue/`.

## Cómo

Mapa:
- Create → `issue.create`
- Update propio (autor) → `issue.edit_own`
- Update ajeno → `issue.edit_any`
- Delete propio → `issue.delete_own`
- Delete ajeno → `issue.delete_any`
- Comentar → `issue.comment`
- Cambiar estado → `issue.change_state`
- Cambiar asignado → `issue.change_assignee`

Helper para "own vs any":

```python
def can_edit_issue(request, workspace, issue):
    if has_permission(request, workspace, "issue.edit_any"):
        return True
    return issue.created_by_id == request.user.id and has_permission(request, workspace, "issue.edit_own")
```

Aplicar en `IssueViewSet.update`, `partial_update`, `destroy`.

## Aceptación

- [ ] Grep `role\s*[<>=]` en `views/issue/` → 0.
- [ ] Test: usuario con solo `issue.edit_own` no puede editar issue de otro.
- [ ] Test: usuario con `issue.edit_any` edita cualquiera.
