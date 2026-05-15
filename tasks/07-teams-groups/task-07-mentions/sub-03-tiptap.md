# Sub-03 — Tiptap extension `TeamMention`

**Task:** 07 · **Tamaño:** M

## Cambio

En `packages/editor` (o donde vivan las extensions custom), añadir extension `TeamMention` paralela a `Mention`:

```ts
// packages/editor/src/extensions/team-mention.ts
import Mention from "@tiptap/extension-mention";

export const TeamMention = Mention.extend({
  name: "teamMention",
  parseHTML() {
    return [{ tag: 'span[data-type="team-mention"]' }];
  },
  renderHTML({ node, HTMLAttributes }) {
    return ["span", { "data-type": "team-mention", "data-id": node.attrs.id, class: "mention-team" }, `@${node.attrs.label}`];
  },
}).configure({ suggestion: teamMentionSuggestion });
```

Trigger char: `@` con submenu para teams + users.

## Aceptación

- [ ] Escribir `@bac` muestra dropdown con team "Backend".
- [ ] Al seleccionar, inserta `<span data-type="team-mention" data-id="...">@Backend</span>`.
