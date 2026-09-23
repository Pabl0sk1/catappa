window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Diseño de bases de datos",
resumen: "Modelado entidad-relación, tipos de relaciones, normalización hasta 3FN, claves naturales y sustitutas, y cuándo desnormalizar",
nivel: "Intermedio",
color: "#3b77b4",
lecciones: [

{
id:"sq7l1",
titulo:"Modelar entidades y relaciones",
claves:["Entidades (tablas), atributos (columnas) y relaciones (claves foráneas)","Uno a uno, uno a muchos y muchos a muchos","Muchos a muchos se resuelve con una tabla intermedia"],
pasos:[
 {t:"info", eti:"Antes de escribir SQL", h:"Pensar el modelo",
  c:`<p>Diseñar la base de datos empieza con preguntas de negocio: ¿qué <b>cosas</b> existen (entidades)?, ¿qué <b>datos</b> tiene cada una (atributos)?, ¿cómo se <b>relacionan</b>?</p>
     <div class="dg"><div class="dg-tit">diagrama entidad-relación de una tienda</div>
       <svg viewBox="0 0 340 240" width="100%" style="max-width:460px;display:block;margin:auto" role="img" aria-label="CLIENTE 1 a N PEDIDO; PEDIDO 1 a N LINEA_PEDIDO; LINEA_PEDIDO N a 1 PRODUCTO; PRODUCTO N a 1 CATEGORIA">
         <g stroke="var(--line-2)" stroke-width="2">
           <line x1="140" y1="38" x2="200" y2="38"/>
           <line x1="260" y1="56" x2="260" y2="110"/>
           <line x1="260" y1="146" x2="260" y2="190"/>
           <line x1="200" y1="208" x2="140" y2="208"/>
         </g>
         <g fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5">
           <rect x="20" y="20" width="120" height="36" rx="6"/>
           <rect x="200" y="20" width="120" height="36" rx="6"/>
           <rect x="200" y="110" width="120" height="36" rx="6"/>
           <rect x="200" y="190" width="120" height="36" rx="6"/>
           <rect x="20" y="190" width="120" height="36" rx="6"/>
         </g>
         <g font-family="var(--mono)" font-size="13" fill="var(--ink)" text-anchor="middle">
           <text x="80" y="43">CLIENTE</text>
           <text x="260" y="43">PEDIDO</text>
           <text x="260" y="133">LINEA_PEDIDO</text>
           <text x="260" y="213">PRODUCTO</text>
           <text x="80" y="213">CATEGORIA</text>
         </g>
         <g font-family="var(--mono)" font-size="13" font-weight="700" fill="var(--accent)">
           <text x="146" y="32">1</text>
           <text x="194" y="32" text-anchor="end">N</text>
           <text x="268" y="72">1</text>
           <text x="268" y="104">N</text>
           <text x="268" y="162">N</text>
           <text x="268" y="184">1</text>
           <text x="194" y="202" text-anchor="end">N</text>
           <text x="146" y="202">1</text>
         </g>
         <text x="20" y="120" font-family="var(--sans)" font-size="12" fill="var(--ink-3)">1 ─ N: uno a muchos</text>
       </svg>
     </div>
     <p>Esto es un diagrama <b>entidad-relación</b> (ER). Herramientas como dbdiagram.io o DBeaver lo dibujan a partir de las tablas.</p>`},
 {t:"par", p:"Empareja cada relación con su ejemplo y su implementación",
  pares:[["Uno a uno","Usuario y su perfil: clave foránea UNIQUE"],["Uno a muchos","Cliente y pedidos: clave foránea en el lado «muchos»"],["Muchos a muchos","Pedidos y productos: tabla intermedia con dos claves foráneas"],["Jerarquía","Categoría y subcategoría: clave foránea a la misma tabla"]],
  why:"En JPA se corresponden con @OneToOne, @OneToMany/@ManyToOne y @ManyToMany."},
 {t:"info", eti:"Muchos a muchos", h:"La tabla intermedia",
  c:`<div class="termbox">CREATE TABLE lineas_pedido (
    pedido_id       bigint NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id     bigint NOT NULL REFERENCES productos(id),
    cantidad        integer NOT NULL CHECK (cantidad &gt; 0),
    precio_unitario numeric(10,2) NOT NULL,
    PRIMARY KEY (pedido_id, producto_id)
);</div>
     <p>Además de unir, la tabla intermedia guarda datos <b>de la relación</b>: la cantidad y el precio en el momento de la compra (el precio del producto puede cambiar mañana). Su clave primaria es <b>compuesta</b>.</p>`},
 {t:"opcion", p:"¿Por qué <code>lineas_pedido</code> guarda <code>precio_unitario</code> si el producto ya tiene precio?",
  ops:["Es un error de diseño","Porque el precio del producto puede cambiar, y el pedido debe conservar el precio al que se vendió","Por rendimiento","Para ocupar más"],
  ok:1, why:"Es un dato histórico de la venta, no una duplicación. Distinguir ambos casos es parte de diseñar bien."},
 {t:"vf", p:"<code>ON DELETE CASCADE</code> en <code>lineas_pedido.pedido_id</code> hace que al borrar un pedido se borren sus líneas.",
  ok:true, why:"Tiene sentido cuando las filas hijas no existen sin el padre. Úsalo con criterio."}
]},

{
id:"sq7l2",
titulo:"Normalización",
claves:["Normalizar es organizar para no duplicar datos y evitar anomalías","1FN: valores atómicos; 2FN: todo depende de la clave entera; 3FN: nada depende de otra columna no clave","«Cada dato en un solo sitio»"],
pasos:[
 {t:"info", eti:"El problema", h:"Una tabla mal diseñada",
  c:`<div class="termbox"> pedido | cliente  | email_cliente  | ciudad_cliente | productos
--------+----------+----------------+----------------+------------------------
    101 | Ana Ruiz | ana@correo.com | Madrid         | Teclado, Ratón
    102 | Ana Ruiz | ana@correo.com | Madrid         | Monitor</div>
     <p>Problemas (<b>anomalías</b>):</p>
     <ul><li><b>Actualización</b>: si Ana cambia de email, hay que cambiarlo en muchas filas; si se olvida una, hay datos contradictorios.</li>
     <li><b>Inserción</b>: no puedes dar de alta un cliente que aún no ha comprado.</li>
     <li><b>Borrado</b>: si borras su único pedido, pierdes al cliente.</li>
     <li>«Teclado, Ratón» en una celda: imposible buscar o contar bien.</li></ul>`},
 {t:"info", eti:"Las formas normales", h:"1FN, 2FN y 3FN",
  c:`<ul><li><b>1FN</b>: cada celda tiene un solo valor (nada de listas separadas por comas) y hay clave primaria.</li>
     <li><b>2FN</b>: con clave compuesta, cada columna depende de la clave <b>entera</b>, no de una parte. En <code>lineas_pedido(pedido_id, producto_id)</code>, el nombre del producto depende solo de producto_id: va a la tabla productos.</li>
     <li><b>3FN</b>: ninguna columna depende de otra columna que no sea clave. En pedidos, <code>email_cliente</code> depende de cliente, no del pedido: va a la tabla clientes.</li></ul>
     <p>Resumen que se suele citar: cada columna depende «de la clave, de toda la clave y de nada más que la clave».</p>`},
 {t:"par", p:"Empareja cada problema con la forma normal que lo corrige",
  pares:[["Una celda con «Teclado, Ratón»","1FN"],["Nombre del producto en la tabla de líneas con clave compuesta","2FN"],["Email del cliente guardado en cada pedido","3FN"]],
  why:"En la práctica, llegar a 3FN es el objetivo habitual para datos transaccionales."},
 {t:"opcion", p:"¿Qué anomalía se produce si el email del cliente se repite en cada pedido?",
  ops:["Ninguna","De actualización: al cambiar el email hay que tocar muchas filas y pueden quedar inconsistentes","Solo ocupa más","Es más rápido"],
  ok:1, why:"La duplicación no es solo espacio: es riesgo de datos contradictorios."},
 {t:"vf", p:"Guardar una lista de etiquetas separadas por comas en una columna de texto cumple la primera forma normal.",
  ok:false, why:"Viola 1FN. Lo normal es una tabla de etiquetas y una intermedia (o, en PostgreSQL, un array o jsonb con criterio)."}
]},

{
id:"sq7l3",
titulo:"Claves y desnormalización",
claves:["Clave sustituta (id generado) frente a clave natural (email, DNI)","Suele preferirse id sustituto + UNIQUE en la clave natural","Desnormalizar a propósito para leer más rápido, sabiendo el coste"],
pasos:[
 {t:"info", eti:"Elegir la clave", h:"Natural o sustituta",
  c:`<ul><li><b>Clave natural</b>: un dato del mundo real que ya es único (email, ISBN, matrícula). Problema: puede cambiar (la gente cambia de email) y a veces no es tan única como parece.</li>
     <li><b>Clave sustituta</b>: un identificador sin significado (bigint identity o UUID). Nunca cambia.</li></ul>
     <p>Práctica habitual: <b>id sustituto como PRIMARY KEY</b> y la clave natural con <b>UNIQUE</b>.</p>
     <p>¿bigint o UUID? bigint es compacto y rápido; UUID no revela cuántos registros tienes y se puede generar en la aplicación. UUIDv7 (ordenado por tiempo) combina lo mejor de ambos para índices.</p>`},
 {t:"opcion", p:"¿Por qué no usar el email como clave primaria de clientes?",
  ops:["Porque es texto","Porque puede cambiar, y habría que actualizar todas las claves foráneas que lo referencian","Porque no es único","No hay ningún problema"],
  ok:1, why:"La clave primaria debe ser estable. El email va como UNIQUE."},
 {t:"info", eti:"Romper reglas con criterio", h:"Desnormalizar",
  c:`<p>A veces se duplica información <b>a propósito</b> para leer más rápido:</p>
     <ul><li>Guardar <code>total</code> en pedidos aunque se pueda calcular sumando las líneas.</li>
     <li>Un contador <code>num_comentarios</code> en la tabla de posts.</li>
     <li>Tablas o vistas materializadas para informes.</li></ul>
     <p>El precio: hay que mantener la copia sincronizada (en la misma transacción, con triggers o con procesos). Primero normaliza; desnormaliza cuando <b>midas</b> que hace falta.</p>`},
 {t:"par", p:"Empareja cada decisión con su justificación",
  pares:[["id bigint como clave primaria","Estable, compacto y rápido"],["UNIQUE en email","Impedir duplicados de la clave natural"],["total guardado en pedidos","Desnormalización para no sumar líneas en cada lectura"],["UUID como identificador público","No revela cuántos registros hay"]],
  why:"Cada decisión de diseño tiene un porqué que conviene saber explicar en voz alta."},
 {t:"vf", p:"Desnormalizar siempre mejora el rendimiento sin inconvenientes.",
  ok:false, why:"Acelera lecturas a costa de escrituras más complejas y riesgo de inconsistencias."}
]}

]});
