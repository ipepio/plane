# Sub-01 — Parser de `team-mention`

**Task:** 07 · **Tamaño:** S

## Cambio

En el utilidad de procesamiento de comentarios (`apps/api/plane/utils/mentions.py` o equivalente — crear si no existe), parsear el HTML/JSON del comment para extraer:
- IDs de users mencionados.
- IDs de teams mencionados (nodos con `data-type="team-mention"` y `data-id="<uuid>"`).

```python
def extract_mentions(comment_html: str) -> dict:
    soup = BeautifulSoup(comment_html, "html.parser")
    users = [n["data-id"] for n in soup.select('[data-type="user-mention"]')]
    teams = [n["data-id"] for n in soup.select('[data-type="team-mention"]')]
    return {"users": users, "teams": teams}
```

## Aceptación

- [ ] Test unitario con HTML mixto extrae IDs correctamente.
- [ ] Comment sin menciones → `{users: [], teams: []}`.
