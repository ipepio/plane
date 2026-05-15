# Sub-02 — Entry en dropdown

**Task:** 09 · **Tamaño:** XS

## Cambio

En el dropdown del proyecto (`project-header-actions.tsx` o equivalente):

```tsx
const canManage = useUserPermissions().hasPermission("template.manage");
{canManage && (
  <DropdownItem onClick={() => setSaveAsOpen(true)}>Save as template</DropdownItem>
)}
<SaveAsTemplateModal isOpen={saveAsOpen} onClose={() => setSaveAsOpen(false)} projectId={project.id} />
```

## Aceptación

- [ ] Entry visible solo con permiso.
