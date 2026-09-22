# Módulo 07 — Servidor, despliegue y DevOps

Tiempo: 1,5 h. Aquí se pasa de "sé usar Docker en mi portátil" a "sé poner esto
en un servidor", que es lo que realmente busca una vacante con DevOps.

---

## 1. Arquitectura típica en un servidor

```
        Internet
           |
      puerto 443/80
           |
   +---------------+
   |     nginx     |  reverse proxy: TLS, dominio, cabeceras, ficheros estaticos
   +-------+-------+
           | red "frontend"
   +-------v-------+
   |      api      |  tu Spring Boot (1..N instancias, sin puerto publicado)
   +-------+-------+
           | red "backend" (internal: true)
   +-------v-------+
   |   postgres    |  volumen persistente, SIN acceso desde internet
   +---------------+
```

Tienes ese stack listo en [`compose.prod.yml`](compose.prod.yml) y la
configuración de nginx en [`nginx/default.conf`](nginx/default.conf).

### Pruébalo en local ahora mismo

Primero baja el stack del módulo 05 (usa el mismo puerto 8080 y te confundiría
la prueba de aislamiento):

```powershell
cd ../05-compose ; docker compose down ; cd ../07-servidor
```

```powershell
docker compose -f compose.prod.yml up -d --build
docker compose -f compose.prod.yml ps
curl http://localhost/api/tareas        # entras por NGINX en el puerto 80
curl http://localhost/health
```

La lista de tareas sale vacía (`[]`): este stack usa **otro volumen**
(`pgdata_prod`) y no carga `init.sql`. Crea una tarea con POST y verás que
persiste igual.

Fíjate en lo importante:
- La API **no tiene `ports:`**, solo `expose`. Desde Windows no puedes llegar a
  `localhost:8080`: **solo se entra por nginx**.
- La base de datos está en una red `internal: true`: ni sale a internet ni
  entra nadie.
- Prueba a escalar: `docker compose -f compose.prod.yml up -d --scale api=3`.
  Nginx reparte entre las tres instancias porque hace resolución DNS del
  servicio `api`. **Eso es balanceo de carga básico**, y lo puedes contar.

Parar:

```powershell
docker compose -f compose.prod.yml down
```

---

## 2. ¿Por qué un reverse proxy delante?

Respuesta para la entrevista (enumera 5):
1. **TLS/HTTPS** en un único sitio (con Let's Encrypt / certbot o Traefik).
2. **Un solo puerto público** (80/443): el resto de servicios quedan privados.
3. **Balanceo de carga** entre varias instancias de la API.
4. **Cabeceras, gzip, rate limiting, caché, ficheros estáticos**.
5. **Despliegues sin caída**: levantas la versión nueva y cambias el upstream.

Alternativa moderna que suma puntos si la mencionas: **Traefik** o **Caddy**,
que detectan los contenedores por sus labels y gestionan el certificado TLS
automáticamente.

---

## 3. Instalar Docker en un servidor Linux (Ubuntu)

Te lo pueden preguntar literalmente. Guion corto:

```bash
# 1. Instalar con el script oficial (rapido) ...
curl -fsSL https://get.docker.com | sh

# ... o el repositorio oficial (produccion): docs.docker.com/engine/install/ubuntu

# 2. Usar docker sin sudo
sudo usermod -aG docker $USER      # cierra sesion y vuelve a entrar
# (Ojo: el grupo docker es equivalente a root. Es un tema de seguridad conocido.)

# 3. Que arranque con la maquina
sudo systemctl enable --now docker
sudo systemctl status docker

# 4. Comprobar
docker run --rm hello-world
```

**Cortafuegos**: cuidado, Docker escribe reglas en iptables y puede
saltarse UFW. Publica solo lo necesario y usa `-p 127.0.0.1:PUERTO:...` para lo
interno.

---

## 4. Desplegar: las tres formas

### A) La sencilla: `git pull` + compose en el servidor

```bash
ssh usuario@mi-servidor
cd /opt/mi-app
git pull
docker compose up -d --build
```
Vale para proyectos pequeños. Inconveniente: **compilas en producción**
(consume CPU y RAM del servidor y no es reproducible).

### B) La correcta: registry

Construyes la imagen en el CI, la subes a un registry y el servidor **solo
descarga y arranca**.

```powershell
# 1. Etiquetar con el nombre del registry
docker build -t ghcr.io/miusuario/app-tareas:1.0.0 .
docker login ghcr.io
docker push ghcr.io/miusuario/app-tareas:1.0.0
```
```bash
# 2. En el servidor
docker compose pull
docker compose up -d
```

En el compose de producción cambias `build:` por `image: ghcr.io/...:1.0.0`.
**Usa tags inmutables (versión o SHA del commit), nunca `latest`**: así sabes
exactamente qué hay desplegado y puedes hacer rollback.

Rollback = `docker compose up -d` con el tag anterior. Esa es la respuesta a
*"¿cómo haces rollback?"*.

### C) Desde tu máquina, sin entrar al servidor: `docker context`

```powershell
docker context create prod --docker "host=ssh://usuario@mi-servidor"
docker context use prod
docker compose up -d        # se ejecuta EN EL SERVIDOR
docker context use default  # volver a local
```

Poco conocido y queda muy bien.

---

## 5. Que sobreviva a un reinicio

Dos mecanismos, y conviene saber los dos:

```yaml
restart: unless-stopped     # en compose: Docker relanza el contenedor
```

| Política | Comportamiento |
|---|---|
| `no` | por defecto, no reinicia |
| `on-failure[:3]` | solo si sale con error, con reintentos máximos |
| `always` | siempre, incluso tras reiniciar el servidor |
| `unless-stopped` | igual que `always`, salvo si lo paraste tú a mano |

Y para que el stack entero arranque con la máquina, una unidad **systemd**:

```ini
# /etc/systemd/system/mi-app.service
[Unit]
Description=Mi app en Docker Compose
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/mi-app
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now mi-app
```

---

## 6. Logs y monitorización

```bash
docker compose logs -f --tail=100 api
docker stats
docker events
```

Limita los logs o llenarán el disco (ya está puesto en `compose.prod.yml`):

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
```

Para un stack de verdad se menciona: **Prometheus + Grafana** (métricas, y
Spring Boot Actuator las expone en `/actuator/prometheus`), **Loki** o el
stack **ELK** para logs centralizados, y **cAdvisor** para métricas de
contenedores.

---

## 7. Seguridad (lista corta para la entrevista)

1. Usuario **no root** en la imagen (`USER`).
2. Imágenes base **oficiales, mínimas y con tag fijo**; actualizarlas.
3. **Escanear** imágenes: `docker scout cves imagen` o Trivy en el CI.
4. **Nunca secretos** en la imagen, ni en `ENV`, ni en el repositorio.
5. No publicar puertos innecesarios; base de datos en red interna.
6. `--read-only`, `--cap-drop ALL`, `--security-opt no-new-privileges`.
7. Límites de CPU y memoria (evita que un contenedor tumbe el host).
8. **No montes `/var/run/docker.sock`** en un contenedor salvo que sepas muy
   bien lo que haces: equivale a dar root del host.
9. Mantén el daemon actualizado y el acceso al grupo `docker` restringido.

---

## 8. Dónde encaja DevOps y qué decir de Kubernetes

**El ciclo completo:**

```
  codigo -> git push -> CI (build + tests + imagen) -> registry -> CD (deploy) -> monitorizacion
```

Tienes un pipeline real y comentado en
[`ci/github-actions-docker.yml`](ci/github-actions-docker.yml). Léelo: te
pueden preguntar "¿cómo automatizarías esto?" y ahí está la respuesta completa
(tests, build con caché, push con tags, escaneo Trivy, deploy por SSH).

**Conceptos DevOps que debes poder definir en una frase:**

| Concepto | Una frase |
|---|---|
| **CI** | Integrar y validar cada cambio automáticamente: build + tests en cada push |
| **CD** | Desplegar automáticamente lo que pasó el CI |
| **IaC** | Infraestructura como código: Terraform, Ansible; versionada en git |
| **Artefacto inmutable** | La misma imagen que pasó los tests es la que va a producción |
| **12-factor app** | Config por entorno, sin estado, logs a stdout, paridad dev/prod |
| **Blue-green** | Dos entornos idénticos; se conmuta el tráfico al nuevo |
| **Canary** | Se envía un % del tráfico a la versión nueva antes de completarla |
| **Observabilidad** | Logs + métricas + trazas para saber qué pasa en producción |

**Si te preguntan por Kubernetes** (sin que lo sepas a fondo, contesta esto):
> Compose orquesta contenedores en **una** máquina. Kubernetes los orquesta en
> un **clúster**: reprograma contenedores si un nodo cae, escala solo, hace
> rolling updates y rollback, gestiona service discovery, ConfigMaps y Secrets.
> Un *pod* es la unidad mínima (uno o varios contenedores que comparten red),
> un *Deployment* gestiona réplicas y actualizaciones, y un *Service* da una IP
> estable. No lo he usado en producción, pero entiendo el modelo y la imagen
> Docker es exactamente el mismo artefacto.

Honestidad + modelo mental correcto vale mucho más que fingir experiencia.

---

## 9. Ejercicios

1. Con el stack del módulo 05 **parado**, levanta `compose.prod.yml` y
   demuestra que **no** puedes acceder a la API por `localhost:8080`, pero sí
   por `localhost/api/tareas`.
2. Escala la API a 3 réplicas y comprueba en
   `curl http://localhost/api/tareas/info` que el `hostname` va cambiando.
3. Añade a nginx una cabecera personalizada `X-Servido-Por: nginx` y
   verifícalo con `curl -I`.
4. Simula un fallo: `docker kill prod-db`. Mira qué le pasa a la API en los
   logs y cómo Docker reinicia la base de datos por `restart: unless-stopped`.
5. Etiqueta la imagen como si fueras a publicarla:
   `docker tag app-tareas:1.0.0 ghcr.io/tuusuario/app-tareas:1.0.0`.
6. Escribe (sin ejecutar) los comandos exactos para desplegar una versión nueva
   en un servidor usando registry, y para hacer rollback.

<details>
<summary>Soluciones</summary>

```powershell
# 1
curl http://localhost:8080/api/tareas      # falla: no hay puerto publicado
curl http://localhost/api/tareas           # OK a traves de nginx

# 2
docker compose -f compose.prod.yml up -d --scale api=3
curl http://localhost/api/tareas/info      # repitelo varias veces

# 3  en nginx/default.conf, dentro del bloque server:
#    add_header X-Servido-Por nginx;
docker compose -f compose.prod.yml restart nginx
curl -I http://localhost/

# 6
docker build -t ghcr.io/yo/app:1.2.0 . ; docker push ghcr.io/yo/app:1.2.0
ssh srv "cd /opt/app && sed -i 's/1.1.0/1.2.0/' compose.yml && docker compose pull && docker compose up -d"
# rollback: vuelve al tag 1.1.0 y repite docker compose up -d
```
</details>

---

## 10. Preguntas de entrevista de este módulo

- ¿Cómo despliegas una aplicación dockerizada en un servidor?
- ¿Por qué no construyes la imagen en el servidor de producción?
- ¿Qué es un registry y por qué no usarías el tag `latest`?
- ¿Cómo haces un rollback?
- ¿Cómo consigues que los contenedores arranquen al reiniciar el servidor?
- ¿Para qué pones nginx delante?
- ¿Cómo gestionas los secretos en producción?
- ¿Qué diferencia hay entre Docker Compose y Kubernetes?
- ¿Qué pasos tendría tu pipeline de CI/CD?
- ¿Cómo monitorizas contenedores en producción?
