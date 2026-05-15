# Sub-03 — Migrar views de project

**Task:** 12 · **Tamaño:** M

## Cambio

Mismo proceso bajo `apps/api/plane/app/views/project/`.

## Cómo

Mapeo:
- Crear proyecto → `project.create` (workspace-level perm)
- Archivar / eliminar → `project.archive` / `project.delete`
- Manage members → `project.manage_members`
- Manage settings → `project.manage_settings`

Para checks contra `ProjectMember`:

```python
# antes
member = ProjectMember.objects.get(project__slug=slug, member=request.user)
if member.role < 20:
    return 403

# después
@require_permission("project.manage_settings")
def patch(self, request, slug, project_id):
    ...
```

> Nota: el decorador asume scope workspace. Para acciones project-level se puede aceptar la simplificación (Admin del workspace = Admin de todos los proyectos), o crear un `HasProjectPermission` análogo si el proyecto necesita override. Decisión deferida: empezar con scope workspace y revisar si emerge un caso real.

## Aceptación

- [ ] Grep `role\s*[<>=]` en `views/project/` → 0.
- [ ] Tests existentes pasan.
- [ ] Member que no debería archivar proyecto recibe 403.
