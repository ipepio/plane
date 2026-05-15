# Task 01 — Modelo WorkspaceSSOConfig

**Épica:** 04 · **Tamaño:** S

## Contexto

Persistir configuración SSO por workspace.

## Diseño

- `WorkspaceSSOConfig(BaseModel)` con OneToOne a `Workspace` (un solo config por workspace).
- `allowed_domains` como `ArrayField` o `JSONField` (lista de strings normalizados a lowercase).
- `auto_provision_role` con choices iguales a `WorkspaceMember.role` (5/15/20).
- `enabled` boolean.
- Validación: dominios sin `@`, lowercase, formato `host.tld` mínimo.

## Archivos

- `apps/api/plane/db/models/workspace_sso.py` (nuevo)
- `apps/api/plane/db/models/__init__.py`

## Aceptación

- [ ] `WorkspaceSSOConfig.objects.create(workspace=..., allowed_domains=["goguest.com"])` funciona.
- [ ] Dominio con espacios o uppercase se normaliza.

## Sub-tareas

1. [sub-01 — Crear archivo](./sub-01-file.md)
2. [sub-02 — Modelo + validators](./sub-02-model.md)
3. [sub-03 — Re-export](./sub-03-reexport.md)
