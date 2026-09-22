window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "PostgreSQL avanzado y la aplicación",
resumen: "Vistas y vistas materializadas, funciones y triggers, JSONB, búsqueda de texto, particionado, JDBC, pools y el problema N+1",
nivel: "Experto",
color: "#27538c",
lecciones: [

{
id:"sq11l1",
titulo:"Vistas, funciones y triggers",
claves:["Una vista es una consulta guardada con nombre","Una vista materializada guarda el resultado y se refresca","Funciones en PL/pgSQL y triggers que reaccionan a cambios"],
pasos:[
 {t:"info", eti:"Reutilizar consultas", h:"Vistas",
  c:`<div class="termbox">CREATE VIEW ventas_por_cliente AS
SELECT c.id, c.nombre, COUNT(p.id) AS pedidos, COALESCE(SUM(p.total), 0) AS gastado
FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nombre;

SELECT * FROM ventas_por_cliente WHERE gastado &gt; 500;

<span class="cm">-- materializada: guarda el resultado; ideal para informes costosos</span>
CREATE MATERIALIZED VIEW resumen_mensual AS SELECT ...;
REFRESH MATERIALIZED VIEW CONCURRENTLY resumen_mensual;</div>`},
 {t:"info", eti:"Lógica en la base de datos", h:"Funciones y triggers",
  c:`<div class="termbox">CREATE FUNCTION tocar_actualizado() RETURNS trigger AS $$
BEGIN
  NEW.actualizado_en := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_productos_actualizado
BEFORE UPDATE ON productos
FOR EACH ROW EXECUTE FUNCTION tocar_actualizado();</div>
     <p>Útiles para auditoría, marcas de tiempo o mantener datos desnormalizados. Con moderación: la lógica escondida en triggers es difícil de seguir y de probar.</p>`},
 {t:"par", p:"Empareja cada objeto con su uso",
  pares:[["Vista","Consulta con nombre, siempre actualizada"],["Vista materializada","Resultado guardado que se refresca periódicamente"],["Función PL/pgSQL","Lógica procedimental dentro de la base de datos"],["Trigger","Ejecutar una función automáticamente al insertar, actualizar o borrar"]],
  why:"Una vista materializada con un índice puede convertir un informe de 20 s en uno de 20 ms."},
 {t:"vf", p:"Una vista normal guarda una copia de los datos que hay que refrescar.",
  ok:false, why:"Una vista normal se ejecuta cada vez que se consulta. La que guarda datos es la materializada."}
]},

{
id:"sq11l2",
titulo:"JSONB, texto completo y particionado",
claves:["jsonb guarda documentos JSON indexables con GIN","Operadores -> (JSON), ->> (texto) y @> (contiene)","Particionar divide una tabla enorme en trozos por rango o lista"],
pasos:[
 {t:"info", eti:"Documentos", h:"JSONB",
  c:`<div class="termbox">ALTER TABLE productos ADD COLUMN atributos jsonb NOT NULL DEFAULT '{}';
UPDATE productos SET atributos = '{"color":"negro","switches":"red","inalambrico":false}' WHERE id = 1;

SELECT nombre, atributos-&gt;&gt;'color' AS color FROM productos;
SELECT * FROM productos WHERE atributos @&gt; '{"inalambrico": true}';
CREATE INDEX idx_atributos ON productos USING gin (atributos);</div>
     <p>JSONB es perfecto para atributos variables (cada categoría de producto tiene los suyos). Pero si una propiedad se consulta y filtra siempre, suele merecer su propia columna.</p>`},
 {t:"par", p:"Empareja cada operador de JSONB con su resultado",
  pares:[["atributos->'color'","El valor como JSON"],["atributos->>'color'","El valor como texto"],["atributos @> '{\"color\":\"negro\"}'","¿Contiene ese fragmento?"],["atributos ? 'color'","¿Existe esa clave?"]],
  why:"@> con un índice GIN es muy rápido incluso en millones de filas."},
 {t:"info", eti:"Buscar texto", h:"Búsqueda de texto completo",
  c:`<div class="termbox">SELECT titulo FROM articulos
WHERE to_tsvector('spanish', titulo || ' ' || cuerpo) @@ plainto_tsquery('spanish', 'contenedores docker');</div>
     <p>Entiende idioma (plurales, raíces de palabras) y puede ordenar por relevancia. Para muchas aplicaciones evita montar un Elasticsearch aparte.</p>`},
 {t:"info", eti:"Tablas gigantes", h:"Particionado",
  c:`<div class="termbox">CREATE TABLE eventos (id bigint, creado_en timestamptz NOT NULL, datos jsonb)
PARTITION BY RANGE (creado_en);
CREATE TABLE eventos_2026_09 PARTITION OF eventos
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');</div>
     <p>Las consultas con filtro de fecha solo leen las particiones necesarias, y borrar datos antiguos es un <code>DROP TABLE</code> instantáneo de una partición en lugar de un DELETE masivo.</p>`},
 {t:"opcion", p:"Guardas 2.000 millones de eventos y cada mes borras los de hace un año, lo que tarda horas y genera mucha carga. ¿Qué propones?",
  ops:["Un índice más","Particionar por mes y eliminar la partición antigua con DROP o DETACH","VACUUM FULL cada día","Más CPU"],
  ok:1, why:"Es el caso de uso por excelencia del particionado."}
]},

{
id:"sq11l3",
titulo:"SQL desde la aplicación",
claves:["Consultas parametrizadas siempre: nunca concatenar entrada del usuario","Pool de conexiones (HikariCP) dimensionado con cabeza","El problema N+1 de los ORM y cómo detectarlo"],
pasos:[
 {t:"info", eti:"Seguridad", h:"Inyección SQL",
  c:`<div class="termbox"><span class="cm">// MAL: concatenar</span>
String sql = "SELECT * FROM clientes WHERE email = '" + email + "'";
<span class="cm">// si email = ' OR '1'='1  -> devuelve TODOS los clientes</span>

<span class="cm">// BIEN: parametro</span>
PreparedStatement ps = con.prepareStatement("SELECT * FROM clientes WHERE email = ?");
ps.setString(1, email);</div>
     <p>Con JPA/Spring Data (<code>findByEmail</code>, <code>@Query</code> con <code>:email</code>) los parámetros ya van separados. El peligro está en construir SQL con cadenas a mano.</p>`},
 {t:"info", eti:"El clásico de JPA", h:"El problema N+1",
  c:`<div class="termbox"><span class="cm">// 1 consulta para los pedidos...</span>
List&lt;Pedido&gt; pedidos = pedidoRepo.findAll();
for (Pedido p : pedidos) {
    p.getCliente().getNombre();   <span class="cm">// ...y 1 consulta MAS por cada pedido</span>
}
<span class="cm">// 100 pedidos = 101 consultas</span></div>
     <p>Soluciones: <code>JOIN FETCH</code> en la consulta, <code>@EntityGraph</code>, o consultas de proyección con solo lo necesario. Para detectarlo: activar el log de SQL en desarrollo y contar consultas por petición.</p>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["Inyección SQL","Consultas parametrizadas"],["N+1 consultas","JOIN FETCH o @EntityGraph"],["Abrir una conexión por petición","Pool de conexiones (HikariCP)"],["Demasiadas conexiones a PostgreSQL","Pool más pequeño o PgBouncer delante"]],
  why:"Estos cuatro problemas aparecen en casi todas las aplicaciones Spring que empiezan a crecer."},
 {t:"opcion", p:"Tienes 20 réplicas de tu API, cada una con un pool de 50 conexiones, y PostgreSQL tiene <code>max_connections = 200</code>. ¿Qué pasa?",
  ops:["Nada","Pueden pedirse hasta 1.000 conexiones: se agotan y aparecen errores. Hay que reducir el pool o poner PgBouncer","PostgreSQL escala solo","Se reparten automáticamente"],
  ok:1, why:"Cada conexión de PostgreSQL es un proceso con su memoria. Un pool pequeño (10 o menos por instancia) suele rendir mejor."},
 {t:"vf", p:"Usar un ORM como Hibernate elimina la necesidad de entender el SQL que se genera.",
  ok:false, why:"Los peores problemas de rendimiento (N+1, cargas masivas, consultas sin índice) vienen de no mirar el SQL generado."}
]}

]});
