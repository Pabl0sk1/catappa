# Módulo 04 — YAML en 30 minutos

YAML es el idioma de Docker Compose, Kubernetes, GitHub Actions, Ansible y
`application.yml` de Spring. Si dominas el YAML, escribes los cuatro sin
dudar. Es corto: léelo entero.

---

## 1. Qué es

**YAML = YAML Ain't Markup Language.** Un formato para escribir datos
estructurados legible por humanos. Extensión `.yml` o `.yaml` (idénticas).

Representa tres cosas: **mapas** (clave-valor), **listas** y **escalares**
(texto, número, booleano, null).

---

## 2. Sintaxis

### Clave-valor (mapa)

```yaml
nombre: mi-api
puerto: 8080
activo: true
descripcion: API de tareas
```

Ojo al espacio: `nombre:mi-api` (sin espacio) **no es válido**.

### Anidamiento: con INDENTACIÓN, siempre con ESPACIOS

```yaml
servidor:
  host: localhost
  puerto: 8080
  ssl:
    activo: false
    certificado: /etc/ssl/cert.pem
```

> **REGLA DE ORO: los tabuladores están PROHIBIDOS en YAML.** Solo espacios.
> Es el error número uno. Configura tu editor: "insertar espacios en vez de
> tabulador", 2 espacios.

### Listas: guion + espacio

```yaml
puertos:
  - "8080:8080"
  - "9090:9090"

# forma en linea (equivalente)
puertos: ["8080:8080", "9090:9090"]
```

### Lista de mapas (muy común en Kubernetes y GitHub Actions)

```yaml
servicios:
  - nombre: api
    puerto: 8080
  - nombre: db
    puerto: 5432
```

El `-` marca el inicio de cada elemento; las claves siguientes se alinean con
la primera.

### Comentarios

```yaml
# esto es un comentario
puerto: 8080   # tambien al final de linea
```

### Texto multilínea

```yaml
literal: |
  Esta linea y
  esta otra conservan
  los saltos de linea.

plegado: >
  Estas lineas se
  unen en una sola
  separadas por espacios.
```

### Tipos y las comillas

```yaml
entero: 42
decimal: 3.14
booleano: true          # true/false  (YAML 1.1 también acepta yes/no/on/off)
nulo: null              # o ~
texto: hola
texto_citado: "hola"
```

Casos donde **necesitas comillas** (y que rompen compose si las olvidas):

```yaml
version: "3.9"        # sin comillas seria el numero 3.9
puertos: "8080:8080"  # sin comillas, "22:22" se interpreta como sexagesimal
password: "12345"     # quieres el texto, no el numero
si: "yes"             # sin comillas, yes -> true
ruta: "C:\\datos"     # las comillas dobles interpretan escapes
```

### Anclas y referencias (reutilizar bloques)

```yaml
x-comun: &comun            # & define el ancla
  restart: unless-stopped
  networks: [backend]

servicios:
  api:
    <<: *comun             # << fusiona el mapa referenciado
    image: mi-api:1.0
  worker:
    <<: *comun
    image: mi-worker:1.0
```

Aparece en `compose.yml` reales y da muy buena impresión saber qué es.

### Varios documentos en un fichero

```yaml
---
doc: 1
---
doc: 2
```

Lo verás en Kubernetes (`Deployment` + `Service` en el mismo fichero).

---

## 3. Los 5 errores que comete todo el mundo

| Error | Síntoma | Arreglo |
|---|---|---|
| Usar tabuladores | `found character '\t' that cannot start any token` | Solo espacios |
| Indentación inconsistente | `mapping values are not allowed here` | 2 espacios por nivel, siempre igual |
| Falta el espacio tras `:` | El valor se lee mal o falla | `clave: valor` |
| Olvidar comillas en `"8080:80"` o `"3.9"` | Compose interpreta números raros | Entrecomilla puertos y versiones |
| Duplicar una clave | Gana la última, en silencio | Revisa antes de depurar durante una hora |

---

## 4. Práctica (10 minutos, y de paso preparas el módulo 05)

Crea el fichero `practica.yml` en esta carpeta con **esta información**,
escribiéndolo tú:

- Un servicio `api`: imagen `app-simple:v2`, publica el 8080 al 8080, con las
  variables `APP_MENSAJE=hola` y `SERVER_PORT=8080`, y `restart: unless-stopped`.
- Un servicio `db`: imagen `postgres:16-alpine`, variable
  `POSTGRES_PASSWORD=secreto`, y un volumen `pgdata` montado en
  `/var/lib/postgresql/data`.
- Los dos en una red llamada `backend`.

Valida la sintaxis sin ejecutar nada:

```powershell
docker compose -f practica.yml config
```

Si el YAML está mal, te dirá la línea exacta. Si está bien, te imprime el
fichero normalizado. **Este comando es tu validador de YAML, úsalo siempre.**

<details>
<summary>Solución</summary>

```yaml
services:
  api:
    image: app-simple:v2
    ports:
      - "8080:8080"
    environment:
      APP_MENSAJE: hola
      SERVER_PORT: "8080"
    restart: unless-stopped
    networks:
      - backend

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secreto
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - backend

volumes:
  pgdata:

networks:
  backend:
```
</details>

---

## 5. Preguntas de entrevista

- ¿Se pueden usar tabuladores en YAML? (**No**)
- ¿Cómo representas una lista de objetos?
- ¿Para qué sirven las anclas `&` y `*`?
- ¿Por qué se entrecomillan los puertos en compose?
- ¿Diferencia entre `|` y `>`?
