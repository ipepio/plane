# Task 01 — Modelos `IntakeFormField`, `IntakeFormFieldOption`, `IntakeFormFieldValue`

**Épica:** 02 · **Tamaño:** L

## Contexto

Tablas relacionales para definir formularios por intake. Aisladas de épica 05.

## Diseño

- `IntakeFormField`: pertenece a un `WorkspaceIntake` (o `Intake` por proyecto si épica 01 no está).
  - Campos: `label`, `placeholder`, `help_text`, `type`, `config`, `is_required`, `relative_order`, `is_active`.
- `IntakeFormFieldOption`: opciones para select.
- `IntakeFormFieldValue`: respuesta por ticket.
- Polimorfismo: FK opcional a `WorkspaceIntake` y a `Intake` (uno de los dos).

## Tipos soportados

| Tipo | Storage column | Notas |
|---|---|---|
| `short_text` | `value_text` | maxlen config |
| `long_text` | `value_text` | textarea |
| `number` | `value_number` | DecimalField |
| `date` | `value_datetime` | |
| `boolean` | `value_boolean` | checkbox |
| `select` | `value_option_id` | single |
| `multi_select` | tabla aux | |
| `file` | `value_file_url` | path en MinIO (firmado) |
| `user` | `value_user_id` | workspace member |

## Sub-tareas

1. [sub-01 — IntakeFormField model](./sub-01-field.md)
2. [sub-02 — IntakeFormFieldOption model](./sub-02-option.md)
3. [sub-03 — IntakeFormFieldValue model](./sub-03-value.md)
4. [sub-04 — IntakeFormFieldValueOption (multi-select)](./sub-04-value-option.md)
5. [sub-05 — Constraint owner ws_intake xor intake](./sub-05-owner-constraint.md)
