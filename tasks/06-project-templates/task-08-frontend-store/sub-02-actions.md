# Sub-02 — Acciones

**Task:** 08 · **Tamaño:** S

## Cambio

```ts
async fetch(slug: string) {
  this.loading = true;
  try {
    const rows = await this.service.list(slug);
    runInAction(() => { this.list = Object.fromEntries(rows.map(r => [r.id, r])); });
  } finally { runInAction(() => { this.loading = false; }); }
}

async saveAs(slug: string, data: { project: string; name: string; description?: string }) {
  const t = await this.service.saveAs(slug, data);
  runInAction(() => { this.list[t.id] = t; });
  return t;
}

async instantiate(slug: string, id: string, name: string, identifier: string, vars: Record<string, string>) {
  return this.service.instantiate(slug, id, { name, identifier, vars });
}

async remove(slug: string, id: string) {
  await this.service.delete(slug, id);
  runInAction(() => { delete this.list[id]; });
}

async fetchPlaceholders(slug: string, id: string) {
  return (await this.service.placeholders(slug, id)).placeholders;
}
```

## Aceptación

- [ ] `instantiate` no muta `list` (es un proyecto, no template).
