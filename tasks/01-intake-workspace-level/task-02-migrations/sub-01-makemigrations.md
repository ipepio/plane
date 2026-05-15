# Sub-01 — makemigrations

**Task:** 02 · **Tamaño:** XS

```bash
python manage.py makemigrations db --name add_workspace_intake
```

## Aceptación

- [ ] Migración generada con `CreateModel("WorkspaceIntake", ...)` y `CreateModel("WorkspaceIntakeIssue", ...)`.
- [ ] Constraints (`workspace_intake_unique_name`, `workspace_intake_one_default`) presentes.
