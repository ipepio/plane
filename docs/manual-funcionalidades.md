# Manual de funcionalidades — GoGuest Plane

Guía práctica de las funcionalidades implementadas en la plataforma.

---

## 1. Abrir tickets sin pertenecer al proyecto (Intake / Buzón)

Plane dispone de dos niveles de Intake: uno de **workspace** (global) y otro por **proyecto**.

### Intake de workspace (recomendado para usuarios externos)

Cualquier persona con acceso a la URL del workspace puede enviar una solicitud **sin necesidad de ser miembro de ningún proyecto**.

1. Ir a la sección **Workspace Intake** en el menú lateral izquierdo.
2. Hacer clic en **Nueva solicitud**.
3. Rellenar el formulario (título, descripción, adjuntos, etc.).
4. Opcionalmente, seleccionar el proyecto de destino si se conoce.
5. Enviar. La solicitud queda en estado pendiente hasta que un administrador la acepte o rechace.

> **Aceptar / Rechazar (rol Admin o Member):** Desde Workspace Intake, cada tarjeta tiene los botones *Aceptar* (convierte la solicitud en issue dentro del proyecto indicado) y *Rechazar* (archiva la solicitud con un motivo opcional).

### Intake de proyecto

Para un proyecto concreto, la sección **Intake** dentro del proyecto permite recibir sugerencias de miembros del workspace que no tienen acceso directo al backlog.

---

## 2. Personalizar formularios de solicitudes (Intake)

Los formularios de Intake son configurables por proyecto y por el formulario de workspace.

### Acceso a la configuración

- **Proyecto:** `Configuración del proyecto → Intake → Campos del formulario`
- **Workspace Intake:** `Workspace Intake → ⚙ Configuración → Campos`

### Tipos de campo disponibles

| Tipo | Descripción |
|------|-------------|
| `short_text` | Texto corto (una línea) |
| `long_text` | Texto largo (párrafo) |
| `number` | Valor numérico |
| `date` | Selector de fecha |
| `boolean` | Sí / No |
| `select` | Lista de opciones (una selección) |
| `multi_select` | Lista de opciones (varias selecciones) |
| `file` | Adjunto de archivo |
| `user` | Selector de usuario del workspace |

### Gestión de campos

1. Hacer clic en **Añadir campo**.
2. Elegir el tipo y rellenar nombre, descripción y si es obligatorio.
3. Para `select` / `multi_select`, añadir las opciones disponibles.
4. Usar el toggle **Activo / Inactivo** para mostrar u ocultar el campo sin eliminarlo.
5. Arrastrar las filas para reordenar los campos en el formulario.

> Los campos inactivos se conservan con sus datos históricos pero no aparecen en nuevos envíos.

---

## 3. Time Tracking (Imputación de tiempos)

### Dónde está

**Time Tracking** aparece en el menú lateral del workspace (sección *Workspace*), junto a Analytics y Archives. Requiere rol **Admin** o **Member** a nivel de workspace.

### Imputar tiempo en una issue

1. Abrir cualquier issue.
2. En el panel derecho o en la sección de actividad, hacer clic en **Log time**.
3. Indicar: fecha de inicio, duración y si es facturable (*billable*).
4. Guardar. El tiempo aparece en el historial de la issue.

### Consultar tiempos imputados

1. Ir a **Time Tracking** en el menú lateral.
2. Ajustar el rango de fechas (**From / To**).
3. Aplicar filtros opcionales:
   - **Group by → User**: ver el total por miembro.
   - **Group by → Project**: ver el total por proyecto.
   - **Group by → Day / Week / Month**: análisis temporal.
   - **Billable**: filtrar solo las horas facturables o no facturables.
   - **Project ID / User ID**: filtrar por un proyecto o usuario concreto.
4. Sin agrupación, la tabla muestra cada entrada individual con fecha, usuario, proyecto, issue, duración y estado de facturación.
5. Hacer clic en **Export CSV** para descargar el informe filtrado.

---

## 4. Acceso con SSO

### Configuración (requiere rol Admin de workspace)

1. Ir a `Configuración del workspace → SSO`.
2. Activar el toggle **Habilitar SSO**.
3. Añadir los **dominios permitidos** (p. ej. `goguest.com`). Solo los correos de esos dominios podrán autenticarse por esta vía.
4. Seleccionar el **rol por defecto** que se asignará automáticamente a los nuevos usuarios que se registren vía SSO (`Guest`, `Member` o `Admin`).
5. Guardar. A partir de ese momento, los usuarios con email de los dominios configurados verán la opción de acceso SSO en la pantalla de login.

> El proveedor de identidad (IdP) se configura en el servidor. Consultar la documentación de infraestructura para la configuración de SAML/OIDC a nivel de backend.

---

## 5. Campos personalizados dentro de las issues

Los campos personalizados están vinculados a los **Tipos de issue** (*Issue Types*). Cada tipo puede tener su propio conjunto de propiedades adicionales.

### Crear un tipo de issue con campos personalizados

1. Ir a `Configuración del proyecto → Issue Types`.
2. Crear un nuevo tipo (p. ej. *Bug*, *Mejora*, *Tarea de onboarding*) o editar uno existente.
3. Dentro del tipo, hacer clic en **Añadir propiedad**.
4. Configurar cada propiedad: nombre, tipo de dato, si es obligatoria, y valor por defecto.

### Usar los campos en una issue

1. Al crear o editar una issue, seleccionar el **Tipo de issue** correspondiente.
2. Aparecerá la sección **Propiedades adicionales** con los campos definidos para ese tipo.
3. Rellenar los valores. Se guardan junto con la issue y son visibles en el detalle y en las vistas filtradas.

---

## 6. Clonar proyectos / tareas épicas como plantilla de onboarding

### Plantillas de proyecto

Al crear un proyecto nuevo:

1. Hacer clic en **Nuevo proyecto**.
2. En el formulario de creación, aparece el selector **Plantilla**.
3. Seleccionar una plantilla existente. El proyecto se creará con la estructura predefinida (estados, etiquetas, épicas y tareas base).

### Crear una plantilla propia

Para guardar un proyecto actual como plantilla:

1. Ir a `Configuración del proyecto → General`.
2. Usar la opción **Guardar como plantilla** (si está habilitada para tu plan).
3. La plantilla quedará disponible para futuros proyectos.

### Duplicar épicas y tareas manualmente

Si necesitas replicar un conjunto de épicas / issues para un nuevo cliente:

1. Abrir la épica o issue que quieres duplicar.
2. Usar el menú **⋯ → Duplicar** en el detalle de la issue.
3. Ajustar el título, proyecto de destino y asignados en el modal de duplicado.
4. Para duplicar en masa: seleccionar varias issues en la vista de lista usando los checkboxes, luego **Acciones → Duplicar selección**.

> **Recomendación para onboarding de clientes:** Crear un proyecto "Plantilla Onboarding" con todas las épicas, issues y estados configurados. Para cada cliente nuevo, crear un proyecto desde esa plantilla o duplicar las épicas al nuevo proyecto.

---

## 7. Equipos y grupos de personas

### Crear un equipo

1. Ir a `Configuración del workspace → Teams`.
2. Hacer clic en **Nuevo equipo**.
3. Asignar nombre y descripción.
4. Añadir miembros del workspace al equipo.
5. Guardar.

### Usar equipos

- Los equipos pueden asignarse a issues como campo de *equipo responsable*.
- Permiten filtrar y agrupar issues por equipo en cualquier vista.
- Desde la vista del equipo, se puede ver el trabajo activo de todos sus miembros.

### Gestión de equipos

- **Editar:** Desde `Configuración → Teams`, hacer clic en el equipo y modificar nombre, descripción o miembros.
- **Eliminar:** El equipo se elimina pero las issues que tenían ese equipo asignado conservan el historial de actividad.

---

## 8. Roles y permisos

### Niveles de permisos

Plane tiene dos niveles:

| Nivel | Descripción |
|-------|-------------|
| **Workspace** | Controla el acceso global al workspace |
| **Proyecto** | Controla el acceso a cada proyecto individual |

### Roles de workspace

| Rol | Capacidades principales |
|-----|------------------------|
| **Admin** | Acceso completo, configuración del workspace, SSO, facturación |
| **Member** | Crear y gestionar proyectos, ver informes, imputar tiempo |
| **Guest** | Solo lectura en proyectos a los que ha sido invitado |

### Gestionar roles personalizados

1. Ir a `Configuración del workspace → Roles`.
2. Hacer clic en **Nuevo rol**.
3. Asignar un nombre y seleccionar los permisos que incluye.
4. Guardar. El rol estará disponible para asignarlo a miembros del workspace.

### Roles a nivel de proyecto

1. Ir al proyecto → `Configuración → Miembros`.
2. Para cada miembro, hacer clic en su rol actual y seleccionar el nuevo rol del desplegable:
   - **Admin**: gestión completa del proyecto, incluyendo configuración y automatizaciones.
   - **Member**: crear, editar y cerrar issues.
   - **Viewer**: solo lectura.
   - **Guest**: acceso muy limitado, solo puede ver lo que se le comparte.

---

## 9. Automatizaciones

Las automatizaciones están disponibles a nivel de **proyecto** (no de workspace).

### Acceder a las automatizaciones

`Configuración del proyecto → Automatizaciones`

Requiere rol **Admin** dentro del proyecto.

### Automatizaciones disponibles

#### Auto-archivar issues

Archiva automáticamente las issues cerradas después de un período de inactividad.

1. Activar el toggle **Auto-archivar**.
2. Seleccionar el período de inactividad (p. ej. 30 días).
3. Guardar. Las issues cerradas sin actividad durante ese período pasarán a estado *Archivado* automáticamente.

#### Auto-cerrar issues

Cierra automáticamente las issues que llevan cierto tiempo sin actividad.

1. Activar el toggle **Auto-cerrar**.
2. Seleccionar el período de inactividad.
3. Elegir el estado de *Cerrado* que se aplicará (si hay varios estados de tipo "Done").
4. Guardar.

#### Automatizaciones personalizadas

La plataforma incluye soporte para automatizaciones personalizadas adicionales (disponibles según el plan). Estas pueden configurarse en la misma sección de `Automatizaciones` y permiten definir:

- **Disparador:** evento que activa la automatización (cambio de estado, asignación, nueva issue, etc.)
- **Condiciones:** filtros opcionales para que solo aplique a ciertos issues.
- **Acción:** qué ocurre (cambiar estado, asignar miembro, añadir etiqueta, enviar notificación, etc.)

> A diferencia de Jira Automation, las reglas son más directas y no admiten lógica compleja de ramificación condicional, pero cubren los flujos de trabajo más habituales.

---

## Resumen de rutas

| Funcionalidad | Ruta en la app |
|---------------|---------------|
| Intake (workspace) | `/<workspace>/workspace-intake` |
| Time Tracking | `/<workspace>/time-tracking` |
| SSO | `/<workspace>/settings/sso` |
| Equipos | `/<workspace>/settings/teams` |
| Roles y permisos | `/<workspace>/settings/roles` |
| Miembros del workspace | `/<workspace>/settings/members` |
| Automatizaciones | `/<workspace>/settings/projects/<projectId>/automations` |
| Issue Types / Campos | `/<workspace>/settings/projects/<projectId>/features` |
| Plantillas de proyecto | Disponible en el modal de creación de proyecto |
