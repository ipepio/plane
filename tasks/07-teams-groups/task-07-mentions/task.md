# Task 07 — @mentions de teams

**Épica:** 07 · **Tamaño:** S

## Contexto

Los comentarios actuales tokenizan `@user` y disparan notificaciones. Añadir soporte para `@team-slug` → notifica a todos los miembros (sin duplicados).

## Diseño

- En el parser del editor (tiptap), añadir tipo de mención `team-mention`.
- Backend: detectar nodos `team-mention` en payload de `CommentCreate` y expandir a la lista de `TeamMember`.
- Crear notificaciones para cada miembro (deduplicado contra `@user` directos).

## Aceptación

- [ ] Comentario "Hola @backend" en un issue con team `backend` (4 members) → 4 notificaciones (5 si autor está, excluyendo al autor).
- [ ] Comentario con @user y @team que comparten miembro no duplica notificación.
- [ ] @team inexistente no rompe el render.

## Sub-tareas

1. [sub-01 — Backend: parser de team-mention](./sub-01-parser.md)
2. [sub-02 — Expansión a notificaciones](./sub-02-expand.md)
3. [sub-03 — Tiptap extension en editor](./sub-03-tiptap.md)
4. [sub-04 — API search teams para autocompletado](./sub-04-search.md)
