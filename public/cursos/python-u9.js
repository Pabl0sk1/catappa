window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Automatización de sistemas",
resumen: "Ejecutar comandos con subprocess, llamar a APIs, crear herramientas de línea de comandos, logging y automatizar la nube con boto3",
nivel: "Experto",
color: "#d2ab22",
lecciones: [

{
id:"py9l1",
titulo:"Comandos, APIs y ficheros del sistema",
claves:["subprocess.run con lista de argumentos y check=True; evita shell=True","requests o httpx para APIs con timeouts","shutil, pathlib y os para mover, copiar y limpiar"],
pasos:[
 {t:"info", eti:"Python como bash con superpoderes", h:"subprocess",
  c:`<div class="termbox">import subprocess

r = subprocess.run(["docker", "ps", "--format", "{{.Names}}"],
                   capture_output=True, text=True, check=True, timeout=30)
contenedores = r.stdout.split()

subprocess.run(f"rm -rf {carpeta}", shell=True)     # PELIGRO: inyeccion de comandos
subprocess.run(["rm", "-rf", carpeta], check=True)  # los argumentos van separados</div>`},
 {t:"info", eti:"APIs", h:"requests",
  c:`<div class="termbox">import requests

s = requests.Session()
s.headers["Authorization"] = f"Bearer {token}"
r = s.get("https://api.github.com/repos/pablo/tareas/actions/runs", params={"per_page": 5}, timeout=10)
r.raise_for_status()                                # excepcion si es 4xx o 5xx
for run in r.json()["workflow_runs"]:
    print(run["name"], run["conclusion"])</div>`},
 {t:"par", p:"Empareja cada opción de subprocess.run con su efecto",
  pares:[["capture_output=True","Guardar la salida en lugar de mostrarla"],["text=True","Devolver la salida como str en vez de bytes"],["check=True","Lanzar excepción si el comando falla"],["timeout=30","Cortar si tarda más de 30 segundos"],["shell=True","Pasar por la shell: riesgo de inyección"]],
  why:"Igual que en bash con set -e: no ignores los códigos de salida."},
 {t:"opcion", p:"¿Por qué evitar <code>shell=True</code> con valores que vienen de fuera?",
  ops:["Es más lento","Un valor como \"x; rm -rf /\" ejecutaría comandos extra: inyección de comandos","No funciona en Linux","Por el formato"],
  ok:1, why:"Con una lista de argumentos, cada uno llega tal cual al programa."}
]},

{
id:"py9l2",
titulo:"Herramientas de línea de comandos y logging",
claves:["argparse (incluido) o typer para crear CLIs con ayuda automática","logging con niveles en vez de print","Códigos de salida: 0 bien, distinto de 0 error"],
pasos:[
 {t:"info", eti:"Herramientas propias", h:"Una CLI con argparse y logging",
  c:`<div class="termbox">#!/usr/bin/env python3
import argparse, logging, sys
from pathlib import Path

log = logging.getLogger("limpieza")

def main() -&gt; int:
    p = argparse.ArgumentParser(description="Borra logs antiguos")
    p.add_argument("carpeta", type=Path)
    p.add_argument("--dias", type=int, default=7)
    p.add_argument("--simular", action="store_true")
    args = p.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

    if not args.carpeta.is_dir():
        log.error("No existe %s", args.carpeta)
        return 1
    ...
    return 0

if __name__ == "__main__":
    sys.exit(main())</div>
     <div class="termbox">pablo@servidor:~$ ./limpiar.py /var/log/app --dias 14 --simular
pablo@servidor:~$ ./limpiar.py --help</div>`},
 {t:"par", p:"Empareja cada nivel de logging con su uso",
  pares:[["DEBUG","Detalles para depurar"],["INFO","Lo que ocurre normalmente"],["WARNING","Algo raro que no impide seguir"],["ERROR","Algo falló"],["CRITICAL","El programa no puede continuar"]],
  why:"Con logging controlas el nivel sin tocar el código y puedes enviarlo a ficheros o a JSON."},
 {t:"vf", p:"Un script que falla debería terminar con código de salida 0.",
  ok:false, why:"Distinto de 0: así cron, el CI o un pipeline saben que algo fue mal."}
]},

{
id:"py9l3",
titulo:"Automatizar la nube con boto3",
claves:["boto3 es el SDK de AWS para Python","Credenciales desde el entorno o roles, nunca en el código","Paginadores para listados largos"],
pasos:[
 {t:"info", eti:"AWS desde Python", h:"boto3",
  c:`<div class="termbox">import boto3
from datetime import datetime, timezone, timedelta

ec2 = boto3.client("ec2", region_name="eu-west-1")
limite = datetime.now(timezone.utc) - timedelta(days=30)

paginador = ec2.get_paginator("describe_snapshots")
for pagina in paginador.paginate(OwnerIds=["self"]):
    for snap in pagina["Snapshots"]:
        if snap["StartTime"] &lt; limite:
            print("Antiguo:", snap["SnapshotId"])
            # ec2.delete_snapshot(SnapshotId=snap["SnapshotId"])</div>
     <p>Las credenciales se toman de variables de entorno, <code>~/.aws</code>, o del <b>rol</b> de la máquina o pod: nunca se escriben en el script.</p>`},
 {t:"par", p:"Empareja cada tarea de automatización con el enfoque adecuado",
  pares:[["Crear la infraestructura de un entorno","Terraform (declarativo)"],["Limpiar snapshots antiguos cada noche","Script con boto3 programado"],["Configurar paquetes en 50 servidores","Ansible"],["Consulta puntual de recursos","AWS CLI o boto3 en un script"]],
  why:"Python complementa a Terraform y Ansible; no los sustituye."},
 {t:"opcion", p:"¿Por qué usar un paginador de boto3 al listar recursos?",
  ops:["Por estilo","Las APIs de AWS devuelven los resultados por páginas; sin paginar solo verías la primera","Para ir más rápido","Es obligatorio"],
  ok:1, why:"Un error típico: el script «no encuentra» recursos que están en la página 2."}
]},

{
id:"py9l4",
titulo:"Scripts robustos y programados",
claves:["Programar con cron, temporizadores de systemd o CronJobs de Kubernetes","Idempotencia y bloqueo para que dos ejecuciones no se pisen","Reintentos con espera, límites de tiempo y avisos si algo falla"],
pasos:[
 {t:"info", eti:"Sin supervisión", h:"Que funcione solo",
  c:`<div class="termbox"># crontab -e
30 3 * * * /opt/scripts/.venv/bin/python /opt/scripts/limpiar.py --dias 14 &gt;&gt; /var/log/limpiar.log 2&gt;&amp;1

# bloqueo para no ejecutarse dos veces a la vez
import fcntl, sys
cerrojo = open("/tmp/limpiar.lock", "w")
try:
    fcntl.flock(cerrojo, fcntl.LOCK_EX | fcntl.LOCK_NB)
except BlockingIOError:
    sys.exit("Ya hay otra ejecución en curso")

# reintentos con espera creciente (libreria tenacity)
@retry(stop=stop_after_attempt(5), wait=wait_exponential(min=2, max=60))
def subir_backup(ruta): ...</div>`},
 {t:"par", p:"Empareja cada práctica con el problema que evita",
  pares:[["Idempotencia","Duplicar efectos si el script se ejecuta dos veces"],["Fichero de bloqueo","Dos ejecuciones solapadas"],["Reintentos con espera","Fallar por un error de red pasajero"],["Código de salida distinto de 0","Que nadie se entere de que falló"],["Aviso a Slack o correo en caso de error","Descubrir el fallo semanas después"]],
  why:"Un script programado sin avisos de error es un fallo silencioso esperando a ocurrir."},
 {t:"opcion", p:"Tu script de copias se ejecuta cada noche con cron, pero un día falla y nadie se entera durante un mes. ¿Qué añadirías?",
  ops:["Nada","Código de salida correcto y un aviso si falla, más una comprobación externa de que la copia de hoy existe (un «dead man's switch»)","Más logs sin leerlos","Ejecutarlo dos veces"],
  ok:1, why:"Servicios como healthchecks.io avisan si un trabajo programado no da señales de vida."}
]}

]});
