# Task 03 — Snapshot builder (proyecto → JSON)

**Épica:** 06 · **Tamaño:** L

## Contexto

Función `build_project_snapshot(project)` que devuelve un dict JSON-serializable con la estructura completa: proyecto, estados, labels, módulos, ciclos, issue types + propiedades, issues con jerarquía.

## Diseño

- Servicio puro en `apps/api/plane/utils/project_template/snapshot.py`.
- IDs **internos** del snapshot: usar índices/UUIDs sintéticos para preservar refs (parent_id, state_id, labels, type_id) **sin** filtrar UUIDs reales del proyecto base.
- Esquema versionado (`"schema_version": 1`) para soportar evolución.
- Excluye: comentarios, attachments, worklog, valores de propiedades por issue, asignaciones de usuarios.

## Archivos

- `apps/api/plane/utils/project_template/__init__.py` (nuevo)
- `apps/api/plane/utils/project_template/snapshot.py` (nuevo)

## Aceptación

- [ ] Proyecto con 3 estados + 5 labels + 2 módulos + 1 ciclo + 3 épicas + 12 issues produce snapshot JSON con todas las refs resueltas internamente.
- [ ] Roundtrip JSON limpio (`json.dumps(snapshot)` no falla).
- [ ] Sin UUIDs reales en el payload (verificable por regex).

## Sub-tareas

1. [sub-01 — Esqueleto y versionado](./sub-01-skeleton.md)
2. [sub-02 — Estados, labels, módulos, ciclos](./sub-02-aux.md)
3. [sub-03 — Issue types y propiedades](./sub-03-types.md)
4. [sub-04 — Issues con jerarquía](./sub-04-issues.md)
5. [sub-05 — Tests](./sub-05-tests.md)
