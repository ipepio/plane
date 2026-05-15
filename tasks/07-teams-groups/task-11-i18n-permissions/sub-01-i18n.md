# Sub-01 — Keys i18n

**Task:** 11 · **Tamaño:** XS

## Cambio

Añadir a `packages/i18n/src/locales/en/translations.json`:

```json
{
  "teams": {
    "title": "Teams",
    "new_team": "New team",
    "name_label": "Team name",
    "description_label": "Description",
    "members": "Members",
    "add_members": "Add members",
    "remove_member": "Remove member",
    "role": { "lead": "Lead", "member": "Member" },
    "errors": { "name_taken": "A team with this name already exists." }
  }
}
```

Correr script `sync-keys.ts` para propagar a otros locales con marker `[TODO]`.

## Aceptación

- [ ] Todas las locales contienen las keys (vacías o `[TODO]`).
- [ ] No hay strings hardcodeadas en componentes nuevos.
