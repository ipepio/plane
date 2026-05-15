# Sub-01 — apply_vars

**Task:** 05 · **Tamaño:** XS

## Cambio

```python
# apps/api/plane/utils/project_template/placeholders.py
import re

_PATTERN = re.compile(r"\{\{\s*([\w.\-]+)\s*\}\}")


def apply_vars(text: str | None, vars: dict[str, str]) -> str:
    if not text:
        return text or ""

    def _sub(m):
        key = m.group(1)
        return str(vars[key]) if key in vars else m.group(0)

    return _PATTERN.sub(_sub, text)
```

## Aceptación

- [ ] Sustituye con whitespace tolerante.
- [ ] No sustituye vars ausentes.
