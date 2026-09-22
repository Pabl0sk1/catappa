window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Transacciones y concurrencia",
resumen: "ACID, BEGIN, COMMIT y ROLLBACK, niveles de aislamiento, MVCC, bloqueos, deadlocks y bloqueo optimista",
nivel: "Avanzado",
color: "#2d5f9c",
lecciones: [

{
id:"sq10l1",
titulo:"Transacciones y ACID",
claves:["Una transacción agrupa operaciones que se aplican todas o ninguna","BEGIN, COMMIT y ROLLBACK","ACID: atomicidad, consistencia, aislamiento y durabilidad"],
pasos:[
 {t:"info", eti:"Todo o nada", h:"El ejemplo de la transferencia",
  c:`<div class="termbox">BEGIN;
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;</div>
     <p>Si el servidor se cae entre los dos UPDATE, sin transacción desaparecerían 100 euros. Con transacción, o se aplican los dos o ninguno. <code>ROLLBACK</code> deshace todo lo hecho desde el <code>BEGIN</code>.</p>
     <p>En Spring, <code>@Transactional</code> hace el BEGIN al entrar en el método y el COMMIT al salir (o ROLLBACK si se lanza una excepción no comprobada).</p>`},
 {t:"par", p:"Empareja cada propiedad ACID con su significado",
  pares:[["Atomicidad","Todas las operaciones o ninguna"],["Consistencia","Se pasa de un estado válido a otro que cumple todas las restricciones"],["Aislamiento","Las transacciones concurrentes no se pisan"],["Durabilidad","Lo confirmado sobrevive a un corte de luz"]],
  why:"Pregunta clásica de entrevista. La durabilidad se consigue con el WAL (registro de escritura anticipada)."},
 {t:"orden", p:"Ordena una actualización segura en producción",
  items:["BEGIN;","SELECT con el mismo WHERE para ver qué filas se tocarán","UPDATE ... WHERE ...;","Comprobar el número de filas afectadas","COMMIT; (o ROLLBACK; si algo no cuadra)"],
  why:"Esta costumbre ha salvado muchas bases de datos."},
 {t:"opcion", p:"Dentro de un <code>BEGIN</code>, ejecutas un DELETE que borra más filas de las esperadas. ¿Qué haces?",
  ops:["COMMIT y restaurar el backup","ROLLBACK: nada se ha confirmado todavía","Cerrar la terminal","Nada, ya está borrado"],
  ok:1, why:"Hasta el COMMIT, nadie más ve los cambios y se pueden deshacer."},
 {t:"vf", p:"En PostgreSQL, las sentencias DDL como CREATE TABLE también pueden deshacerse dentro de una transacción.",
  ok:true, why:"PostgreSQL tiene DDL transaccional (a diferencia de MySQL u Oracle). Muy útil en migraciones."}
]},

{
id:"sq10l2",
titulo:"Aislamiento y MVCC",
claves:["MVCC: cada transacción ve una instantánea; lectores y escritores no se bloquean","Niveles: Read Committed (por defecto), Repeatable Read y Serializable","Anomalías: lecturas no repetibles, filas fantasma, actualizaciones perdidas"],
pasos:[
 {t:"info", eti:"Versiones de filas", h:"MVCC",
  c:`<p>PostgreSQL usa <b>MVCC</b> (control de concurrencia multiversión): un UPDATE no sobrescribe la fila, crea una <b>versión nueva</b>. Cada transacción ve las versiones que le corresponden según su instantánea.</p>
     <p>Consecuencia: <b>las lecturas no bloquean las escrituras ni al revés</b>. Las versiones viejas que ya nadie necesita las limpia <b>VACUUM</b>.</p>`},
 {t:"info", eti:"Niveles", h:"Qué ve cada transacción",
  c:`<ul><li><b>Read Committed</b> (por defecto): cada sentencia ve lo confirmado hasta ese momento. Dos SELECT iguales en la misma transacción pueden dar resultados distintos.</li>
     <li><b>Repeatable Read</b>: toda la transacción ve la misma instantánea, la del principio.</li>
     <li><b>Serializable</b>: el resultado es como si las transacciones se ejecutaran una tras otra. Si detecta un conflicto, aborta una con un error de serialización que hay que <b>reintentar</b>.</li></ul>
     <div class="termbox">BEGIN ISOLATION LEVEL REPEATABLE READ;</div>`},
 {t:"par", p:"Empareja cada anomalía con su descripción",
  pares:[["Lectura sucia","Ver datos de otra transacción no confirmada (PostgreSQL nunca lo permite)"],["Lectura no repetible","Leer dos veces la misma fila y obtener valores distintos"],["Fila fantasma","Repetir una consulta y que aparezcan filas nuevas"],["Actualización perdida","Dos transacciones leen, modifican y guardan; una pisa a la otra"]],
  why:"Saber qué anomalías evita cada nivel es un tema recurrente en entrevistas de backend."},
 {t:"opcion", p:"Dos peticiones leen el stock (5), restan 1 en la aplicación y guardan 4. Resultado: 4 en vez de 3. ¿Cómo lo evitas de la forma más sencilla?",
  ops:["Más réplicas","Hacer la operación atómica en SQL: UPDATE productos SET stock = stock - 1 WHERE id = 7 AND stock > 0","Un SELECT previo","Subir el pool de conexiones"],
  ok:1, why:"La base de datos aplica cada UPDATE sobre el valor actual. Es la solución más simple a la actualización perdida."},
 {t:"vf", p:"Con MVCC, un SELECT largo bloquea los UPDATE de otras transacciones sobre esas filas.",
  ok:false, why:"Los lectores no bloquean a los escritores. Eso sí, una transacción muy larga impide a VACUUM limpiar versiones viejas."}
]},

{
id:"sq10l3",
titulo:"Bloqueos y deadlocks",
claves:["SELECT ... FOR UPDATE bloquea las filas leídas hasta el final de la transacción","Un deadlock ocurre cuando dos transacciones se esperan mutuamente","Evitarlos: orden consistente de acceso, transacciones cortas, reintentos"],
pasos:[
 {t:"info", eti:"Reservar filas", h:"Bloqueo pesimista",
  c:`<div class="termbox">BEGIN;
SELECT stock FROM productos WHERE id = 7 FOR UPDATE;   <span class="cm">-- nadie mas puede modificarla</span>
<span class="cm">-- logica en la aplicacion...</span>
UPDATE productos SET stock = stock - 1 WHERE id = 7;
COMMIT;                                                 <span class="cm">-- libera el bloqueo</span>

<span class="cm">-- colas de trabajos: cada worker coge tareas distintas sin esperar</span>
SELECT id FROM trabajos WHERE estado = 'pendiente'
ORDER BY id LIMIT 10 FOR UPDATE SKIP LOCKED;</div>`},
 {t:"info", eti:"Abrazo mortal", h:"Deadlock",
  c:`<div class="diag">T1: bloquea cuenta 1 ........ quiere cuenta 2 (espera a T2)
T2: bloquea cuenta 2 ........ quiere cuenta 1 (espera a T1)
PostgreSQL lo detecta (~1 s) y aborta una: "deadlock detected"</div>
     <p>Prevención: acceder a las filas siempre en el <b>mismo orden</b> (por ejemplo, por id ascendente), mantener las transacciones <b>cortas</b> y <b>reintentar</b> la que falle.</p>`},
 {t:"par", p:"Empareja cada técnica con su uso",
  pares:[["FOR UPDATE","Bloquear filas que vas a modificar"],["SKIP LOCKED","Colas de trabajo con varios consumidores"],["NOWAIT","Fallar al instante si la fila está bloqueada"],["Columna version","Bloqueo optimista: detectar cambios concurrentes al guardar"]],
  why:"JPA implementa el bloqueo optimista con @Version: UPDATE ... WHERE id = ? AND version = ?."},
 {t:"info", eti:"Sin bloquear", h:"Bloqueo optimista",
  c:`<div class="termbox">UPDATE productos SET precio = 79.90, version = version + 1
WHERE id = 7 AND version = 3;
<span class="cm">-- si devuelve UPDATE 0, alguien lo cambio antes: recargar y reintentar</span></div>
     <p>No bloquea nada mientras el usuario edita; solo comprueba al guardar. Ideal cuando los conflictos son raros.</p>`},
 {t:"opcion", p:"Una transacción hace <code>SELECT ... FOR UPDATE</code> y luego llama a un servicio externo que tarda 30 s. ¿Qué problema causa?",
  ops:["Ninguno","Las filas quedan bloqueadas 30 s: otras peticiones esperan, se acumulan conexiones y pueden llegar timeouts","Se pierde el bloqueo","El servicio va más rápido"],
  ok:1, why:"Nunca hagas llamadas de red lentas dentro de una transacción con bloqueos."}
]}

]});
