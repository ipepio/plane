# Sub-02 — Drawer detalle

**Task:** 11 · **Tamaño:** M

## Cambio

Drawer lateral con:
- Header: name, status badge, priority.
- Body: description_html renderizado.
- Sidebar: submitter, dates, decision_note (si rejected), accepted_issue link (si accepted).
- Footer: botones Accept / Reject / Snooze / Mark duplicate (solo si pending y user tiene permiso).

## Aceptación

- [ ] Link a accepted_issue abre el issue del proyecto.
- [ ] Botones ocultos para Pending tickets si user no tiene permiso.
