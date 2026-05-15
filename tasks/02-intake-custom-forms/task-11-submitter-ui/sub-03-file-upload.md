# Sub-03 — Upload file con progress

**Task:** 11 · **Tamaño:** S

## Cambio

`FileUploadInput`:
- Click → file picker.
- Al elegir, llama `intakeFormService.uploadFile` → recibe asset_url.
- Muestra barra de progreso durante el PUT.
- Resultado: `onChange(asset_url)`.

Validar tamaño y mime contra `config.max_size_mb` / `config.accept` antes de subir.

## Aceptación

- [ ] Archivo > max_size → error sin subir.
- [ ] Mime distinto al accept → error sin subir.
- [ ] Upload exitoso muestra preview/link.
