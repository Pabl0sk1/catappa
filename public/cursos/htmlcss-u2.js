window.CURSOS = window.CURSOS || {};
(CURSOS.htmlcss = CURSOS.htmlcss || []).push({
titulo: "HTML semántico y formularios",
resumen: "Etiquetas con significado, estructura de una página, formularios y sus controles, validación nativa y accesibilidad",
nivel: "Fundamentos",
color: "#f0875a",
lecciones: [

{
id:"hc2l1",
titulo:"HTML semántico",
claves:["Usa la etiqueta que describe el contenido: header, nav, main, article, section, aside, footer","El HTML semántico ayuda a buscadores, lectores de pantalla y mantenimiento","Un botón es button y un enlace es a: no divs con onclick"],
pasos:[
 {t:"info", eti:"Significado", h:"Estructura de una página",
  c:`<div class="termbox">&lt;header&gt;
  &lt;nav&gt;&lt;a href="/"&gt;Inicio&lt;/a&gt; &lt;a href="/cursos"&gt;Cursos&lt;/a&gt;&lt;/nav&gt;
&lt;/header&gt;
&lt;main&gt;
  &lt;article&gt;
    &lt;h1&gt;Cómo funciona Docker&lt;/h1&gt;
    &lt;section&gt;&lt;h2&gt;Imágenes&lt;/h2&gt;...&lt;/section&gt;
    &lt;section&gt;&lt;h2&gt;Contenedores&lt;/h2&gt;...&lt;/section&gt;
  &lt;/article&gt;
  &lt;aside&gt;Lecturas relacionadas&lt;/aside&gt;
&lt;/main&gt;
&lt;footer&gt;© 2026 Catappa&lt;/footer&gt;</div>
     <p>Con <code>&lt;div&gt;</code> para todo, la página se ve igual, pero un lector de pantalla no sabe dónde está la navegación ni el contenido principal, y un buscador entiende peor la página.</p>`},
 {t:"par", p:"Empareja cada etiqueta semántica con su contenido",
  pares:[["<header>","Cabecera de la página o de una sección"],["<nav>","Bloque de navegación principal"],["<main>","Contenido principal (uno por página)"],["<article>","Contenido independiente: una entrada, una noticia"],["<footer>","Pie con información secundaria"]],
  why:"div y span siguen siendo útiles cuando no hay una etiqueta con significado."},
 {t:"opcion", p:"¿Qué es mejor para una acción que no navega a otra página, como «Guardar»?",
  ops:["&lt;div onclick=...&gt;Guardar&lt;/div&gt;","&lt;button type=\"button\"&gt;Guardar&lt;/button&gt;","&lt;a href=\"#\"&gt;Guardar&lt;/a&gt;","&lt;span&gt;Guardar&lt;/span&gt;"],
  ok:1, why:"button es accesible por teclado, se anuncia como botón y tiene comportamiento nativo."}
]},

{
id:"hc2l2",
titulo:"Formularios",
claves:["form agrupa los campos; cada input con su label asociado","Tipos de input: text, email, password, number, date, checkbox, radio...","Validación nativa: required, minlength, pattern, min, max"],
pasos:[
 {t:"info", eti:"Recoger datos", h:"Un formulario accesible",
  c:`<div class="termbox">&lt;form action="/api/registro" method="post"&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input id="email" name="email" type="email" required autocomplete="email"&gt;

  &lt;label for="clave"&gt;Contraseña&lt;/label&gt;
  &lt;input id="clave" name="clave" type="password" required minlength="12"
         autocomplete="new-password" aria-describedby="ayuda-clave"&gt;
  &lt;p id="ayuda-clave"&gt;Mínimo 12 caracteres.&lt;/p&gt;

  &lt;label&gt;&lt;input type="checkbox" name="boletin"&gt; Quiero recibir novedades&lt;/label&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;Plan&lt;/legend&gt;
    &lt;label&gt;&lt;input type="radio" name="plan" value="gratis" checked&gt; Gratis&lt;/label&gt;
    &lt;label&gt;&lt;input type="radio" name="plan" value="pro"&gt; Pro&lt;/label&gt;
  &lt;/fieldset&gt;

  &lt;button type="submit"&gt;Crear cuenta&lt;/button&gt;
&lt;/form&gt;</div>`},
 {t:"par", p:"Empareja cada tipo de input con su uso",
  pares:[["type=\"email\"","Email, con teclado adaptado en móvil y validación básica"],["type=\"password\"","Oculta lo que se escribe"],["type=\"number\"","Números con flechas y límites"],["type=\"checkbox\"","Opciones independientes de sí o no"],["type=\"radio\"","Elegir una opción de un grupo (mismo name)"]],
  why:"El tipo correcto mejora la experiencia en móvil gratis."},
 {t:"opcion", p:"¿Para qué sirve asociar un <code>&lt;label for=\"email\"&gt;</code> al input con <code>id=\"email\"</code>?",
  ops:["Por estética","El lector de pantalla anuncia el campo con su nombre y al pulsar la etiqueta se enfoca el campo","Para enviarlo al servidor","No sirve para nada"],
  ok:1, why:"Un placeholder no sustituye a la etiqueta: desaparece al escribir."},
 {t:"vf", p:"La validación nativa del navegador (required, minlength) hace innecesaria la validación en el servidor.",
  ok:false, why:"Cualquiera puede saltársela. Es una ayuda para el usuario; el servidor siempre valida."}
]}

]});
