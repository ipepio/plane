# Sub-01 — Audit de puntos a migrar

**Task:** 12 · **Tamaño:** S

## Cambio

Generar la lista exhaustiva de líneas/views que comparan `role` int. Dejarla en este archivo (sub-01) o en un `audit.md` paralelo.

## Cómo

```bash
rg -n "role\s*>=\s*\d+|role\s*==\s*\d+|role\s*<\s*\d+" apps/api/plane/app/views/ \
  > tasks/08-custom-roles/task-12-migrate-existing-checks/audit-results.txt
```

También buscar usos de los enteros 20/15/5 en contexto de permisos:

```bash
rg -n "WorkspaceMemberRole|ProjectMemberRole|ROLE_CHOICES" apps/api/plane/
```

Anotar para cada hit: archivo, vista, qué acción protege y qué permission code propuesto. Salida en formato tabla:

| Archivo | Vista | Acción | Permission code |
|---|---|---|---|
| `views/issue/base.py:152` | `IssueViewSet.create` | crear issue | `issue.create` |
| ... | ... | ... | ... |

## Aceptación

- [ ] `audit-results.txt` listado y revisado manualmente.
- [ ] Cada hit del audit tiene un `permission code` candidato asignado.
- [ ] Sin el audit no se pueden cerrar las sub-tareas siguientes.
