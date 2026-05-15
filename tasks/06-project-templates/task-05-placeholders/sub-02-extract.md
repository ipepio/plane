# Sub-02 — extract_placeholders

**Task:** 05 · **Tamaño:** XS

## Cambio

```python
def extract_placeholders_from_string(text: str) -> set[str]:
    return set(_PATTERN.findall(text or ""))


def extract_placeholders(payload: dict) -> set[str]:
    found: set[str] = set()

    def walk(node):
        if isinstance(node, str):
            found.update(extract_placeholders_from_string(node))
        elif isinstance(node, dict):
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(payload)
    return found
```

## Aceptación

- [ ] Devuelve set ordenable.
- [ ] Recursión por todo el payload.
