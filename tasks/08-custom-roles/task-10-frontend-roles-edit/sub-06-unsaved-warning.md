# Sub-06 — Hook `useUnsavedChangesWarning`

**Task:** 10 · **Tamaño:** S

## Cambio

Hook reutilizable que avisa al usuario al navegar fuera con cambios sin guardar.

## Cómo

`apps/web/core/hooks/use-unsaved-changes-warning.ts`:

```typescript
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useUnsavedChangesWarning(dirty: boolean, message = "You have unsaved changes. Leave anyway?") {
  // beforeunload — refresh / cerrar pestaña
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, message]);

  // Navegación interna Next.js — interceptar push/replace
  // Nota: Next 14+ no expone hook nativo para esto; usar router.events si está disponible
  // o un patrón con history.pushState. Implementación detallada según versión de Next.
}
```

## Aceptación

- [ ] Refrescar la pestaña con dirty=true muestra confirmación nativa del navegador.
- [ ] Hook no produce warning con dirty=false.
- [ ] Cleanup correcto al desmontar.
