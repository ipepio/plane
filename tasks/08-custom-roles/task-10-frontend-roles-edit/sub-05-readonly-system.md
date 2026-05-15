# Sub-05 — Read-only para roles del sistema

**Task:** 10 · **Tamaño:** S

## Cambio

Cubrir los caminos que aún permitirían editar un rol del sistema en cliente: bloquear inputs, ocultar Save, deshabilitar checkboxes en matriz.

## Cómo

Ya cubierto en sub-04 (`disabled={isSystem}`) y sub-03 (`readOnly`). Reforzar con:

- Test e2e (Playwright si el repo lo tiene; si no, smoke manual): visitar `/settings/roles/{system_id}` → comprobar que cualquier input/click no produce mutación.
- Defensa en profundidad: aunque el cliente intente, el backend bloquea (task-06 sub-02 y task-07 sub-01 ya lo cubren).

Banner explícito (en sub-04) y deshabilitación visual coherente:

```tsx
<input ... className={cn(isSystem && "opacity-60 cursor-not-allowed")} />
```

## Aceptación

- [ ] Visualmente claro que no se puede editar (opacidad + cursor).
- [ ] Aunque se manipule el DOM con devtools y se haga clic en Save, el backend devuelve 403.
- [ ] No aparece "unsaved changes" en roles del sistema.
