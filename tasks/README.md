# Tasks — Fork GoGuest de Plane

Plan de trabajo dividido en **épicas**. Cada épica vive en su carpeta con un `epic.md` (objetivo, scope, decisiones de diseño abiertas, criterios de aceptación) y dentro se irán añadiendo las tareas atómicas en archivos `task-NN-*.md`.

## Índice de épicas

| # | Épica | Estado actual en Plane CE |
|---|---|---|
| 01 | [Intake a nivel workspace](01-intake-workspace-level/epic.md) | Existe `Intake` ligado a proyecto — extender |
| 02 | [Formularios personalizados de intake](02-intake-custom-forms/epic.md) | No existe |
| 03 | [Time tracking](03-time-tracking/epic.md) | No existe |
| 04 | [SSO (SAML / OIDC)](04-sso/epic.md) | Solo OAuth Google/GitHub/GitLab/Gitea |
| 05 | [Campos personalizados en issues](05-issue-custom-fields/epic.md) | No existe |
| 06 | [Plantillas de proyecto / clonado de épicas](06-project-templates/epic.md) | No existe |
| 07 | [Teams / grupos de personas](07-teams-groups/epic.md) | Modelo `Team` esquelético, sin miembros |
| 08 | [Roles y permisos personalizables](08-custom-roles/epic.md) | `ROLE_CHOICES` hard-coded |

## Orden sugerido de ejecución

Por dependencias:

1. **08 Custom Roles** — varias épicas (intake, teams, custom fields) chequean roles
2. **07 Teams / grupos** — referenciado por intake-forms (asignar form a un team) y por permisos
3. **01 Intake workspace-level** — base para 02
4. **02 Intake custom forms** — depende de 01 y aprovecha 05
5. **05 Custom fields en issues** — independiente, util para 02 y 06
6. **06 Project templates** — usa 05 si los campos custom forman parte de la plantilla
7. **03 Time tracking** — independiente
8. **04 SSO** — independiente, puede ir en paralelo con cualquier otra

## Convenciones

- Cambios de modelo Django → siempre con migración (`apps/api/plane/db/migrations/`)
- Toda key de UI nueva debe añadirse a **todos** los locales en `packages/i18n/src/locales/*/translations.json` (usar inglés como placeholder si no hay traducción)
- Tests unitarios en `apps/api/plane/tests/` y, cuando aplique, end-to-end del frontend
- Lint/format con OxLint (`pnpm check`) antes de commit
