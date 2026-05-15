# Sub-02 — `PermissionStore` (catálogo)

**Task:** 10 · **Tamaño:** S

## Cambio

Store global que carga el catálogo `Permission` (lista plana) una vez. Necesario para renderizar la matriz aunque el rol tenga cero permisos.

## Cómo

Backend: añadir endpoint trivial:

```
GET /api/v1/permissions/   → lista de Permission (paginado off, cache 1h)
```

`apps/api/plane/app/views/role.py`:

```python
class PermissionListView(generics.ListAPIView):
    serializer_class = PermissionSerializer
    pagination_class = None
    queryset = Permission.objects.all()
```

`apps/web/core/store/permissions/permission.store.ts`:

```typescript
import { action, makeObservable, observable, runInAction } from "mobx";
import type { TPermission } from "@plane/types";

export class PermissionStore {
  catalog: TPermission[] = [];
  loaded = false;

  constructor() {
    makeObservable(this, { catalog: observable, loaded: observable, ensureLoaded: action });
  }

  async ensureLoaded() {
    if (this.loaded) return;
    const r = await fetch("/api/v1/permissions/");
    const data: TPermission[] = await r.json();
    runInAction(() => {
      this.catalog = data;
      this.loaded = true;
    });
  }

  byCategory(): Record<string, TPermission[]> {
    return this.catalog.reduce((acc, p) => {
      (acc[p.category] ??= []).push(p);
      return acc;
    }, {} as Record<string, TPermission[]>);
  }
}
```

## Aceptación

- [ ] `ensureLoaded` solo dispara fetch una vez por sesión.
- [ ] `byCategory()` agrupa correctamente.
