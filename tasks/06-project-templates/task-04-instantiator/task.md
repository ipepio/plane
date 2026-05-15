# Task 04 — Instantiator (JSON → proyecto)

**Épica:** 06 · **Tamaño:** L

## Contexto

`instantiate_template(template, workspace, *, name, identifier, vars, by)` crea un proyecto nuevo + toda la estructura del snapshot, resolviendo refs internos y aplicando placeholders.

## Diseño

- En `apps/api/plane/utils/project_template/instantiator.py`.
- Todo dentro de una transacción atómica.
- Construye un `keymap` `{internal_key → real_id}` y lo va llenando a medida que crea estados, labels, etc.
- Issues se crean en dos pasadas: primero sin `parent`, luego se asigna `parent` resuelto.
- Si `D3` se decidió "reutilizar workspace types": antes de crear un type, buscar por nombre case-insensitive en el workspace y reusar. Si no existe, crear.

## Archivos

- `apps/api/plane/utils/project_template/instantiator.py` (nuevo)

## Aceptación

- [ ] Crear proyecto desde snapshot reproduce jerarquía épica → sub.
- [ ] Falla al crear cualquier entidad revierte todo (transacción).
- [ ] Llamado N veces produce N proyectos independientes (sin colisión por slug/identifier).

## Sub-tareas

1. [sub-01 — Esqueleto + keymap](./sub-01-skeleton.md)
2. [sub-02 — Crear proyecto + estados + labels](./sub-02-base.md)
3. [sub-03 — Issue types + propiedades](./sub-03-types.md)
4. [sub-04 — Módulos, ciclos](./sub-04-modules-cycles.md)
5. [sub-05 — Issues en 2 pasadas](./sub-05-issues.md)
6. [sub-06 — Atomicidad y rollback](./sub-06-atomicity.md)
7. [sub-07 — Tests integrados](./sub-07-tests.md)
