# Sub-03 — Redirect con error en bloqueo

**Task:** 04 · **Tamaño:** XS

## Cambio

```python
def _redirect_with_error(request, *, code: str, workspace: str = ""):
    from django.shortcuts import redirect
    from urllib.parse import urlencode
    base = settings.WEB_URL or "/"
    qs = urlencode({"error": code, "ws": workspace})
    return redirect(f"{base}?{qs}")
```

Frontend (task-11) lee `?error=sso_blocked&ws=...` y muestra mensaje.

## Aceptación

- [ ] Redirect 302 con query string.
