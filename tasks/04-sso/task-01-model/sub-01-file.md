# Sub-01 — Crear archivo

**Task:** 01 · **Tamaño:** XS

## Cambio

```python
# apps/api/plane/db/models/workspace_sso.py
import re
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from .base import BaseModel
```

## Aceptación

- [ ] Archivo importa limpio.
