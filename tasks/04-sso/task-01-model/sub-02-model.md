# Sub-02 — Modelo + validators

**Task:** 01 · **Tamaño:** S

## Cambio

```python
DOMAIN_RE = re.compile(r"^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$")


def _validate_domain(value: str):
    if not DOMAIN_RE.match(value):
        raise ValidationError(f"Invalid domain: {value!r}")


class WorkspaceSSOConfig(BaseModel):
    ROLE_CHOICES = ((5, "Guest"), (15, "Member"), (20, "Admin"))

    workspace = models.OneToOneField(
        "db.Workspace", on_delete=models.CASCADE, related_name="sso_config"
    )
    enabled = models.BooleanField(default=False)
    allowed_domains = ArrayField(
        models.CharField(max_length=255, validators=[_validate_domain]),
        default=list, blank=True,
    )
    auto_provision_role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=15)

    class Meta:
        db_table = "workspace_sso_configs"

    def save(self, *args, **kwargs):
        self.allowed_domains = sorted({d.strip().lower() for d in (self.allowed_domains or []) if d.strip()})
        super().save(*args, **kwargs)

    def domain_allowed(self, email: str) -> bool:
        if not email or "@" not in email:
            return False
        return email.rsplit("@", 1)[1].lower() in (self.allowed_domains or [])
```

## Aceptación

- [ ] Validación de dominios funciona.
- [ ] `save` normaliza y dedup.
- [ ] `domain_allowed("a@goguest.com")` True si `goguest.com` está en lista.
