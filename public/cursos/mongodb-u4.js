window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Maestría: entrevista de MongoDB",
resumen: "Cuándo elegir MongoDB, errores de modelado típicos y simulacro final",
nivel: "Maestro",
color: "#428c3e",
lecciones: [

{
id:"mg4l1",
titulo:"Simulacro de entrevista de MongoDB",
claves:["Sabes cuándo encaja una base de documentos y cuándo no","Modelas según los patrones de acceso","Conoces índices, agregaciones, réplicas y sharding"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿MongoDB o PostgreSQL para un nuevo sistema de pedidos?»",
  ops:["MongoDB siempre","Depende: PostgreSQL si hay muchas relaciones, transacciones e informes flexibles; MongoDB si los datos son documentos autocontenidos con estructura variable y se leen enteros. PostgreSQL con jsonb cubre muchos casos mixtos","PostgreSQL nunca escala","Da igual"],
  ok:1, why:"Una respuesta con criterio, no de moda."},
 {t:"opcion", p:"«¿Cómo modelarías usuarios y sus pedidos?»",
  ops:["Todos los pedidos dentro del usuario","Colecciones separadas con clienteId en cada pedido (e índice), embebiendo en el pedido las líneas y una copia de los datos de envío","Una colección por pedido","Todo en un único documento global"],
  ok:1, why:"Los pedidos crecen sin límite: se referencian; las líneas se embeben."},
 {t:"opcion", p:"«Una consulta va lenta. ¿Qué haces?»",
  ops:["Reiniciar","explain(\"executionStats\") para ver si hay COLLSCAN y cuántos documentos examina, crear el índice adecuado (regla ESR) y revisar el modelado","Subir la memoria","Cambiar a SQL"],
  ok:1, why:"El mismo método que con PostgreSQL."},
 {t:"par", p:"Empareja cada error de modelado con su corrección",
  pares:[["Arrays que crecen sin límite","Colección aparte con referencia"],["Consultas sin índice","Índices diseñados según las consultas"],["Clave de shard monótona","Clave con buen reparto (hashed o compuesta)"],["Escrituras que pueden perderse","writeConcern majority"],["Validación inexistente","JSON Schema en la colección"]],
  why:"Esquema flexible no significa sin esquema."},
 {t:"info", eti:"Terminado", h:"Has completado MongoDB",
  c:`<p>Dominas documentos y colecciones, CRUD, modelado embebido y referenciado, índices, agregaciones, transacciones, réplicas y sharding.</p>
     <p>Para consolidarlo: modela un catálogo de productos con atributos variables en MongoDB con Spring Data, crea los índices para sus consultas principales y escribe una agregación de ventas por categoría.</p>`}
]}

]});
