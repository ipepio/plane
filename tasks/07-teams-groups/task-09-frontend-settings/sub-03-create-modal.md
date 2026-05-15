# Sub-03 — `TeamFormModal`

**Task:** 09 · **Tamaño:** S

## Cambio

Modal con form: `name`, `description`, `logo_props` (picker emoji/color). Reutiliza patrón `useForm` del proyecto.

```tsx
<Modal>
  <form onSubmit={handleSubmit(async (values) => {
    await store.create(workspaceSlug, values);
    close();
  })}>
    <InputText {...register("name", { required: true })} />
    <Textarea {...register("description")} />
    <LogoPicker value={watch("logo_props")} onChange={(v) => setValue("logo_props", v)} />
    <SubmitButton />
  </form>
</Modal>
```

Mensajes de error del backend en `name` (duplicado).

## Aceptación

- [ ] Submit con nombre duplicado muestra error inline.
- [ ] Submit OK cierra modal y aparece team en la lista sin recargar.
