# Sub-03 — Reemplazar strings hardcoded en componentes

**Task:** 11 · **Tamaño:** S

## Cambio

Sustituir los strings literales en los componentes de tasks 09 y 10 por llamadas `t("roles.*")`.

## Cómo

Archivos a tocar:
- `apps/web/core/components/roles/roles-list.tsx`
- `apps/web/core/components/roles/create-role-modal.tsx`
- `apps/web/core/components/roles/role-editor.tsx`
- `apps/web/core/components/roles/permission-matrix.tsx`
- `apps/web/app/[workspaceSlug]/settings/roles/page.tsx`

Patrón:

```tsx
import { useTranslation } from "@plane/i18n";

const { t } = useTranslation();
// ...
<h1>{t("roles.title")}</h1>
<button>{t("roles.new_role")}</button>
```

Para el componente de la matriz:

```tsx
{p.name}  →  {t(`roles.permissions.${p.code}`, { defaultValue: p.name })}
```

## Aceptación

- [ ] Grep `"Roles"|"New role"|"Select all"` en `apps/web/core/components/roles/` → 0 resultados (todo via `t()`).
- [ ] Cambiar a `es` y verificar que las strings aparecen traducidas (las que estén en `es/translations.json`).
- [ ] Las que no estén traducidas siguen apareciendo en inglés (no rotas).
