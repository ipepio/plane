# Sub-08 — Actualizar tests existentes

**Task:** 12 · **Tamaño:** M

## Cambio

Tests que fabrican `WorkspaceMember(role=20)` directo deben pasar a fabricar también `role_obj` correcto, o usar fixtures actualizadas.

## Cómo

Auditar fixtures y factories en:
- `apps/api/plane/tests/conftest.py`
- Cualquier `factories.py` específico

Patrón:

```python
@pytest.fixture
def admin_member(workspace, admin_user, db):
    seed_permissions()
    seed_system_roles_for_workspace(workspace)
    role = Role.objects.get(workspace=workspace, name="Admin")
    return WorkspaceMember.objects.create(
        workspace=workspace, member=admin_user, role=20, role_obj=role,
    )
```

Análogo para `member_member`, `guest_member`.

Ejecutar:

```bash
pnpm --filter api test
# o el comando específico del proyecto
```

Iterar hasta verde.

## Aceptación

- [ ] Toda la suite de tests del API en verde.
- [ ] Coverage no baja respecto a la línea base previa.
- [ ] Cualquier test que probaba específicamente el integer check ahora prueba el permiso correspondiente.
