# Sub-01 — Definir keys en `en/translations.json`

**Task:** 11 · **Tamaño:** S

## Cambio

Añadir el bloque `roles.*` completo en el locale base (inglés).

## Cómo

Editar `packages/i18n/src/locales/en/translations.json` (o `core.json` si así es la convención del repo — verificar). Añadir el bloque `roles` siguiendo el ejemplo de la `task.md`.

Para `permissions.{code}` — generar una entrada por cada code del catálogo de task-02 (sub-01). Recomendado: pequeño script que recorra `PERMISSIONS` y genere el JSON, ejecutado una vez.

## Aceptación

- [ ] Bloque `roles` está presente.
- [ ] Hay una key `roles.permissions.{code}` por cada code del catálogo (≥ 25).
- [ ] El JSON sigue siendo válido (`pnpm --filter @plane/i18n check:format`).
