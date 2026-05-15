# Sub-02 — Replicar keys en todos los locales

**Task:** 11 · **Tamaño:** S

## Cambio

Cada locale debe tener exactamente las mismas keys que `en` (con valores traducidos cuando existan, o el valor en inglés como placeholder).

## Cómo

Script auxiliar `packages/i18n/scripts/sync-keys.ts` (si no existe ya algo similar):

```typescript
import en from "../src/locales/en/translations.json";
import * as fs from "fs";
import * as path from "path";

const LOCALES_DIR = path.join(__dirname, "..", "src", "locales");
const locales = fs.readdirSync(LOCALES_DIR).filter((l) => l !== "en");

function merge(base: any, target: any): any {
  if (typeof base !== "object" || base === null) return target ?? base;
  const out: any = Array.isArray(base) ? [] : {};
  for (const k of Object.keys(base)) {
    out[k] = (target && k in target)
      ? merge(base[k], target[k])
      : base[k];  // placeholder = valor inglés
  }
  return out;
}

for (const locale of locales) {
  const file = path.join(LOCALES_DIR, locale, "translations.json");
  const current = JSON.parse(fs.readFileSync(file, "utf-8"));
  const merged = merge(en, current);
  fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
}
```

```bash
pnpm tsx packages/i18n/scripts/sync-keys.ts
```

## Aceptación

- [ ] Cada `translations.json` tiene las mismas keys que `en`.
- [ ] Diff visible en revisión: solo añade keys, no remueve traducciones existentes.
- [ ] `pnpm --filter @plane/i18n check` pasa.
