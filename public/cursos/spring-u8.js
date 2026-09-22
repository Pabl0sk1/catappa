window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Spring Security",
resumen: "Autenticación y autorización, la cadena de filtros, contraseñas con BCrypt, JWT y OAuth2 Resource Server, roles, CORS y CSRF",
nivel: "Avanzado",
color: "#4a902c",
lecciones: [

{
id:"sp8l1",
titulo:"Autenticación, autorización y la cadena de filtros",
claves:["Autenticación: quién eres; autorización: qué puedes hacer","Spring Security es una cadena de filtros delante de los controladores","Se configura con un bean SecurityFilterChain"],
pasos:[
 {t:"info", eti:"Dos preguntas", h:"Autenticación y autorización",
  c:`<ul><li><b>Autenticación</b>: comprobar la identidad (usuario y contraseña, token, certificado). Si falla: <b>401</b>.</li>
     <li><b>Autorización</b>: decidir si esa identidad puede hacer esa acción. Si no: <b>403</b>.</li></ul>
     <p>Al añadir <code>spring-boot-starter-security</code>, <b>todo queda protegido</b> por defecto. Cada petición atraviesa una <b>cadena de filtros</b> antes de llegar a tu controlador:</p>
     <div class="diag">peticion -&gt; CorsFilter -&gt; CsrfFilter -&gt; BearerTokenAuthenticationFilter
         -&gt; ExceptionTranslationFilter -&gt; AuthorizationFilter -&gt; tu controlador</div>`},
 {t:"info", eti:"Configurar", h:"SecurityFilterChain",
  c:`<div class="termbox">@Configuration
@EnableMethodSecurity
public class SeguridadConfig {

    @Bean
    SecurityFilterChain seguridad(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -&gt; csrf.disable())                       <span class="cm">// API sin estado con tokens</span>
            .sessionManagement(s -&gt; s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -&gt; auth
                .requestMatchers("/actuator/health", "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .oauth2ResourceServer(o -&gt; o.jwt(Customizer.withDefaults()))
            .build();
    }
}</div>`},
 {t:"par", p:"Empareja cada situación con el código de respuesta",
  pares:[["Petición sin token a un endpoint protegido","401 Unauthorized"],["Token válido de un usuario sin el rol necesario","403 Forbidden"],["Endpoint marcado con permitAll()","Pasa sin autenticación"],["Token caducado o con firma inválida","Rechazado por el filtro de autenticación"]],
  why:"401 realmente significa «no autenticado»; 403, «autenticado pero sin permiso»."},
 {t:"opcion", p:"Las reglas <code>requestMatchers</code> se evalúan en orden. ¿Qué pasa si pones <code>anyRequest().authenticated()</code> la primera?",
  ops:["Nada","No compila o las reglas posteriores nunca se aplican: anyRequest debe ir la última","Todo queda público","Se ignora"],
  ok:1, why:"De lo más específico a lo más general, con anyRequest al final."},
 {t:"vf", p:"Al añadir el starter de seguridad sin configurar nada, todos los endpoints quedan protegidos.",
  ok:true, why:"Spring Boot genera un usuario con contraseña aleatoria en el log. Seguro por defecto."}
]},

{
id:"sp8l2",
titulo:"Contraseñas y usuarios",
claves:["Nunca guardes contraseñas en claro ni con hash rápido (MD5, SHA-256)","BCrypt (o Argon2) con sal y coste configurable","UserDetailsService carga el usuario desde tu base de datos"],
pasos:[
 {t:"info", eti:"Guardar bien", h:"PasswordEncoder",
  c:`<div class="termbox">@Bean
PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();   <span class="cm">// bcrypt por defecto</span>
}

<span class="cm">// registro</span>
usuario.setClave(passwordEncoder.encode(peticion.clave()));
<span class="cm">// se guarda algo como {bcrypt}$2a$10$N9qo8uLOickgx2ZMRZoMye...</span>

<span class="cm">// login: Spring compara con matches(), nunca descifrando</span></div>
     <p>Un hash de contraseña es de <b>un solo sentido</b> y deliberadamente <b>lento</b>: si roban la base de datos, probar millones de contraseñas cuesta muchísimo. La <b>sal</b> aleatoria hace que dos contraseñas iguales tengan hashes distintos.</p>`},
 {t:"par", p:"Empareja cada forma de guardar contraseñas con su valoración",
  pares:[["Texto plano","Inaceptable: cualquier filtración las expone"],["MD5 o SHA-256 sin sal","Inseguro: tablas precalculadas y hardware rápido"],["BCrypt o Argon2 con sal","Correcto: lento y con sal por usuario"],["Cifrado reversible con una clave","Mal: si roban la clave, se descifran todas"]],
  why:"Las contraseñas se hashean, no se cifran."},
 {t:"opcion", p:"¿Por qué conviene que el hash de contraseñas sea lento?",
  ops:["Para molestar a los usuarios","Para que un atacante con la base de datos robada tarde muchísimo en probar contraseñas por fuerza bruta","Porque BCrypt no puede ser rápido","Para ahorrar CPU"],
  ok:1, why:"Un login tarda unos ms más; un ataque de miles de millones de intentos se vuelve inviable."},
 {t:"vf", p:"Con BCrypt, dos usuarios con la misma contraseña tienen el mismo hash guardado.",
  ok:false, why:"Cada hash incluye una sal aleatoria distinta."}
]},

{
id:"sp8l3",
titulo:"JWT y OAuth2 Resource Server",
claves:["Un JWT es un token firmado con cabecera, datos (claims) y firma","La API valida la firma y la caducidad sin consultar la base de datos","Con un proveedor de identidad (Keycloak, Auth0, Cognito), tu API es un Resource Server"],
pasos:[
 {t:"info", eti:"Tokens", h:"Qué es un JWT",
  c:`<div class="diag">eyJhbGciOiJSUzI1NiJ9 . eyJzdWIiOiI0MiIsInJvbGVzIjpbIlVTRVIiXSwiZXhwIjoxNzU4NTUwMDAwfQ . firma
   cabecera (algoritmo)          datos: sub=42, roles=[USER], exp=...               firma</div>
     <ul><li>Los datos van en <b>Base64</b>, no cifrados: cualquiera puede leerlos. No metas secretos.</li>
     <li>La <b>firma</b> garantiza que nadie los ha modificado.</li>
     <li><code>exp</code> fija la caducidad: tokens de acceso cortos (5–15 min) y un <b>refresh token</b> para renovarlos.</li></ul>`},
 {t:"info", eti:"Validar", h:"Resource Server en Spring",
  c:`<div class="termbox">spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.miempresa.com/realms/tienda</div>
     <p>Spring descarga las claves públicas del emisor y valida en cada petición: firma, caducidad y emisor. El usuario autenticado está disponible en el controlador:</p>
     <div class="termbox">@GetMapping("/api/yo")
PerfilDto yo(@AuthenticationPrincipal Jwt jwt) { return perfiles.de(jwt.getSubject()); }

@PreAuthorize("hasRole('ADMIN') or #id == authentication.name")
@GetMapping("/api/usuarios/{id}")
UsuarioDto ver(@PathVariable String id) { ... }</div>`},
 {t:"par", p:"Empareja cada parte con su función",
  pares:[["Firma del JWT","Detectar cualquier modificación"],["Claim exp","Fecha de caducidad"],["Claim sub","Identificador del usuario"],["Refresh token","Obtener un nuevo token de acceso sin volver a pedir la contraseña"],["issuer-uri","Quién emite los tokens y dónde están sus claves públicas"]],
  why:"Delegar el login en un proveedor de identidad te da MFA, SSO y recuperación de contraseña sin programarlos."},
 {t:"opcion", p:"Un compañero guarda el número de tarjeta del usuario dentro del JWT «porque está firmado». ¿Qué le dices?",
  ops:["Perfecto","La firma impide modificarlo, pero el contenido es legible por cualquiera (Base64): nunca datos sensibles en un JWT","Solo si es HTTPS","Que lo cifre con MD5"],
  ok:1, why:"Firmado no es cifrado."},
 {t:"vf", p:"Un JWT caducado sigue siendo válido si la firma es correcta.",
  ok:false, why:"El Resource Server rechaza tokens con exp en el pasado (con una pequeña tolerancia de reloj)."}
]},

{
id:"sp8l4",
titulo:"CORS, CSRF y buenas prácticas",
claves:["CORS: el navegador bloquea llamadas entre orígenes salvo que el servidor lo permita","CSRF afecta a sesiones con cookies; una API con tokens en cabecera puede desactivarlo","Autorización a nivel de objeto: comprobar que el recurso pertenece al usuario"],
pasos:[
 {t:"info", eti:"Navegadores", h:"CORS",
  c:`<p>Tu frontend en <code>https://app.catappa.dev</code> llama a <code>https://api.catappa.dev</code>: son <b>orígenes distintos</b>. El navegador pregunta antes (petición <b>preflight</b> OPTIONS) y solo deja pasar la respuesta si la API responde con las cabeceras <code>Access-Control-Allow-*</code> adecuadas.</p>
     <div class="termbox">@Bean
CorsConfigurationSource cors() {
    var c = new CorsConfiguration();
    c.setAllowedOrigins(List.of("https://app.catappa.dev"));
    c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    c.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    var s = new UrlBasedCorsConfigurationSource();
    s.registerCorsConfiguration("/api/**", c);
    return s;
}</div>
     <p>CORS lo aplica el <b>navegador</b>: curl o Postman lo ignoran. No es una medida de seguridad del servidor, es una protección del usuario.</p>`},
 {t:"par", p:"Empareja cada concepto con su descripción",
  pares:[["CORS","El navegador permite o bloquea llamadas entre orígenes"],["Preflight","Petición OPTIONS previa que pregunta si se permite"],["CSRF","Engañar al navegador para enviar una petición con las cookies de la víctima"],["IDOR","Acceder a recursos de otros cambiando el id en la URL"]],
  why:"IDOR (fallo de autorización a nivel de objeto) es el número 1 del OWASP API Top 10."},
 {t:"info", eti:"El fallo más común", h:"Autorización a nivel de objeto",
  c:`<div class="termbox"><span class="cm">// MAL: cualquier usuario autenticado ve cualquier pedido cambiando el id</span>
@GetMapping("/api/pedidos/{id}")
PedidoDto ver(@PathVariable long id) { return servicio.obtener(id); }

<span class="cm">// BIEN: el pedido debe ser del usuario autenticado</span>
PedidoDto ver(@PathVariable long id, @AuthenticationPrincipal Jwt jwt) {
    return servicio.obtenerDeCliente(id, jwt.getSubject());   <span class="cm">// 404 si no es suyo</span>
}</div>`},
 {t:"opcion", p:"Tu frontend recibe «blocked by CORS policy», pero con curl la API responde bien. ¿Qué pasa?",
  ops:["La API está caída","Falta configurar en la API el origen del frontend como permitido; curl no aplica CORS","Hay que desactivar la seguridad","Un problema de DNS"],
  ok:1, why:"Nunca soluciones CORS con allowedOrigins(\"*\") junto con credenciales."},
 {t:"vf", p:"Estar autenticado basta para poder ver cualquier pedido por su id.",
  ok:false, why:"Además de autenticar hay que autorizar cada objeto: que el pedido pertenezca al usuario."}
]},

{
id:"sp8l5",
titulo:"Login propio con JWT",
claves:["Un endpoint de login que valida credenciales con AuthenticationManager y emite un JWT","UserDetailsService carga los usuarios desde tu base de datos","El resto de endpoints validan el token como Resource Server"],
pasos:[
 {t:"info", eti:"Sin proveedor externo", h:"Emitir tus propios tokens",
  c:`<div class="termbox">@Service
class UsuariosDetalle implements UserDetailsService {
    public UserDetails loadUserByUsername(String email) {
        Usuario u = repo.findByEmail(email).orElseThrow(() -&gt; new UsernameNotFoundException(email));
        return User.withUsername(u.getEmail()).password(u.getHashClave()).roles(u.getRol().name()).build();
    }
}

@RestController
class AuthController {
    @PostMapping("/api/auth/login")
    TokenDto login(@Valid @RequestBody Credenciales c) {
        Authentication a = authManager.authenticate(
            UsernamePasswordAuthenticationToken.unauthenticated(c.email(), c.clave()));   // 401 si falla
        Instant ahora = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("tareas-api").subject(a.getName()).issuedAt(ahora)
            .expiresAt(ahora.plus(15, ChronoUnit.MINUTES))
            .claim("roles", a.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
            .build();
        return new TokenDto(jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue());
    }
}</div>`},
 {t:"orden", p:"Ordena el flujo de login con JWT",
  items:["El cliente envía email y contraseña a /api/auth/login","AuthenticationManager usa UserDetailsService y compara el hash con PasswordEncoder","Si es correcto, se firma un JWT con subject, roles y caducidad","El cliente envía el token en Authorization: Bearer en cada petición","El filtro del Resource Server valida firma y caducidad y rellena el SecurityContext"],
  why:"Para producción, delegar en un proveedor (Keycloak, Cognito) te da MFA y recuperación de contraseña."},
 {t:"opcion", p:"¿Qué clave usarías para firmar tus JWT?",
  ops:["Una cadena corta en application.yml","Una clave RSA o EC (o un secreto HMAC largo y aleatorio) guardada en un gestor de secretos y rotada","El nombre de la aplicación","No hace falta firmarlos"],
  ok:1, why:"Con clave asimétrica, otros servicios pueden verificar con la pública sin poder emitir tokens."}
]}

]});
