# Sub-04 — Validación cruzada (user en workspace)

**Task:** 05 · **Tamaño:** XS

## Cambio

Asegurar que ningún endpoint permite añadir un user que NO sea miembro del workspace. Ya está cubierto en `sub-01`, replicar la comprobación en cualquier otro path.

Si épica 08 ya está lista, este check sigue siendo independiente (la pertenencia al workspace no es un permiso, es una pertenencia).

## Aceptación

- [ ] Test: añadir user externo al workspace → 400 con detail descriptivo.
- [ ] Test: añadir user soft-deleted del workspace → 400.
