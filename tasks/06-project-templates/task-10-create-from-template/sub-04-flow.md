# Sub-04 — Estado loading + redirect

**Task:** 10 · **Tamaño:** S

## Cambio

```tsx
const submit = async () => {
  setBusy(true);
  try {
    let projectId: string;
    if (templateId) {
      const created = await projectTemplateStore.instantiate(workspaceSlug, templateId, name, identifier, vars);
      projectId = created.id;
    } else {
      const created = await projectStore.create(workspaceSlug, { name, identifier, ... });
      projectId = created.id;
    }
    router.push(`/${workspaceSlug}/projects/${projectId}/issues`);
  } catch (e) {
    toast.error("Failed to create project");
  } finally { setBusy(false); }
};
```

## Aceptación

- [ ] Loading state visible durante instancia.
- [ ] Redirect al nuevo proyecto.
