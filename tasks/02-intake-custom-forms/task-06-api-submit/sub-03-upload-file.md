# Sub-03 — Endpoint upload file

**Task:** 06 · **Tamaño:** M

## Cambio

Para campos `file`, el frontend sube el binario y recibe una URL firmada que luego incluye en `value`. Reutilizar el sistema de attachments existente (`apps/api/plane/app/views/file/`):

- `POST /workspaces/<slug>/intakes/<intake_id>/form-uploads/`
- Backend devuelve `{ url: presigned_put_url, asset_url: final_url, asset_id }`.
- Frontend sube binary directo a MinIO con el PUT.
- Submit incluye `asset_url` en `value`.

## Aceptación

- [ ] Subir un PNG → URL firmada → finalize → URL persistida en value.
- [ ] Tamaño máximo configurable (config del field, default 10MB).
