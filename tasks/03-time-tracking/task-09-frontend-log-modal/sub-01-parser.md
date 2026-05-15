# Sub-01 — Parser de duración

**Task:** 09 · **Tamaño:** S

## Cambio

```ts
// apps/web/core/helpers/duration.ts
export function parseDurationToSeconds(input: string): number | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;

  // "1:30" → 1h 30m
  const colon = s.match(/^(\d+):(\d{1,2})$/);
  if (colon) return parseInt(colon[1]) * 3600 + parseInt(colon[2]) * 60;

  // "1h30m", "90m", "5400s"
  const re = /(\d+)\s*(h|m|s)/g;
  let total = 0, matched = false, m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    matched = true;
    const n = parseInt(m[1]);
    total += m[2] === "h" ? n * 3600 : m[2] === "m" ? n * 60 : n;
  }
  if (matched) return total;

  // plain number → minutes
  if (/^\d+$/.test(s)) return parseInt(s) * 60;
  return null;
}

export function formatSeconds(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}
```

## Aceptación

- [ ] `parseDurationToSeconds("1h30m")` = 5400.
- [ ] `parseDurationToSeconds("1:30")` = 5400.
- [ ] `parseDurationToSeconds("90")` = 5400.
- [ ] `parseDurationToSeconds("xyz")` = null.
