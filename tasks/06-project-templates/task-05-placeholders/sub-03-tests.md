# Sub-03 — Tests

**Task:** 05 · **Tamaño:** XS

```python
def test_apply_vars_basic():
    assert apply_vars("Hello {{name}}", {"name": "X"}) == "Hello X"

def test_apply_vars_whitespace():
    assert apply_vars("Hi {{  name  }}!", {"name": "X"}) == "Hi X!"

def test_apply_vars_missing_keeps_token():
    assert apply_vars("{{missing}}", {}) == "{{missing}}"

def test_extract_placeholders_recursive():
    payload = {"project": {"name": "Onboarding {{client}}"},
               "issues": [{"name": "Setup {{client}}"}, {"name": "Kickoff {{owner}}"}]}
    assert extract_placeholders(payload) == {"client", "owner"}
```

## Aceptación

- [ ] 4 tests pasan.
