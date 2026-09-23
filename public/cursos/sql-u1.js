window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Bases de datos relacionales",
resumen: "Qué es una base de datos, tablas, filas y columnas, claves, SQL, PostgreSQL 18, psql y tu primera consulta",
nivel: "Fundamentos",
color: "#5b9bd5",
lecciones: [

{
id:"sq1l1",
titulo:"¿Qué es una base de datos?",
claves:["Una base de datos guarda información de forma organizada, segura y consultable","Un SGBD (PostgreSQL, MySQL) es el programa que la gestiona","Relacional: datos en tablas relacionadas entre sí"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Por qué no guardar todo en ficheros?",
  c:`<p>Imagina una tienda online que guarda sus pedidos en un fichero de texto. Pronto aparecen problemas:</p>
     <ul><li>Dos clientes compran a la vez y uno sobrescribe al otro.</li>
     <li>Para encontrar los pedidos de un cliente hay que leer el fichero entero.</li>
     <li>Si el servidor se apaga a mitad de escritura, el fichero queda corrupto.</li>
     <li>Nada impide guardar un pedido de un cliente que no existe.</li></ul>
     <p>Una <b>base de datos</b> resuelve todo esto: guarda los datos de forma <b>organizada</b>, permite <b>consultarlos</b> rápido, soporta <b>muchos usuarios a la vez</b>, no pierde datos ante fallos y hace cumplir <b>reglas</b>.</p>`},
 {t:"info", eti:"El programa", h:"SGBD",
  c:`<p>El programa que gestiona la base de datos se llama <b>SGBD</b> (Sistema Gestor de Bases de Datos). Es un servidor: tu aplicación se conecta a él por la red y le envía órdenes.</p>
     <ul><li><b>PostgreSQL</b>: libre, muy completo, el favorito actual para proyectos nuevos. Es el que usaremos, en su versión <b>18</b> (la estable desde septiembre de 2025).</li>
     <li><b>MySQL / MariaDB</b>: muy extendido, sobre todo en web.</li>
     <li><b>Oracle</b> y <b>SQL Server</b>: comerciales, habituales en grandes empresas y banca.</li>
     <li><b>SQLite</b>: una base de datos en un fichero, sin servidor. Está dentro de tu móvil y de tu navegador.</li></ul>
     <p>PostgreSQL publica una versión mayor cada año y da soporte a cada una durante <b>cinco años</b>. En producción conviene no quedarse más de dos o tres versiones atrás.</p>`},
 {t:"par", p:"Empareja cada sistema con su descripción",
  pares:[["PostgreSQL","Relacional libre muy completo, favorito para proyectos nuevos"],["MySQL","Relacional libre muy extendido en web"],["Oracle","Relacional comercial típico de grandes empresas"],["SQLite","Base de datos en un fichero, sin servidor"]],
  why:"El SQL que aprendas sirve en todos; cambian detalles y funciones avanzadas."},
 {t:"info", eti:"El modelo", h:"Relacional y NoSQL",
  c:`<p>En una base de datos <b>relacional</b>, los datos se guardan en <b>tablas</b> que se relacionan entre sí (un pedido pertenece a un cliente). Se consultan con <b>SQL</b>.</p>
     <p>Las bases <b>NoSQL</b> usan otros modelos: documentos JSON (MongoDB), clave-valor (Redis), columnas anchas (Cassandra), grafos (Neo4j). Son útiles en casos concretos, pero la relacional sigue siendo la opción por defecto para la mayoría de aplicaciones de negocio. De hecho, PostgreSQL también guarda JSON indexable (<code>jsonb</code>), así que muchas veces cubre las dos necesidades.</p>`},
 {t:"opcion", p:"Tu aplicación de Spring Boot guarda clientes y pedidos con relaciones claras entre ellos. ¿Qué tipo de base de datos es la opción natural?",
  ops:["Un fichero CSV","Una base de datos relacional como PostgreSQL","Una hoja de cálculo","Una caché en memoria"],
  ok:1, why:"Datos estructurados y relacionados, con reglas de integridad: es exactamente para lo que existe el modelo relacional."},
 {t:"opcion", p:"Necesitas guardar sesiones de usuario que caducan a los 30 minutos y se leen miles de veces por segundo por clave. ¿Qué encaja mejor como almacén principal de ese dato?",
  ops:["Una tabla de PostgreSQL con un índice por cada columna","Un almacén clave-valor en memoria como Redis","Un fichero de texto por sesión","Una hoja de cálculo compartida"],
  ok:1, why:"Acceso por clave, caducidad automática y lecturas masivas: el caso típico de Redis. Los datos de negocio siguen en la relacional."},
 {t:"escribe", p:"¿Cuáles son las siglas en español del programa que gestiona una base de datos?",
  sol:["SGBD","sgbd"], pista:"Sistema Gestor de Bases de Datos.",
  why:"En inglés se dice DBMS (Database Management System). PostgreSQL es un SGBD relacional."},
 {t:"vf", p:"Una aplicación se conecta a PostgreSQL por la red, igual que un navegador se conecta a un servidor web.",
  ok:true, why:"PostgreSQL es un servidor que escucha, por defecto, en el puerto 5432."}
]},

{
id:"sq1l2",
titulo:"Tablas, filas y columnas",
claves:["Una tabla representa un tipo de cosa: clientes, pedidos","Cada columna es un dato con un tipo; cada fila es un registro","La clave primaria identifica cada fila de forma única"],
pasos:[
 {t:"info", eti:"La estructura", h:"Una tabla",
  c:`<p>Una <b>tabla</b> se parece a una hoja de cálculo, pero con reglas estrictas:</p>
     <div class="termbox"> id |   nombre     |       email        |  ciudad
----+--------------+--------------------+----------
  1 | Ana Ruiz     | ana@correo.com     | Madrid
  2 | Luis Gómez   | luis@correo.com    | Sevilla
  3 | Marta López  | marta@correo.com   | Madrid</div>
     <ul><li>Cada <b>columna</b> tiene un nombre y un <b>tipo</b> fijo (número, texto, fecha). No puedes meter texto en una columna de números.</li>
     <li>Cada <b>fila</b> (o registro) es un cliente concreto.</li>
     <li>El orden de las filas no está garantizado: si lo necesitas, lo pides.</li></ul>`},
 {t:"par", p:"Empareja cada término con su significado",
  pares:[["Tabla","Conjunto de datos de un mismo tipo de entidad"],["Columna","Un atributo con nombre y tipo"],["Fila","Un registro concreto"],["Esquema","Agrupación de tablas dentro de una base de datos"]],
  why:"En PostgreSQL, las tablas viven dentro de esquemas (por defecto public), y los esquemas dentro de una base de datos."},
 {t:"info", eti:"Identidad", h:"La clave primaria",
  c:`<p>Puede haber dos clientes llamados «Ana Ruiz». ¿Cómo distinguirlos? Con la <b>clave primaria</b> (primary key): una columna, normalmente <code>id</code>, cuyo valor es <b>único</b> y <b>nunca vacío</b> para cada fila.</p>
     <p>Suele ser un número que la base de datos genera sola (1, 2, 3...) o un UUID.</p>
     <div class="dg"><div class="dg-tit">de fuera hacia dentro en postgresql</div>
       <div class="dg-vert">
         <div class="dg-caja base">servidor (clúster)<small>un proceso escuchando en el 5432</small></div>
         <div class="dg-caja">base de datos<small>tienda</small></div>
         <div class="dg-caja">esquema<small>public</small></div>
         <div class="dg-caja acento">tabla<small>clientes: columnas y filas</small></div>
       </div>
     </div>`},
 {t:"opcion", p:"¿Qué característica debe tener una clave primaria?",
  ops:["Ser texto","Ser única y no nula para cada fila","Poder repetirse","Ser la primera columna alfabéticamente"],
  ok:1, why:"Única y obligatoria: así cada fila se identifica sin ambigüedad."},
 {t:"codigo", p:"Tu primera consulta: muestra todas las filas de la tabla clientes",
  lenguaje:"sql",
  c:`<p>Los ejercicios de código de este curso se ejecutan en <b>SQLite</b>, que habla casi el mismo SQL que PostgreSQL. Cuando algo cambie, te avisaremos.</p>
     <p>La plantilla ya crea la tabla y mete tres clientes. <b>No la borres</b>: escribe debajo <code>SELECT * FROM clientes;</code> (el asterisco significa «todas las columnas»). La salida sale con las columnas separadas por <code>|</code>.</p>`,
  plantilla:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT);
INSERT INTO clientes VALUES (1, 'Ana Ruiz', 'Madrid'), (2, 'Luis Gómez', 'Sevilla'), (3, 'Marta López', 'Madrid');

-- escribe aquí tu consulta
`,
  pruebas:[{salida:"1|Ana Ruiz|Madrid\n2|Luis Gómez|Sevilla\n3|Marta López|Madrid"}],
  pista:"SELECT * FROM clientes;",
  solucion:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT);
INSERT INTO clientes VALUES (1, 'Ana Ruiz', 'Madrid'), (2, 'Luis Gómez', 'Sevilla'), (3, 'Marta López', 'Madrid');

SELECT * FROM clientes;
`,
  why:"SELECT * trae todas las columnas en el orden en que se definieron. Pronto aprenderás a elegir columnas y a filtrar filas."},
 {t:"escribe", p:"¿Cómo se llama la columna que identifica cada fila de una tabla de forma única y nunca es nula?",
  sol:["clave primaria","la clave primaria","primary key","pk"], pista:"En inglés, primary key.",
  why:"La clave primaria es la identidad de la fila: las demás tablas la usarán para referirse a ella."},
 {t:"vf", p:"Una tabla devuelve siempre sus filas en el orden en que se insertaron.",
  ok:false, why:"Sin ORDER BY no hay orden garantizado. Es un error común confiar en el orden «natural»: tras un UPDATE o un VACUUM, PostgreSQL puede devolverlas en otro orden."}
]},

{
id:"sq1l3",
titulo:"Relaciones y claves foráneas",
claves:["Una clave foránea apunta a la clave primaria de otra tabla","Así se relacionan las tablas: el pedido guarda el id del cliente","La base de datos impide referencias a filas que no existen"],
pasos:[
 {t:"info", eti:"Relacionar", h:"Pedidos de clientes",
  c:`<p>En vez de repetir el nombre y el email del cliente en cada pedido, el pedido guarda solo el <b>id del cliente</b>:</p>
     <div class="termbox">clientes                       pedidos
 id | nombre                    id | cliente_id |   fecha    | total
----+-----------               ----+------------+------------+-------
  1 | Ana Ruiz                 101 |          1 | 2026-09-01 | 45.90
  2 | Luis Gómez               102 |          1 | 2026-09-03 | 12.00
                               103 |          2 | 2026-09-03 | 89.50</div>
     <p><code>pedidos.cliente_id</code> es una <b>clave foránea</b> (foreign key): apunta a <code>clientes.id</code>. Ana tiene dos pedidos; Luis, uno.</p>`},
 {t:"info", eti:"Integridad", h:"Lo que garantiza la clave foránea",
  c:`<ul><li>No puedes crear un pedido con <code>cliente_id = 99</code> si no existe el cliente 99.</li>
     <li>No puedes borrar a Ana mientras tenga pedidos (salvo que definas qué hacer: borrar en cascada, poner a nulo...).</li></ul>
     <p>A esto se le llama <b>integridad referencial</b>: la base de datos garantiza que las relaciones son coherentes, aunque tu código tenga un bug.</p>
     <div class="nota ojo"><b class="tit">SQLite y las claves foráneas</b>SQLite no comprueba las claves foráneas salvo que actives <code>PRAGMA foreign_keys = ON;</code> en cada conexión. PostgreSQL las comprueba siempre.</div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Clave primaria","Identifica cada fila de su tabla"],["Clave foránea","Apunta a la clave primaria de otra tabla"],["Integridad referencial","Garantía de que las referencias apuntan a filas existentes"],["Relación uno a muchos","Un cliente tiene muchos pedidos"]],
  why:"Las relaciones uno a muchos son las más comunes en cualquier aplicación."},
 {t:"opcion", p:"¿Por qué el pedido guarda <code>cliente_id</code> y no el nombre y el email del cliente?",
  ops:["Para ahorrar una columna","Para no duplicar datos: si el cliente cambia su email, se cambia en un solo sitio","Porque los pedidos no pueden tener texto","Por rendimiento de la red"],
  ok:1, why:"Evitar duplicados es la idea central de la normalización, que verás más adelante."},
 {t:"orden", p:"Ordena estas operaciones para que ninguna falle por la clave foránea <code>pedidos.cliente_id → clientes.id</code>",
  items:["CREATE TABLE clientes","CREATE TABLE pedidos (con REFERENCES clientes)","INSERT del cliente 1","INSERT de un pedido del cliente 1"],
  why:"La tabla referenciada y la fila referenciada tienen que existir antes. Al borrar, el orden es el inverso: primero los pedidos, luego el cliente."},
 {t:"opcion", p:"Intentas borrar a un cliente que tiene pedidos y la clave foránea se definió sin ninguna opción <code>ON DELETE</code>. ¿Qué ocurre en PostgreSQL?",
  ops:["Se borran también sus pedidos","El DELETE falla con un error de violación de clave foránea","Los pedidos quedan apuntando a un cliente inexistente","Se borra el cliente y los pedidos pasan a NULL"],
  ok:1, why:"Por defecto es NO ACTION: se impide dejar huérfanos. CASCADE o SET NULL hay que pedirlos expresamente."},
 {t:"vf", p:"Con una clave foránea definida, la base de datos permite insertar un pedido con un <code>cliente_id</code> que no existe.",
  ok:false, why:"Lo rechaza con un error de violación de clave foránea."}
]},

{
id:"sq1l4",
titulo:"SQL y tu primera conexión",
claves:["SQL es el lenguaje para consultar y modificar bases de datos relacionales","Es declarativo: dices qué quieres, no cómo obtenerlo","psql es el cliente de terminal de PostgreSQL"],
pasos:[
 {t:"info", eti:"El lenguaje", h:"¿Qué es SQL?",
  c:`<p><b>SQL</b> (Structured Query Language) es el lenguaje estándar para hablar con bases de datos relacionales. Es <b>declarativo</b>: describes <b>qué</b> datos quieres y la base de datos decide <b>cómo</b> obtenerlos de la forma más eficiente.</p>
     <div class="termbox">SELECT nombre, email FROM clientes WHERE ciudad = 'Madrid';</div>
     <p>Se lee casi como una frase: «selecciona nombre y email de clientes donde la ciudad sea Madrid». Las palabras clave suelen escribirse en mayúsculas por costumbre, pero no es obligatorio. Cada sentencia termina en <code>;</code>.</p>`},
 {t:"par", p:"Empareja cada familia de SQL con sus órdenes",
  pares:[["Consultar (DQL)","SELECT"],["Modificar datos (DML)","INSERT, UPDATE, DELETE"],["Definir estructura (DDL)","CREATE, ALTER, DROP"],["Permisos (DCL)","GRANT, REVOKE"],["Transacciones","BEGIN, COMMIT, ROLLBACK"]],
  why:"En entrevistas a veces preguntan la diferencia entre DDL y DML."},
 {t:"info", eti:"Practicar", h:"PostgreSQL 18 con Docker y psql",
  c:`<div class="termbox"><span class="cm"># arrancar PostgreSQL 18 en un contenedor</span>
docker run -d --name pg -e POSTGRES_PASSWORD=secreto -p 5432:5432 postgres:18

<span class="cm"># entrar con el cliente psql que viene dentro</span>
docker exec -it pg psql -U postgres</div>
     <p>Órdenes propias de psql (empiezan por barra invertida y no llevan <code>;</code>):</p>
     <div class="termbox">\\l            <span class="cm"># listar bases de datos</span>
\\c tienda     <span class="cm"># conectarse a la base tienda</span>
\\dt           <span class="cm"># listar tablas</span>
\\d clientes   <span class="cm"># describir la tabla clientes</span>
\\x            <span class="cm"># alternar la vista expandida (una columna por línea)</span>
\\timing       <span class="cm"># mostrar cuánto tarda cada consulta</span>
\\q            <span class="cm"># salir</span></div>
     <p>Para trabajar con ventanas, <b>DBeaver</b> o <b>pgAdmin</b> son los clientes gráficos más usados.</p>`},
 {t:"term", p:"Estás en psql. Lista las tablas de la base de datos actual",
  prompt:"tienda=#", sol:["\\dt","\\dt+","\\d"],
  pista:"Barra invertida, d (describe) y t (tablas).",
  salida:`            List of relations
 Schema |     Name      | Type  |  Owner
--------+---------------+-------+----------
 public | clientes      | table | postgres
 public | lineas_pedido | table | postgres
 public | pedidos       | table | postgres
 public | productos     | table | postgres`, why:"Estas cuatro tablas de una tienda online son las que usarás en todo el curso."},
 {t:"term", p:"Describe la estructura de la tabla <code>clientes</code>: columnas, tipos e índices",
  prompt:"tienda=#", sol:["\\d clientes","\\d+ clientes","\\d public.clientes"],
  pista:"La misma orden de antes, seguida del nombre de la tabla.",
  salida:`                               Table "public.clientes"
  Column   |           Type           | Nullable |           Default
-----------+--------------------------+----------+------------------------------
 id        | bigint                   | not null | generated always as identity
 nombre    | text                     | not null |
 email     | text                     | not null |
 ciudad    | text                     |          |
 creado_en | timestamp with time zone | not null | now()
Indexes:
    "clientes_pkey" PRIMARY KEY, btree (id)
    "clientes_email_key" UNIQUE CONSTRAINT, btree (email)`, why:"\\d es lo primero que se hace al llegar a una base de datos desconocida: tipos, restricciones e índices de un vistazo."},
 {t:"codigo", p:"Ejecuta tu primera sentencia: muestra el texto <code>Hola, SQL</code> y el resultado de 21 * 2",
  lenguaje:"sql",
  c:`<p>Un SELECT no necesita tabla para calcular expresiones. Escribe una sola sentencia que devuelva dos columnas: el texto <code>'Hola, SQL'</code> (entre comillas simples) y la multiplicación <code>21 * 2</code>, separadas por coma.</p>`,
  plantilla:`-- escribe aquí tu SELECT
`,
  pruebas:[{salida:"Hola, SQL|42"}],
  pista:"SELECT 'Hola, SQL', 21 * 2;",
  solucion:`SELECT 'Hola, SQL', 21 * 2;
`,
  why:"En PostgreSQL también funciona igual: SELECT sin FROM es útil para probar funciones y expresiones, como SELECT now() o SELECT version()."},
 {t:"opcion", p:"¿Qué significa que SQL sea «declarativo»?",
  ops:["Que hay que declarar variables","Que describes el resultado que quieres y el motor decide cómo conseguirlo","Que solo sirve para crear tablas","Que no admite condiciones"],
  ok:1, why:"El optimizador de consultas elige índices y algoritmos. Por eso la misma consulta puede ir más rápida tras crear un índice sin cambiar ni una letra."},
 {t:"vf", p:"En SQL es obligatorio escribir las palabras clave en mayúsculas.",
  ok:false, why:"SELECT y select funcionan igual. Mayúsculas es solo una convención de legibilidad."}
]}

]});
