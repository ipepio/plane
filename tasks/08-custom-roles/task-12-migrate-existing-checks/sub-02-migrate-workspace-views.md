# Sub-02 — Migrar views de workspace

**Task:** 12 · **Tamaño:** M

## Cambio

Sustituir checks de rol entero en views bajo `apps/api/plane/app/views/workspace/`.

## Cómo

Por cada view del audit:

```python
# antes
class WorkspaceMemberInvite(...):
    def post(self, request, slug):
        member = WorkspaceMember.objects.get(workspace__slug=slug, member=request.user)
        if member.role < 20:
            return Response(..., status=403)
        ...
```

```python
# después
class WorkspaceMemberInvite(...):
    permission_classes = [IsAuthenticated, HasWorkspacePermission]
    required_permission = "workspace.invite_members"
    def post(self, request, slug):
        ...
```

Usar el catálogo:
- `manage_members` → invitar/remover
- `manage_settings` → cambiar nombre, branding
- `manage_roles` → ya cubierto en task-06
- `view_billing` → endpoints de billing

## Aceptación

- [ ] Grep `role\s*[<>=]` en `views/workspace/` → 0.
- [ ] Tests de workspace existentes pasan.
- [ ] Smoke: Member sin `manage_members` no puede invitar.
