# Sub-02 — Computed totales

**Task:** 09 · **Tamaño:** XS

## Cambio

```ts
get totalPendingInWorkspace() {
  let total = 0;
  for (const intake of this.intakes.values()) total += intake.pending_count;
  return total;
}
```

Para badge en sidebar.

## Aceptación

- [ ] Badge en sidebar refleja el total.
