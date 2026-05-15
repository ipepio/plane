# Task 11 — Keys i18n nuevas

**Épica:** 08 — Custom Roles · **Depende de:** task-10 · **Tamaño:** S

## Contexto

Todos los strings nuevos introducidos en task-09 y task-10 deben pasar por el sistema i18n y existir en todos los locales (inglés como placeholder donde no haya traducción). El proyecto vigila esto activamente (ver `CONTRIBUTING.md` sección "Contributing to language support").

## Diseño

Keys nuevas (todas bajo `roles.*`):

```jsonc
{
  "roles": {
    "title": "Roles",
    "new_role": "New role",
    "system_badge": "System",
    "delete_confirm": "Delete role \"{name}\"?",
    "system_banner": "This is a system role and cannot be modified.",
    "form": {
      "name": "Role name",
      "description": "Description"
    },
    "matrix": {
      "select_all": "Select all",
      "deselect_all": "Deselect all"
    },
    "category": {
      "workspace": "Workspace",
      "project": "Project",
      "issue": "Work item",
      "intake": "Intake",
      "worklog": "Worklog",
      "template": "Template",
      "team": "Team"
    },
    "permissions": {
      "workspace.manage_roles": "Manage roles",
      "workspace.manage_settings": "Manage workspace settings",
      "issue.create": "Create work items",
      "issue.delete_any": "Delete any work item"
      // ... uno por permission code
    }
  }
}
```

## Archivos afectados

- `packages/i18n/src/locales/en/translations.json` (añadir keys)
- `packages/i18n/src/locales/{cs,de,es,fr,id,it,ja,ko,pl,pt-BR,ro,ru,sk,tr-TR,ua,vi-VN,zh-CN,zh-TW}/translations.json` (mismas keys, valor en inglés si no hay traducción aún)
- Componentes de tasks 09 y 10: reemplazar strings hardcoded por `t("roles.*")`

## Aceptación

- [ ] `pnpm --filter @plane/i18n check` pasa (cobertura uniforme entre locales).
- [ ] Cambiar idioma a `es` muestra textos traducidos donde existan.
- [ ] No quedan strings hardcoded en componentes de roles (chequeo manual).

## Sub-tareas atómicas

| # | Sub-tarea | Tamaño |
|---|---|---|
| 01 | [Definir keys en `en/translations.json`](sub-01-en-keys.md) | S |
| 02 | [Replicar en todos los locales](sub-02-replicate-locales.md) | S |
| 03 | [Reemplazar hardcoded en componentes](sub-03-replace-hardcoded.md) | S |
