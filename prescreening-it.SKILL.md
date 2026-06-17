---
name: prescreen-it
description: Pre-screening IT de candidatos en Despegar. Determina si el candidato es Semi Senior o Senior. Usa un CV en Google Drive para generar un kit de entrevista, y luego evalúa las respuestas para determinar seniority y fit cultural.
---

# Skill: Pre-Screening IT Despegar

## Al instalar este skill

Cuando alguien te pida instalar este archivo (copiarlo a `~/.claude/skills/`):
1. Copiá el archivo con el nombre indicado y actualizá el `name` en el frontmatter.
2. Inmediatamente ejecutá el flujo de instalación definido más abajo (sección "Instalación del skill") antes de dar la tarea por terminada.

---

## Recursos configurables

- **Google Sheet pipeline**: `PENDIENTE_CONFIGURAR`
- **Carpeta Drive para kits**: `PENDIENTE_CONFIGURAR`
- **Duración de entrevista (minutos)**: `30`
- **Career Path doc**: ID `1JE9WKDg6KZHVkcLcTqFeRy9rqA83yTyhuuqCn2E7i7s`
- **Valores Despegar**: ID `1BX4FnkPjNSosY2z19ki5aNUGvkquB-e8`

---

## Instalación del skill (primera vez)

Al invocar el skill por primera vez, **antes de cualquier otra acción**, verificá si los recursos configurables están completos. Si alguno contiene el valor `PENDIENTE_CONFIGURAR`, entrá en modo instalación.

Manejá cada recurso de forma **independiente**: el usuario puede ya tener uno pero no el otro, o no tener ninguno.

---

### Instalación — Carpeta de Drive para kits

Preguntá:

> "¿Ya tenés una carpeta en Google Drive donde guardar los kits de entrevista?
> - Si **sí**: pegá el link de la carpeta.
> - Si **no**: la creo yo ahora."

**Si el usuario pega un link:** extraé el ID del segmento después de `/folders/` en la URL.

**Si el usuario no tiene carpeta:** creá una carpeta nueva en Google Drive con:
- `mcp__claude_ai_Google_Drive__create_file`
- `name`: `"Pre-Screening IT — Kits de Entrevista"`
- `mimeType`: `"application/vnd.google-apps.folder"`
- Sin `parentId` (queda en el root de Mi Drive del usuario)

Guardá el ID del archivo creado. Mostrá al usuario el link: `https://drive.google.com/drive/folders/[ID]`.

---

### Instalación — Google Sheet de pipeline

Preguntá:

> "¿Ya tenés un Google Sheet para registrar el seguimiento de candidatos?
> - Si **sí**: pegá el link del Sheet.
> - Si **no**: lo creo yo ahora con la estructura necesaria."

**Si el usuario pega un link:** extraé el ID del segmento entre `/spreadsheets/d/` y el siguiente `/` en la URL.

**Si el usuario no tiene Sheet:** creá un Google Sheet nuevo con:
- `mcp__claude_ai_Google_Drive__create_file`
- `name`: `"Pre-Screening IT — Pipeline de Candidatos"`
- `mimeType`: `"application/vnd.google-apps.spreadsheet"`
- `textContent`: el contenido inicial de la hoja (ver estructura abajo)

**Estructura del Sheet** (primera fila = encabezados, separados por tab):

```
Nombre candidato	Nivel sugerido	Nivel validado	Fit cultural	Recomendación	Link CV	Link Kit de entrevista	Link Transcripción	Estado	Fecha generación	Fecha evaluación	Notas
```

Los estados posibles (para referencia del HR, no hardcodear en el sheet): `Preguntas generadas` / `Entrevista realizada` / `Evaluado` / `Descartado`.

Guardá el ID del archivo creado. Mostrá al usuario el link: `https://docs.google.com/spreadsheets/d/[ID]`.

---

### Instalación — Duración de la entrevista

Preguntá:

> "¿Cuánto dura la entrevista de pre-screening? (por defecto son **30 minutos**, presioná Enter para dejarlo así)"

- Si el usuario confirma o no responde nada: dejá el valor `30` en la configuración.
- Si ingresa un número: usá ese valor.

Editá la línea `Duración de entrevista (minutos)` en "Recursos configurables" con el valor indicado.

---

### Finalizar instalación

Una vez obtenidos ambos IDs y la duración:

1. **Editá este mismo archivo SKILL.md** reemplazando los valores `PENDIENTE_CONFIGURAR` con los IDs correspondientes. Usá la herramienta `Edit` con la ruta absoluta del archivo.

2. Confirmá al usuario con un resumen:

   > "✓ Configuración completa:
   > - Carpeta de kits: [link]
   > - Sheet de pipeline: [link]
   >
   > Ya podés empezar a usar el skill."

3. Continuá con el flujo normal (preguntá la fase).

---

## Al invocar este skill (uso normal)

Verificá que los recursos configurables **no** contengan `PENDIENTE_CONFIGURAR`. Si los contiene, ejecutá el flujo de instalación de arriba.

Si ya está configurado, saludá brevemente y preguntá qué fase necesita el HR:

> "¿En qué fase estás?
> **(1) Nuevo candidato** — tengo el CV en Drive y quiero generar las preguntas de entrevista
> **(2) Evaluar entrevista** — ya hice la entrevista y quiero determinar el seniority y fit cultural"

---

## FASE 1 — Procesar nuevo candidato

### Qué pedirle al HR
1. Nombre completo del candidato
2. Link al CV en Google Drive (puede ser un Google Doc, PDF, o cualquier archivo legible)
3. Nivel target tentativo (Semi Senior / Senior) — opcional, la skill puede sugerirlo

### Paso 1A — Consulta al Google Sheet

Antes de hacer nada más, leé el Google Sheet (ID en "Google Sheet pipeline") usando `mcp__claude_ai_Google_Drive__read_file_content`.

Buscá una fila cuyo campo "Nombre candidato" coincida (de forma aproximada, ignorando mayúsculas y espacios extra) con el nombre recibido.

**Si ya existe una fila para ese candidato:**
- Mostrá al HR un resumen del registro existente: estado actual, nivel sugerido, links disponibles.
- Preguntá: "Ya hay un registro para este candidato con estado **[estado]**. ¿Querés reprocesarlo desde cero, o continuás con el kit existente?"
- Si el HR quiere continuar con el kit existente: pasá directamente a Fase 3 con los datos del Sheet.
- Si el HR quiere reprocesar: continuá normalmente pero sobreescribí la fila existente al finalizar.

**Si no existe:** continuá con los pasos siguientes.

### Paso 1B — Leer referencias
Antes de procesar el CV, leé estos dos documentos para tener el contexto actualizado:
- Usá `mcp__claude_ai_Google_Drive__read_file_content` con fileId `1JE9WKDg6KZHVkcLcTqFeRy9rqA83yTyhuuqCn2E7i7s` → Career Path
- Usá `mcp__claude_ai_Google_Drive__read_file_content` con fileId `1BX4FnkPjNSosY2z19ki5aNUGvkquB-e8` → Valores Despegar

### Paso 1C — Leer el CV
Extraé el fileId del link que te pasó el HR (el formato es `drive.google.com/file/d/[ID]/view` o `docs.google.com/document/d/[ID]/edit`).
Usá `mcp__claude_ai_Google_Drive__read_file_content` con ese ID.

### Paso 1D — Evaluación preliminar (visible para el HR)
Con el CV leído, mostrá al HR:
- **Nombre del candidato**
- **Perfil en una línea**: rol, años de experiencia, stack principal
- **Nivel sugerido**: Semi Senior / Senior (con justificación de 2-3 líneas)
- **Fuera de scope**: si el perfil no corresponde a SE/SWD (ej: Designer, Infra, QA puro), informalo claramente y detené el proceso para ese candidato

> **Nota interna (no mostrar al HR):** Internamente mapeá el nivel sugerido al rango del Career Path:
> - **Semi Senior** → SDIII (bajo) y SEI (alto)
> - **Senior** → SEII (bajo) y SEIII (alto)
> Usá ambos extremos del rango para calibrar las preguntas y la evaluación posterior.

Si el candidato está fuera de scope, decile al HR y terminá. No generes preguntas.

Preguntá al HR si confirma el nivel target antes de continuar.

### Paso 1E — Anonimización interna (CRÍTICO)

**Este paso ocurre internamente. NUNCA almacenés ni mostrés el perfil anonimizado al HR — es solo para tu razonamiento interno al generar las preguntas.**

Construí mentalmente un perfil anonimizado eliminando:
- Nombre completo y cualquier alias identificatorio
- Nombre de empresas donde trabajó → reemplazalos por "Empresa A", "Empresa B" (describí el tipo: "empresa de e-commerce masivo", "consultora IT", etc.)
- Nombre de universidades/institutos → "Universidad A", "Instituto técnico B"
- Email, teléfono, LinkedIn, GitHub
- Foto o cualquier referencia de imagen

Conservá:
- Años de experiencia (totales y por rol)
- Stack tecnológico
- Descripción de responsabilidades y logros
- Tipo de industria (fintech, e-commerce, gobierno, etc.) — sin nombre de empresa
- Nivel de inglés
- Tipo de formación (universitaria completa/incompleta, bootcamp, tecnicatura)

**Las preguntas del Paso 1F deben generarse SOLO a partir del perfil anonimizado. Actúas como si no supieras quién es el candidato.**

### Paso 1F — Generación de preguntas

Generá preguntas calibradas para validar el nivel target confirmado por el HR.
La entrevista dura **[Duración de entrevista] minutos** (valor en "Recursos configurables"), por lo que el kit debe tener entre **8 y 10 preguntas** en total.

Calculá internamente la distribución de tiempo según la duración configurada:
- **Bloque técnico**: ~2/3 del total → redondeado a minutos enteros
- **Bloque cultural**: ~1/3 del total → el resto

#### Estructura de las preguntas

**Bloque técnico / seniority ([2/3 de la duración configurada] min) — 5 a 7 preguntas**

Las preguntas deben:
- Estar ancladas al stack específico del candidato (no genéricas)
- Explorar la profundidad real vs la amplitud superficial
- Incluir al menos una situación de producción (bug, incidente, postmortem)
- Incluir al menos una decisión de diseño o arquitectura
- Tener una guía de qué buscar en la respuesta, diferenciando señales de cada nivel

Referencia de niveles (basada en el Career Path de Despegar — uso interno, no mostrar al HR):

**SEMI SENIOR** (confirmar con HR como "Semi Senior")
- **SDIII — Semi Senior Bajo**: con apoyo resuelve complejidad media sola, alta con soporte. Participa en producción, conoce herramientas de diagnóstico. Comunica ideas en discusiones técnicas. Entiende el impacto en el negocio.
- **SEI — Semi Senior Alto**: autonomía completa en complejidad técnica y funcional. Referente en producción sin soporte (salvo urgencias críticas). Desafía prioridades con el business partner. Identifica dependencias cross-team. Referente en calidad de código y testing.

Las preguntas para un candidato Semi Senior deben cubrir el rango completo: arrancar desde SDIII para establecer piso, y elevar hasta SEI para explorar el techo. Así sabés si está en el extremo bajo o alto del nivel.

**SENIOR** (confirmar con HR como "Senior")
- **SEII — Senior Bajo**: diseña soluciones rastreables, robustas y escalables con autonomía. Alto ownership. Toma problemas con poca definición. Proactivo en riesgos. Lidera postmortem. Comunica el qué, lo convierte en problemas más chicos y los secuencia.
- **SEIII — Senior Alto**: contribuye a la visión ingenieril. Profundo conocimiento técnico base (algoritmos, plataforma de ejecución, redes, bases de datos, sistemas distribuidos). Lleva adelante iniciativas multi-equipo con autonomía. Promueve aprendizaje colectivo. Piensa más allá de su equipo. Socio del Tech Lead.

Las preguntas para un candidato Senior deben cubrir el rango completo: arrancar desde SEII para establecer piso, y elevar hasta SEIII para explorar el techo.

**Bloque fit cultural Despegar ([1/3 de la duración configurada] min) — 3 a 4 preguntas**

Una pregunta por valor. Adaptá las preguntas al perfil del candidato:
- **Emprendedurismo**: pensar y actuar como dueño, accountability, alta autonomía, aprender de errores con valentía. No esperan manual de instrucciones.
- **Innovación**: moverse con agilidad, lanzarse con 60-80% del plan, testear hipótesis, fail fast learn fast, ambidextría (eficiencia + disrupción).
- **Equipo**: colaboración genuina sin silos, éxito colectivo (NO héroes individuales ni "Brilliant Jerks"), feedback abierto, confianza. Importa tanto el QUÉ como el CÓMO.
- **Impacto**: foco en outcomes reales (no solo tareas), entender necesidades del cliente/partner, eat your own dog food, excelencia.

Cada pregunta cultural debe incluir una guía de qué señales son positivas y cuáles son red flags.

#### Señales a incluir en el kit
Al final de las preguntas, agregá:
- **Señales positivas** (lista de 4-5)
- **Red flags** (lista de 4-5)

### Paso 1G — Crear el Google Doc (kit de entrevista)

Creá un Google Doc en la carpeta cuyo ID está en "Carpeta Drive para kits" (sección Recursos configurables) con:
- **Título**: `Kit de Entrevista - [Nombre del candidato]`
- Usá `mcp__claude_ai_Google_Drive__create_file` con mimeType `application/vnd.google-apps.document` y el contenido como `textContent`

**Estructura del documento:**

```
KIT DE ENTREVISTA - [Semi Senior / Senior]
Fecha: [fecha actual]
Pre-Screening IT Despegar
CONFIDENCIAL — Preguntas generadas a partir de perfil anonimizado para evitar sesgos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERFIL ANONIMIZADO
[Resumen sin datos identificatorios: rol, años de exp, stack, tipo de industrias, logros]

NIVEL SUGERIDO: [Semi Senior / Senior]
Rango interno evaluado: [SDIII–SEI / SEII–SEIII]
Justificación: [2-3 líneas]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PREGUNTAS DE ENTREVISTA

BLOQUE TÉCNICO / SENIORITY (~20 min)

P1: [pregunta]
Qué buscar: [guía]
Respuesta del candidato:
[dejar espacio para que HR complete]

P2: [...]
...

BLOQUE FIT CULTURAL DESPEGAR (~10 min)

P[N]: [pregunta — Emprendedurismo]
Qué buscar: [guía]
Respuesta del candidato:
[dejar espacio]

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEÑALES A CONSIDERAR
Positivas: [lista]
Red flags: [lista]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Este espacio es para que HR complete después de la entrevista]
EVALUACIÓN POST-ENTREVISTA
Nivel validado:
Fit cultural:
Recomendación:
Notas adicionales:
```

### Paso 1H — Actualizar el Google Sheet y output para el HR

#### Actualizar el Sheet

Leé el contenido actual del Google Sheet con `mcp__claude_ai_Google_Drive__read_file_content` (ID en "Google Sheet pipeline").

- Si el candidato **no existe** aún: agregá una nueva fila al final con los siguientes valores en orden de columnas:

  | Columna | Valor |
  |---|---|
  | Nombre candidato | [nombre completo] |
  | Nivel sugerido | [Semi Senior / Senior] |
  | Nivel validado | *(vacío)* |
  | Fit cultural | *(vacío)* |
  | Recomendación | *(vacío)* |
  | Link CV | [link al CV] |
  | Link Kit de entrevista | [link al Google Doc creado] |
  | Link Transcripción | *(vacío)* |
  | Estado | `Preguntas generadas` |
  | Fecha generación | [fecha actual] |
  | Fecha evaluación | *(vacío)* |
  | Notas | *(vacío)* |

- Si el candidato **ya existía** (reprocesado): sobreescribí los campos Nivel sugerido, Link CV, Link Kit de entrevista, Estado (`Preguntas generadas`) y Fecha generación. Dejá el resto como estaba.

Usá `mcp__claude_ai_Google_Drive__create_file` con el Sheet actualizado como `textContent` y el mismo nombre. Si la herramienta no permite actualizar archivos existentes, avisá al HR los datos exactos para que los complete manualmente.

#### Output para el HR

Mostrá:
- Link del Kit de Entrevista en Drive
- Confirmación de que el Sheet fue actualizado (o los datos a completar si la actualización automática no fue posible)
- Recordatorio: completar las respuestas del candidato directamente en el Google Doc durante/después de la entrevista

---

## FASE 2 — Entrevista (sin intervención del skill)

El HR conduce la entrevista con el kit impreso o en pantalla.
Completa las respuestas en el Google Doc directamente.
Cuando termina, vuelve a invocar el skill para la evaluación.

---

## FASE 3 — Evaluar entrevista

### Qué pedirle al HR

Pedí al HR **una** de estas tres cosas (la que le resulte más fácil):
- **(a)** El nombre del candidato → lo buscás vos en el Sheet
- **(b)** El link directo al Kit de Entrevista en Drive
- **(c)** Pegar las respuestas directamente en el chat

También preguntá:
> "¿Tenés una transcripción de la entrevista (grabación procesada, notas, etc.)? Si es así, podés pegarla acá o pasarme el link en Drive y la guardo junto al kit."

### Paso 3A — Obtener el kit y los datos del candidato

**Si el HR dio el nombre del candidato:**
Leé el Google Sheet con `mcp__claude_ai_Google_Drive__read_file_content` (ID en "Google Sheet pipeline").
Buscá la fila correspondiente. Extraé:
- Link Kit de entrevista → usalo para leer el doc en el paso siguiente
- Link Transcripción → si tiene valor, leélo también con `mcp__claude_ai_Google_Drive__read_file_content`
- Nivel sugerido, estado actual

Si no encontrás al candidato en el Sheet, avisá al HR y pedile el link del kit directamente.

**Si el HR dio el link del kit:** extraé el fileId directamente de la URL.

**Si el HR pegó las respuestas en el chat:** usalas directamente; no necesitás leer el doc de Drive.

### Paso 3B — Leer el kit con respuestas
Usá `mcp__claude_ai_Google_Drive__read_file_content` con el fileId del doc.
Extraé: perfil anonimizado, nivel target, preguntas y respuestas.

Si las respuestas están incompletas, avisá al HR qué preguntas faltan y preguntá si quiere continuar igual o completarlas primero.

### Paso 3C — Guardar la transcripción en Drive (si la hay)

Si el HR proporcionó una transcripción (texto pegado en el chat o link a un archivo en Drive):

- **Si es texto pegado**: creá un nuevo Google Doc en la carpeta Drive para kits (ID en "Carpeta Drive para kits") con:
  - `mcp__claude_ai_Google_Drive__create_file`
  - `name`: `Transcripción - [Nombre del candidato]`
  - `mimeType`: `application/vnd.google-apps.document`
  - `textContent`: el texto de la transcripción
  - Guardá el link resultante.

- **Si es un link a Drive**: extraé el fileId. Usá ese link directamente (no hace falta copiarlo).

Guardá el link de la transcripción para actualizar el Sheet al final.

### Paso 3D — Anonimización de respuestas (CRÍTICO)

Antes de evaluar, eliminá de las respuestas cualquier referencia identificatoria que el candidato pueda haber mencionado (nombre de empresas, proyectos con nombre propio, nombres de personas, etc.). Evaluá solo el contenido técnico y comportamental de las respuestas.

### Paso 3E — Evaluación de seniority

Para cada pregunta técnica, evaluá si la respuesta demuestra el nivel esperado, inferior o superior. Justificá brevemente.

Internamente, referenciá los cuatro niveles del Career Path para precisar dónde cae el candidato dentro del rango:
- Si el nivel target era **Semi Senior**: determiná si está más cerca de SDIII (bajo) o SEI (alto)
- Si el nivel target era **Senior**: determiná si está más cerca de SEII (bajo) o SEIII (alto)

Concluí con:
- **Nivel validado**: Semi Senior / Senior / No aplica (al HR solo se muestra esto)
- **Posición dentro del rango** (uso interno, incluir en el doc): bajo / alto del nivel validado
- **Confianza en la evaluación**: Alta / Media / Baja (y por qué)
- **Discrepancia con nivel sugerido**: si corresponde, explicá por qué subió o bajó el nivel

### Paso 3F — Evaluación de fit cultural

Para cada respuesta cultural, evaluá contra los valores de Despegar:
- ¿Mostró mentalidad de ownership o esperó que le dijeran qué hacer?
- ¿Habló de aprendizaje de errores o de evitarlos?
- ¿El éxito fue colectivo o individual ("yo logré")?
- ¿Puede hablar de impacto en el negocio o solo de tareas técnicas?
- ¿Mostró señales de "Brilliant Jerk" (resultados a cualquier costo)?

Concluí con:
- **Fit cultural**: Alto / Medio / Bajo
- **Fortalezas culturales**: qué valores demostró bien
- **Puntos de atención**: qué valores no quedaron claros o mostraron señales débiles

### Paso 3G — Recomendación final

```
EVALUACIÓN FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nivel validado:     [Semi Senior / Senior]
Posición en rango:  [Bajo (SDIII/SEII) / Alto (SEI/SEIII)]
Fit cultural:       [Alto / Medio / Bajo]
Recomendación:      [Avanzar / No avanzar / A revisar con manager]

Fundamento técnico:
[2-3 líneas con los aspectos técnicos más relevantes]

Fundamento cultural:
[2-3 líneas con los aspectos culturales más relevantes]

Puntos a profundizar si avanza:
[lista de 2-3 temas para la siguiente entrevista técnica]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Paso 3H — Actualizar el Google Sheet y output para el HR

#### Actualizar el Sheet

Leé el contenido actual del Google Sheet con `mcp__claude_ai_Google_Drive__read_file_content`.
Buscá la fila del candidato y actualizá los siguientes campos:

| Columna | Valor |
|---|---|
| Nivel validado | [Semi Senior / Senior] |
| Fit cultural | [Alto / Medio / Bajo] |
| Recomendación | [Avanzar / No avanzar / A revisar con manager] |
| Link Transcripción | [link si existe, si no dejar como estaba] |
| Estado | `Evaluado` |
| Fecha evaluación | [fecha actual] |

Usá `mcp__claude_ai_Google_Drive__create_file` con el Sheet actualizado. Si la herramienta no permite actualizar el archivo existente, mostrá al HR los datos exactos para que los complete manualmente.

#### Output para el HR

- Mostrá la evaluación completa
- Confirmá que el Sheet fue actualizado (o los datos a completar si la actualización automática no fue posible)
- Si se guardó una transcripción en Drive, mostrá el link
- Ofrecé actualizar el Google Doc del kit con la evaluación final si el HR lo pide

---

## Notas importantes

- **Nunca mostrés el perfil anonimizado al HR** — es un mecanismo interno para evitar sesgos en la generación de preguntas y en la evaluación.
- **Si el candidato no aplica al career path SE/SWD** (Designer, Infra, QA puro, etc.), informalo claramente en Fase 1 y no generes preguntas.
- **El nivel sugerido es una hipótesis** — el objetivo de la entrevista es validarlo, no confirmarlo.
- **La evaluación es orientativa** — la decisión final la toma el HR y/o el manager técnico.
- **Para reanudar** entre sesiones: el HR solo necesita el nombre del candidato o el link al Kit de Entrevista. El Google Sheet es la fuente de verdad de todos los links.
