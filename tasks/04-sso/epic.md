# Épica 04 — SSO con Google Workspace

## Objetivo

Permitir que un workspace admin restrinja login a usuarios de **uno o varios dominios de Google Workspace** (p.ej. `goguest.com`). Si el dominio del email coincide y el usuario no es aún miembro, se auto-provisiona en el workspace con un rol por defecto.

## Por qué

Plane CE ya soporta login con Google OAuth, pero no permite restringir por dominio Google Workspace. GoGuest necesita garantizar que solo emails `@goguest.com` (y dominios cliente puntuales) puedan loguear y unirse automáticamente.

## Scope

- Modelo `WorkspaceSSOConfig`: `workspace`, `allowed_domains` (lista), `auto_provision_role`, `enabled`.
- Hook en el callback de Google OAuth existente: validar `hd`/dominio del email antes de crear/loguear usuario.
- Auto-provisión: si el email del Google domain está en la lista, crear `WorkspaceMember` con `auto_provision_role` (default `member`).
- UI en workspace settings → SSO: gestionar dominios, rol por defecto, toggle enabled.
- Permite coexistir con email/password y otros OAuth.

## Fuera de scope

- SAML, OIDC genérico, otros IdPs (Okta, Entra, Authentik) — fase 2.
- SCIM / provisioning automático de bajas — fase 2.
- SSO exclusivo (forzar login únicamente por SSO) — fase 2.
- MFA gestionado por Plane.

## Decisiones de diseño cerradas

- [X] **D1** — Config a nivel **workspace**. Cada workspace decide qué dominios acepta. Permite multi-tenant sin acoplar a config global.
- [X] **D2** — Solo **Google Workspace** en V1. Reutiliza el provider OAuth existente; cualquier otra integración entra en fase 2.
- [X] **D3** — **Coexiste** con email/password y otros OAuth. No se fuerza SSO exclusivo. El admin elige qué métodos permitir desde la UI (toggle separado).
- [X] **D4** — Reutilizar `apps/api/plane/authentication/provider/oauth/google.py` (ya existe). Añadir hook post-callback en lugar de crear un provider nuevo.
- [X] **D5** — Rol auto-provision por defecto: **member** (15). Configurable por workspace. Guest queda como invitación manual.

## Áreas de código afectadas

- `apps/api/plane/db/models/workspace_sso.py` (nuevo)
- `apps/api/plane/db/migrations/`
- `apps/api/plane/authentication/provider/oauth/google.py` (extender callback)
- `apps/api/plane/authentication/utils/sso.py` (nuevo helper)
- `apps/api/plane/app/{serializers,views,urls}/workspace_sso.py` (nuevos)
- `apps/web/app/[workspaceSlug]/settings/sso/` (nueva pantalla)
- `apps/web/core/components/account/sign-in/` (mensaje cuando dominio bloqueado)
- `packages/i18n/src/locales/*/translations.json`

## Criterios de aceptación

- [X] Admin del workspace configura `goguest.com` como dominio permitido.
- [X] Usuario nuevo con email `@goguest.com` loguea con Google → cuenta creada → auto-provisionado como `member` del workspace.
- [X] Usuario con email `@gmail.com` (dominio no permitido) intentando loguear contra un workspace con SSO habilitado recibe error claro.
- [X] Email/password sigue funcionando para invitados.
- [X] Tests del callback con `hd` correcto, incorrecto y ausente.

## Tareas atómicas

1. [task-01 — Modelo WorkspaceSSOConfig](./task-01-model/task.md)
2. [task-02 — Migraciones](./task-02-migrations/task.md)
3. [task-03 — Helper SSO domain check + auto-provision](./task-03-sso-helper/task.md)
4. [task-04 — Hook en Google OAuth callback](./task-04-oauth-hook/task.md)
5. [task-05 — Tests E2E del flujo de login](./task-05-tests/task.md)
6. [task-06 — Serializers](./task-06-serializers/task.md)
7. [task-07 — API CRUD SSO config](./task-07-api/task.md)
8. [task-08 — Frontend types + service](./task-08-frontend-types/task.md)
9. [task-09 — Frontend store](./task-09-frontend-store/task.md)
10. [task-10 — Pantalla settings SSO](./task-10-settings-page/task.md)
11. [task-11 — Mensaje sign-in dominio bloqueado](./task-11-signin-error/task.md)
12. [task-12 — i18n + permisos](./task-12-i18n/task.md)
