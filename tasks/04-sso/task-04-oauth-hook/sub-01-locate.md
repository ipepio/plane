# Sub-01 — Localizar punto de inserción

**Task:** 04 · **Tamaño:** XS

## Cambio

Identificar en el repo el callback `GoogleOauthCallback*` o `GoogleOAuthCallback` y la línea donde el `user` queda creado/recuperado. Documentar:

```
# apps/api/plane/authentication/views/oauth.py (o equivalente)
# Después de:
user, created = _get_or_create_user(email_data)
# ← AQUÍ insertamos hook SSO
```

## Aceptación

- [ ] PR description identifica archivo y línea base.
