window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Expresiones y repetición",
resumen: "count y for_each, expresiones for, condicionales y splat, funciones integradas con terraform console, bloques dynamic y estructuras anidadas",
nivel: "Intermedio",
color: "#a77ee8",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"tf4l1",
titulo:"count y for_each",
claves:["count crea N copias identificadas por índice: [0], [1]...","for_each crea una por cada clave de un mapa o conjunto: [\"a\"], [\"b\"]... y es más estable","count = condición ? 1 : 0 para recursos opcionales; for_each para colecciones que cambian"],
pasos:[
 {t:"info", eti:"Varios iguales", h:"Repetir recursos",
  c:`<div class="termbox">variable "subredes_privadas" {
  type = map(string)
  default = {
    a = "10.0.11.0/24"
    b = "10.0.12.0/24"
    c = "10.0.13.0/24"
  }
}

resource "aws_subnet" "privada" {
  for_each          = var.subredes_privadas
  vpc_id            = aws_vpc.principal.id
  cidr_block        = each.value
  availability_zone = "eu-west-1\${each.key}"
  tags              = { Name = "privada-\${each.key}" }
}
# aws_subnet.privada["a"], aws_subnet.privada["b"], aws_subnet.privada["c"]

resource "aws_instance" "bastion" {
  count = var.entorno == "prod" ? 1 : 0          # crear o no crear
  # ...
}
# aws_instance.bastion[0]  (o ninguna)</div>`},
 {t:"info", eti:"La trampa del índice", h:"Por qué for_each es la opción por defecto",
  c:`<div class="dg"><div class="dg-tit">quitar «a» de la lista [a, b, c]</div><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">con count</div><div class="dg-pila">
         <div class="dg-caja aviso">[0]: a → b<small>reemplazar</small></div>
         <div class="dg-caja aviso">[1]: b → c<small>reemplazar</small></div>
         <div class="dg-caja aviso">[2]: c<small>destruir</small></div></div></div>
       <div class="dg-col"><div class="dg-col-tit">con for_each</div><div class="dg-pila">
         <div class="dg-caja aviso">["a"]<small>destruir</small></div>
         <div class="dg-caja ok">["b"]<small>sin cambios</small></div>
         <div class="dg-caja ok">["c"]<small>sin cambios</small></div></div></div>
     </div></div>
     <ul><li><code>for_each</code> acepta un <b>map</b> o un <b>set de strings</b>; una lista se convierte con <code>toset()</code>.</li>
     <li>Las claves deben conocerse en el plan: no pueden salir de atributos «known after apply» (como ids que aún no existen).</li>
     <li>Para obtener todos los ids: <code>[for s in aws_subnet.privada : s.id]</code> o <code>values(aws_subnet.privada)[*].id</code>.</li></ul>`},
 {t:"opcion", p:"Tienes 3 subredes con <code>count</code> y quitas la primera de la lista. ¿Qué propone Terraform?",
  ops:["Borrar solo la primera","Modificar o recrear varias, porque los índices se desplazan (la [1] pasa a ser la [0]...)","Nada","Un error"],
  ok:1, why:"Con for_each, cada elemento se identifica por su clave y quitar uno no afecta a los demás."},
 {t:"par", p:"Empareja cada expresión con su significado",
  pares:[["count.index","Posición del elemento con count"],["each.key","Clave del elemento con for_each"],["each.value","Valor del elemento con for_each"],["count = var.crear ? 1 : 0","Crear el recurso solo si se cumple la condición"],["aws_subnet.privada[\"a\"]","Referencia a un elemento concreto creado con for_each"]],
  why:"for_each es la opción por defecto en código profesional; count queda para 0/1 o copias idénticas."},
 {t:"hueco", p:"Completa para crear un usuario IAM por cada nombre de la lista",
  tpl:"resource \"aws_iam_user\" \"dev\" {\n  for_each = ___(var.desarrolladores)\n  name     = ___\n}", banco:["toset","tolist","each.value","count.index","each.index"], sol:["toset","each.value"],
  why:"Con un set, each.key y each.value son el mismo texto."},
 {t:"vf", p:"<code>for_each</code> puede usar como claves los ids de unas instancias que se crean en ese mismo apply.",
  ok:false, why:"Las claves deben conocerse durante el plan. Usa claves que tú controlas (nombres) y deja los ids como valores."},
 {t:"codigo", p:"Simula el plan de quitar o añadir elementos con <code>count</code> y con <code>for_each</code>",
  lenguaje:"js",
  c:`<p>La entrada tiene dos líneas: la lista de antes y la de después, separadas por comas (pueden estar vacías). Imprime <code>count:</code> y, para cada índice, <code>~ r[i]: viejo -&gt; nuevo</code> si cambia el valor, <code>+ r[i]</code> si aparece y <code>- r[i]</code> si desaparece. Después <code>for_each:</code> con <code>- r["x"]</code> por cada elemento que desaparece (en el orden de antes) y <code>+ r["x"]</code> por cada uno nuevo (en el orden de después).</p>
     <p>Con <code>a,b,c</code> y <code>b,c</code> la salida es: <code>count:</code>, <code>~ r[0]: a -&gt; b</code>, <code>~ r[1]: b -&gt; c</code>, <code>- r[2]</code>, <code>for_each:</code>, <code>- r["a"]</code>.</p>`,
  plantilla:"const [antesTxt = \"\", despuesTxt = \"\"] = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\");\nconst lista = t => t.trim() === \"\" ? [] : t.split(\",\").map(s => s.trim());\nconst antes = lista(antesTxt), despues = lista(despuesTxt);\n// imprime el plan con count y con for_each\n",
  pruebas:[{entrada:"a,b,c\nb,c\n", salida:"count:\n~ r[0]: a -> b\n~ r[1]: b -> c\n- r[2]\nfor_each:\n- r[\"a\"]"},{entrada:"a,b\na,b,c\n", salida:"count:\n+ r[2]\nfor_each:\n+ r[\"c\"]"},{entrada:"x,y,z\nx,w,z,v\n", salida:"count:\n~ r[1]: y -> w\n+ r[3]\nfor_each:\n- r[\"y\"]\n+ r[\"w\"]\n+ r[\"v\"]", oculta:true}],
  pista:"Recorre los índices hasta el máximo de las dos longitudes; para for_each usa filter con includes.",
  solucion:"const [antesTxt = \"\", despuesTxt = \"\"] = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\");\nconst lista = t => t.trim() === \"\" ? [] : t.split(\",\").map(s => s.trim());\nconst antes = lista(antesTxt), despues = lista(despuesTxt);\nconsole.log(\"count:\");\nfor (let i = 0; i < Math.max(antes.length, despues.length); i++) {\n  if (i >= despues.length) console.log(\"- r[\" + i + \"]\");\n  else if (i >= antes.length) console.log(\"+ r[\" + i + \"]\");\n  else if (antes[i] !== despues[i]) console.log(\"~ r[\" + i + \"]: \" + antes[i] + \" -> \" + despues[i]);\n}\nconsole.log(\"for_each:\");\nfor (const x of antes) if (!despues.includes(x)) console.log(\"- r[\\\"\" + x + \"\\\"]\");\nfor (const x of despues) if (!antes.includes(x)) console.log(\"+ r[\\\"\" + x + \"\\\"]\");",
  why:"Con count, un cambio en medio de la lista toca todo lo que va detrás; con for_each solo cambia lo que de verdad cambió. Por eso las subredes, usuarios o buckets van con for_each."},
 {t:"opcion", p:"¿Cuándo sigue teniendo sentido <code>count</code>?",
  ops:["Nunca","Para crear o no un recurso (0 o 1) o N copias idénticas e intercambiables","Para colecciones con nombre","Solo con módulos"],
  ok:1, why:"Si las copias son intercambiables (tres workers idénticos), el índice no importa."}
]},

/* =============== U4 L2 =============== */
{
id:"tf4l2",
titulo:"Expresiones: for, condicionales y splat",
claves:["[for x in lista : f(x)] crea listas; {for k, v in mapa : k =&gt; f(v)} crea mapas; if filtra","condición ? a : b, con los dos lados del mismo tipo","El splat lista[*].id saca un atributo de todos los elementos"],
pasos:[
 {t:"info", eti:"Transformar", h:"Expresiones for",
  c:`<div class="termbox">locals {
  nombres   = ["api", "worker", "cron"]
  mayus     = [for n in local.nombres : upper(n)]          # ["API", "WORKER", "CRON"]
  con_indice = { for i, n in local.nombres : n =&gt; i }      # { api = 0, worker = 1, cron = 2 }

  # filtrar con if
  publicos = { for k, s in var.servicios : k =&gt; s if s.publico }

  # agrupar con ... (varios valores por clave)
  por_equipo = { for s in var.lista_servicios : s.equipo =&gt; s.nombre... }
  # { pagos = ["api-pagos", "facturas"], web = ["front"] }
}</div>
     <ul><li><b>Corchetes</b> <code>[ ]</code>: el resultado es una lista (tupla).</li>
     <li><b>Llaves</b> <code>{ }</code> con <code>=&gt;</code>: el resultado es un mapa (objeto). Si dos elementos producen la misma clave, error, salvo que uses <code>...</code> para agrupar.</li></ul>`},
 {t:"info", eti:"Decidir y extraer", h:"Condicionales y splat",
  c:`<div class="termbox">locals {
  tamano   = var.entorno == "prod" ? "m7g.large" : "t4g.small"
  kms_clave = var.kms_arn != "" ? var.kms_arn : null      # null = no poner nada
  replicas  = coalesce(var.replicas, 2)                    # primer valor no nulo

  ids_web  = aws_instance.web[*].id                        # splat sobre count
  ids_priv = [for s in aws_subnet.privada : s.id]          # sobre for_each
}</div>
     <ul><li>Los dos lados de <code>? :</code> deben tener un tipo compatible.</li>
     <li>El splat <code>[*]</code> funciona sobre listas (count). Un for_each es un mapa: usa una expresión for o <code>values(...)[*].id</code>.</li>
     <li>Operadores: <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>, <code>+ - * / %</code>.</li></ul>`},
 {t:"hueco", p:"Completa para obtener un mapa nombre =&gt; cpu solo de los servicios públicos",
  tpl:"{ ___ k, s in var.servicios : k ___ s.cpu ___ s.publico }", banco:["for","=>","if","in",":","where"], sol:["for","=>","if"],
  why:"Estructura: { for clave, valor in colección : nueva_clave => nuevo_valor if filtro }."},
 {t:"term", p:"En <code>terraform console</code>, escribe la expresión que pasa a mayúsculas cada elemento de <code>[\"api\", \"web\"]</code>",
  prompt:">", sol:["[for n in [\"api\", \"web\"] : upper(n)]","[for x in [\"api\", \"web\"] : upper(x)]","[for s in [\"api\", \"web\"] : upper(s)]","[for n in [\"api\",\"web\"]: upper(n)]"],
  salida:`[
  "API",
  "WEB",
]`,
  pista:"[for n in lista : upper(n)]",
  why:"terraform console es el sitio para probar expresiones antes de meterlas en el código."},
 {t:"opcion", p:"¿Qué devuelve <code>{ for s in local.lista : s.equipo =&gt; s.nombre }</code> si dos servicios son del mismo equipo?",
  ops:["Un mapa con el último","Un error por clave duplicada; con s.nombre... agruparía en listas","Una lista","Un mapa con el primero"],
  ok:1, why:"Terraform no descarta datos en silencio: te obliga a decidir (agrupar con ... o cambiar la clave)."},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["[for n in [1, 2, 3] : n * 2]","[2, 4, 6]"],["{ for n in [\"a\", \"b\"] : n => upper(n) }","{ a = \"A\", b = \"B\" }"],["[for n in [1, 2, 3, 4] : n if n % 2 == 0]","[2, 4]"],["true ? \"sí\" : \"no\"","\"sí\""],["coalesce(null, \"\", \"x\")","\"x\""]],
  why:"coalesce salta null y cadenas vacías hasta el primer valor útil."},
 {t:"vf", p:"<code>aws_subnet.privada[*].id</code> funciona igual si <code>aws_subnet.privada</code> se creó con <code>for_each</code>.",
  ok:false, why:"Con for_each el recurso es un mapa; usa [for s in aws_subnet.privada : s.id] o values(aws_subnet.privada)[*].id."},
 {t:"opcion", p:"¿Qué hace <code>kms_key_id = var.kms_arn != \"\" ? var.kms_arn : null</code>?",
  ops:["Pone una clave vacía","Usa la clave si se indicó y, si no, deja el argumento sin valor (el provider usa su defecto)","Da error si está vacía","Crea una clave nueva"],
  ok:1, why:"null es la forma de decir «como si no hubiera escrito este argumento»."}
]},

/* =============== U4 L3 =============== */
{
id:"tf4n1",
titulo:"Funciones integradas y terraform console",
claves:["Familias: texto, colecciones, codificación, ficheros, red, tipos y fechas","No existen funciones definidas por el usuario; sí funciones que aporta un provider (provider::aws::...)","terraform console para probarlas con tu configuración y tu estado cargados"],
pasos:[
 {t:"info", eti:"Caja de herramientas", h:"Las funciones que más se usan",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">funciones por familia</div><table class="dg-tabla"><thead><tr><th>familia</th><th>ejemplos</th></tr></thead><tbody>
<tr><td>texto</td><td>format, join, split, replace, lower, upper, trimspace, startswith, strcontains</td></tr>
<tr><td>colecciones</td><td>length, merge, concat, flatten, keys, values, lookup, contains, distinct, zipmap, setproduct, coalesce</td></tr>
<tr><td>codificación</td><td>jsonencode, jsondecode, yamlencode, base64encode</td></tr>
<tr><td>ficheros</td><td>file, templatefile, fileset (con path.module)</td></tr>
<tr><td>red</td><td>cidrsubnet, cidrhost, cidrnetmask</td></tr>
<tr><td>tipos y errores</td><td>try, can, tostring, toset, tomap</td></tr>
</tbody></table></div>
     <div class="termbox">locals {
  politica  = jsonencode({ Version = "2012-10-17", Statement = [] })
  user_data = templatefile("\${path.module}/arranque.sh.tftpl", { entorno = var.entorno })
  nombre    = format("%s-%03d", "web", 7)                  # "web-007"
  puerto    = try(var.config.puerto, 8080)                  # si no existe, 8080
}</div>
     <div class="nota ojo"><b class="tit">Cuidado con timestamp() y uuid()</b>Devuelven un valor distinto en cada plan: usadas en un argumento, provocan un cambio en cada ejecución.</div>`},
 {t:"info", eti:"Probar", h:"terraform console",
  c:`<div class="termbox">$ terraform console
&gt; cidrsubnet("10.0.0.0/16", 8, 3)
"10.0.3.0/24"
&gt; cidrhost("10.0.3.0/24", 10)
"10.0.3.10"
&gt; merge({ a = 1, b = 2 }, { b = 3 })
{
  "a" = 1
  "b" = 3
}
&gt; var.entorno                      # también lee tus variables
"dev"
&gt; aws_s3_bucket.backups.arn        # y tu estado
"arn:aws:s3:::backups-catappa-dev"</div>
     <p><code>cidrsubnet(prefijo, bits_nuevos, número)</code> alarga la máscara en <code>bits_nuevos</code> y elige la subred número <code>número</code>. De un /16 con 8 bits salen 256 subredes /24.</p>
     <p>Desde Terraform 1.8 los providers pueden aportar funciones: <code>provider::aws::arn_parse(arn)</code>.</p>`},
 {t:"term", p:"En <code>terraform console</code>, calcula la subred número 11 de <code>10.0.0.0/16</code> añadiendo 8 bits",
  prompt:">", sol:["cidrsubnet(\"10.0.0.0/16\", 8, 11)","cidrsubnet(\"10.0.0.0/16\",8,11)"],
  salida:`"10.0.11.0/24"`,
  pista:"cidrsubnet(prefijo, bits nuevos, número de subred)",
  why:"Calcular las subredes con cidrsubnet evita errores de solapamiento al copiar rangos a mano."},
 {t:"par", p:"Empareja cada llamada con su resultado",
  pares:[["merge({a = 1}, {a = 2})","{ a = 2 }"],["join(\"-\", [\"cat\", \"prod\"])","\"cat-prod\""],["length([\"a\", \"b\", \"c\"])","3"],["lookup({dev = 1}, \"prod\", 0)","0"],["flatten([[1, 2], [3]])","[1, 2, 3]"]],
  why:"merge da prioridad al último mapa: ideal para «etiquetas comunes + etiquetas propias»."},
 {t:"opcion", p:"Quieres que el <code>user_data</code> de una instancia salga de un fichero con variables. ¿Qué función usas?",
  ops:["file()","templatefile(\"${path.module}/arranque.sh.tftpl\", { entorno = var.entorno })","jsonencode()","format()"],
  ok:1, why:"templatefile rellena ${ } y directivas %{ } del fichero con los valores que le pasas. path.module hace la ruta independiente de desde dónde se ejecute."},
 {t:"vf", p:"En HCL puedes definir tus propias funciones con un bloque <code>function</code>.",
  ok:false, why:"Terraform no tiene funciones de usuario. Para lógica reutilizable: locals, módulos o funciones aportadas por providers."},
 {t:"codigo", p:"Implementa <code>cidrsubnet</code> para IPv4: para cada línea <code>prefijo bits número</code> imprime la subred",
  lenguaje:"js",
  c:`<p>Ejemplo: <code>10.0.0.0/16 8 11</code> debe imprimir <code>10.0.11.0/24</code>, y <code>10.0.0.0/16 4 3</code> debe imprimir <code>10.0.48.0/20</code>. Ignora las líneas vacías.</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l.trim());\nfor (const l of lineas) {\n  const [cidr, bits, num] = l.trim().split(/\\s+/);\n  // calcula la subred\n}\n",
  pruebas:[{entrada:"10.0.0.0/16 8 11\n", salida:"10.0.11.0/24"},{entrada:"10.0.0.0/16 4 3\n10.1.0.0/16 8 0\n", salida:"10.0.48.0/20\n10.1.0.0/24"},{entrada:"192.168.0.0/24 2 3\n172.16.0.0/12 4 15\n", salida:"192.168.0.192/26\n172.31.0.0/16", oculta:true}],
  pista:"Pasa la IP a un número de 32 bits, calcula el nuevo prefijo (p + bits) y suma número × 2^(32 − nuevo prefijo).",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l.trim());\nfor (const l of lineas) {\n  const [cidr, bits, num] = l.trim().split(/\\s+/);\n  const [ip, p] = cidr.split(\"/\");\n  const n = ip.split(\".\").reduce((a, o) => a * 256 + Number(o), 0);\n  const nuevo = Number(p) + Number(bits);\n  const tam = 2 ** (32 - Number(p));\n  const base = n - (n % tam);\n  const r = base + Number(num) * 2 ** (32 - nuevo);\n  const octetos = [24, 16, 8, 0].map(s => Math.floor(r / 2 ** s) % 256);\n  console.log(octetos.join(\".\") + \"/\" + nuevo);\n}",
  why:"Es exactamente lo que hace Terraform: alargar la máscara y desplazar el número de subred a su posición. Entenderlo ayuda a diseñar rangos que no se solapan."},
 {t:"escribe", p:"¿Qué función devuelve un valor alternativo si una expresión falla, por ejemplo al leer un atributo que puede no existir?",
  sol:["try","try()"], pista:"En inglés, «intentar».",
  why:"try(var.config.puerto, 8080). can() es su hermana: devuelve true o false en vez de un valor."}
]},

/* =============== U4 L4 =============== */
{
id:"tf4n2",
titulo:"Bloques dynamic y estructuras anidadas",
claves:["dynamic genera bloques anidados repetidos a partir de una colección","flatten convierte estructuras anidadas en una lista plana para for_each","Si el código se vuelve ilegible, mejor recursos separados que dynamic anidados"],
pasos:[
 {t:"info", eti:"Bloques repetidos", h:"dynamic",
  c:`<div class="termbox">variable "reglas_entrada" {
  type = list(object({ puerto = number, origen = string }))
  default = [
    { puerto = 443, origen = "0.0.0.0/0" },
    { puerto = 22,  origen = "10.0.0.0/16" },
  ]
}

resource "aws_security_group" "web" {
  name   = "web"
  vpc_id = aws_vpc.principal.id

  dynamic "ingress" {
    for_each = var.reglas_entrada
    iterator = regla                 # opcional: por defecto se llama como el bloque
    content {
      from_port   = regla.value.puerto
      to_port     = regla.value.puerto
      protocol    = "tcp"
      cidr_blocks = [regla.value.origen]
    }
  }
}</div>
     <p>Dentro de <code>content</code>, el elemento actual es <code>ingress.value</code> (o el nombre que des con <code>iterator</code>), y su posición o clave, <code>.key</code>.</p>`},
 {t:"info", eti:"Anidado", h:"flatten para aplanar",
  c:`<p>Caso típico: varios grupos de seguridad, cada uno con varios puertos, y quieres <b>un recurso por regla</b> (el provider de AWS recomienda hoy reglas como recursos separados, <code>aws_vpc_security_group_ingress_rule</code>).</p>
     <div class="termbox">locals {
  reglas = flatten([
    for sg, cfg in var.grupos : [
      for puerto in cfg.puertos : {
        clave  = "\${sg}-\${puerto}"
        sg     = sg
        puerto = puerto
      }
    ]
  ])
}

resource "aws_vpc_security_group_ingress_rule" "r" {
  for_each          = { for r in local.reglas : r.clave =&gt; r }
  security_group_id = aws_security_group.g[each.value.sg].id
  from_port         = each.value.puerto
  to_port           = each.value.puerto
  ip_protocol       = "tcp"
  cidr_ipv4         = "10.0.0.0/16"
}</div>
     <p>El patrón: <b>flatten</b> para obtener una lista de objetos y una expresión <b>for</b> con una clave única para convertirla en el mapa que pide for_each.</p>`},
 {t:"hueco", p:"Completa el bloque dynamic",
  tpl:"___ \"ingress\" {\n  for_each = var.puertos\n  ___ {\n    from_port = ingress.___\n    to_port   = ingress.value\n    protocol  = \"tcp\"\n  }\n}", banco:["dynamic","content","value","each","for_each","key"], sol:["dynamic","content","value"],
  why:"Sin iterator, el nombre del elemento es el del bloque: ingress.value."},
 {t:"opcion", p:"¿Para qué sirve un bloque <code>dynamic</code>?",
  ops:["Para crear recursos opcionales","Para generar varios bloques anidados (como reglas ingress) a partir de una colección","Para cambiar de provider","Para importar recursos"],
  ok:1, why:"Solo genera bloques anidados dentro de un recurso; para repetir recursos enteros están count y for_each."},
 {t:"opcion", p:"Tienes <code>{ web = { puertos = [80, 443] }, bd = { puertos = [5432] } }</code> y quieres un recurso por puerto. ¿Qué haces?",
  ops:["Un for_each directo sobre var.grupos","flatten para obtener una lista de { sg, puerto } y luego for_each sobre un mapa con clave \"sg-puerto\"","count = 3","Un dynamic dentro de otro dynamic"],
  ok:1, why:"for_each necesita una clave única por instancia: \"web-80\", \"web-443\", \"bd-5432\"."},
 {t:"par", p:"Empareja cada herramienta con lo que repite",
  pares:[["count","Recursos o módulos enteros, por índice"],["for_each","Recursos o módulos enteros, por clave"],["dynamic","Bloques anidados dentro de un recurso"],["expresión for","Valores: listas y mapas"]],
  why:"Elegir la herramienta adecuada es la mitad de un código legible."},
 {t:"vf", p:"Un <code>dynamic</code> con <code>for_each = var.activar ? [1] : []</code> es una forma aceptada de incluir o no un bloque anidado opcional.",
  ok:true, why:"Es un patrón habitual: una lista de un elemento genera el bloque y una vacía no genera nada."},
 {t:"escribe", p:"¿Qué función convierte <code>[[1, 2], [3]]</code> en <code>[1, 2, 3]</code>?",
  sol:["flatten","flatten()"], pista:"«Aplanar», en inglés.",
  why:"Es la pieza clave para pasar de estructuras anidadas a algo que for_each pueda recorrer."}
]}

]});
