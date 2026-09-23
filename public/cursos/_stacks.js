/* =====================================================================
   CATAPPA — stacks
   Los cursos de infraestructura (Docker, Kubernetes, Jenkins…) enseñan
   lo mismo para cualquier lenguaje, pero los ejemplos hay que escribirlos
   en alguno. Aquí está cada stack con sus recetas, y la plataforma las
   sustituye según el que hayas elegido.

   En las guías y en los enunciados se escribe {{stack:dockerfile}},
   {{stack:puerto}}, {{stack:pruebas}}… y se cambia por lo que toque.
   ===================================================================== */
window.STACKS = {

"java-spring": {
  nombre: "Java + Spring Boot", corto: "Java", logo: "spring", color: "#6db33f",
  lenguaje: "Java 21", gestor: "Maven",
  deps: "pom.xml",
  puerto: "8080",
  salud: "/actuator/health",
  instalar: "mvn -B dependency:go-offline",
  pruebas: "mvn test",
  construir: "mvn -B package -DskipTests",
  artefacto: "target/*.jar",
  ejecutar: "java -jar app.jar",
  base: "eclipse-temurin:21-jre-alpine",
  baseBuild: "maven:3.9-eclipse-temurin-21",
  dockerfile:
    "FROM maven:3.9-eclipse-temurin-21 AS build\n" +
    "WORKDIR /app\n" +
    "COPY pom.xml .\n" +
    "RUN mvn -B dependency:go-offline\n" +
    "COPY src ./src\n" +
    "RUN mvn -B package -DskipTests\n" +
    "\n" +
    "FROM eclipse-temurin:21-jre-alpine\n" +
    "WORKDIR /app\n" +
    "RUN addgroup -S app && adduser -S app -G app\n" +
    "COPY --from=build /app/target/*.jar app.jar\n" +
    "EXPOSE 8080\n" +
    "USER app\n" +
    'ENTRYPOINT ["java", "-jar", "app.jar"]',
  nota: "La etapa de construcción lleva Maven y el JDK entero; la final, solo el JRE y tu jar. La diferencia suele ser de 700 MB a 200 MB."
},

"node-express": {
  nombre: "Node.js + Express", corto: "Node", logo: "nodejs", color: "#5fa04e",
  lenguaje: "Node 22", gestor: "npm",
  deps: "package.json",
  puerto: "3000",
  salud: "/salud",
  instalar: "npm ci",
  pruebas: "npm test",
  construir: "npm run build --if-present",
  artefacto: "dist/",
  ejecutar: "node server.js",
  base: "node:22-alpine",
  baseBuild: "node:22-alpine",
  dockerfile:
    "FROM node:22-alpine AS build\n" +
    "WORKDIR /app\n" +
    "COPY package*.json ./\n" +
    "RUN npm ci\n" +
    "COPY . .\n" +
    "RUN npm run build --if-present\n" +
    "\n" +
    "FROM node:22-alpine\n" +
    "WORKDIR /app\n" +
    "ENV NODE_ENV=production\n" +
    "COPY package*.json ./\n" +
    "RUN npm ci --omit=dev\n" +
    "COPY --from=build /app/dist ./dist\n" +
    "EXPOSE 3000\n" +
    "USER node\n" +
    'CMD ["node", "dist/server.js"]',
  nota: "La imagen de Node ya trae un usuario «node» sin privilegios: aprovéchalo en vez de crear otro."
},

"python-django": {
  nombre: "Python + Django", corto: "Django", logo: "python", color: "#092e20",
  lenguaje: "Python 3.12", gestor: "pip",
  deps: "requirements.txt",
  puerto: "8000",
  salud: "/salud/",
  instalar: "pip install -r requirements.txt",
  pruebas: "python manage.py test",
  construir: "python manage.py collectstatic --noinput",
  artefacto: "staticfiles/",
  ejecutar: "gunicorn proyecto.wsgi:application --bind 0.0.0.0:8000",
  base: "python:3.12-slim",
  baseBuild: "python:3.12-slim",
  dockerfile:
    "FROM python:3.12-slim AS build\n" +
    "WORKDIR /app\n" +
    "COPY requirements.txt .\n" +
    "RUN pip install --no-cache-dir --prefix=/instalado -r requirements.txt\n" +
    "\n" +
    "FROM python:3.12-slim\n" +
    "WORKDIR /app\n" +
    "RUN useradd -m app\n" +
    "COPY --from=build /instalado /usr/local\n" +
    "COPY . .\n" +
    "EXPOSE 8000\n" +
    "USER app\n" +
    'CMD ["gunicorn", "proyecto.wsgi:application", "--bind", "0.0.0.0:8000"]',
  nota: "En producción no se usa runserver: va detrás de Gunicorn o uWSGI. Y DEBUG siempre en False."
},

"python-fastapi": {
  nombre: "Python + FastAPI", corto: "FastAPI", logo: "python", color: "#009688",
  lenguaje: "Python 3.12", gestor: "pip",
  deps: "requirements.txt",
  puerto: "8000",
  salud: "/salud",
  instalar: "pip install -r requirements.txt",
  pruebas: "pytest",
  construir: "python -m compileall app",
  artefacto: "app/",
  ejecutar: "uvicorn app.main:app --host 0.0.0.0 --port 8000",
  base: "python:3.12-slim",
  baseBuild: "python:3.12-slim",
  dockerfile:
    "FROM python:3.12-slim AS build\n" +
    "WORKDIR /app\n" +
    "COPY requirements.txt .\n" +
    "RUN pip install --no-cache-dir --prefix=/instalado -r requirements.txt\n" +
    "\n" +
    "FROM python:3.12-slim\n" +
    "WORKDIR /app\n" +
    "RUN useradd -m app\n" +
    "COPY --from=build /instalado /usr/local\n" +
    "COPY app ./app\n" +
    "EXPOSE 8000\n" +
    "USER app\n" +
    'CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]',
  nota: "FastAPI trae documentación automática en /docs: úsala como prueba de humo después de desplegar."
},

"php-laravel": {
  nombre: "PHP + Laravel", corto: "Laravel", logo: "php", color: "#ff2d20",
  lenguaje: "PHP 8.3", gestor: "Composer",
  deps: "composer.json",
  puerto: "8000",
  salud: "/up",
  instalar: "composer install --no-interaction --prefer-dist",
  pruebas: "php artisan test",
  construir: "composer install --no-dev --optimize-autoloader",
  artefacto: "vendor/",
  ejecutar: "php-fpm",
  base: "php:8.3-fpm-alpine",
  baseBuild: "composer:2",
  dockerfile:
    "FROM composer:2 AS build\n" +
    "WORKDIR /app\n" +
    "COPY composer.json composer.lock ./\n" +
    "RUN composer install --no-dev --no-scripts --prefer-dist --no-interaction\n" +
    "COPY . .\n" +
    "RUN composer dump-autoload --optimize\n" +
    "\n" +
    "FROM php:8.3-fpm-alpine\n" +
    "WORKDIR /var/www\n" +
    "RUN docker-php-ext-install pdo_mysql opcache\n" +
    "COPY --from=build /app .\n" +
    "RUN chown -R www-data:www-data storage bootstrap/cache\n" +
    "EXPOSE 9000\n" +
    "USER www-data\n" +
    'CMD ["php-fpm"]',
  nota: "Laravel necesita que storage/ y bootstrap/cache sean escribibles por el usuario del proceso: ese es el fallo número uno al meterlo en un contenedor."
},

"go": {
  nombre: "Go", corto: "Go", logo: "go", color: "#00add8",
  lenguaje: "Go 1.23", gestor: "go mod",
  deps: "go.mod",
  puerto: "8080",
  salud: "/salud",
  instalar: "go mod download",
  pruebas: "go test ./...",
  construir: "CGO_ENABLED=0 go build -ldflags=\"-s -w\" -o app .",
  artefacto: "app",
  ejecutar: "./app",
  base: "gcr.io/distroless/static-debian12",
  baseBuild: "golang:1.23-alpine",
  dockerfile:
    "FROM golang:1.23-alpine AS build\n" +
    "WORKDIR /src\n" +
    "COPY go.mod go.sum ./\n" +
    "RUN go mod download\n" +
    "COPY . .\n" +
    'RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /app .\n' +
    "\n" +
    "FROM gcr.io/distroless/static-debian12\n" +
    "COPY --from=build /app /app\n" +
    "EXPOSE 8080\n" +
    "USER nonroot:nonroot\n" +
    'ENTRYPOINT ["/app"]',
  nota: "Go compila a un binario estático, así que la imagen final no necesita ni sistema operativo. Suele quedarse en 10-20 MB."
},

"dotnet": {
  nombre: ".NET + ASP.NET Core", corto: ".NET", logo: "dotnet", color: "#512bd4",
  lenguaje: ".NET 8", gestor: "NuGet",
  deps: "*.csproj",
  puerto: "8080",
  salud: "/health",
  instalar: "dotnet restore",
  pruebas: "dotnet test",
  construir: "dotnet publish -c Release -o /publicado",
  artefacto: "/publicado",
  ejecutar: "dotnet App.dll",
  base: "mcr.microsoft.com/dotnet/aspnet:8.0-alpine",
  baseBuild: "mcr.microsoft.com/dotnet/sdk:8.0",
  dockerfile:
    "FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build\n" +
    "WORKDIR /src\n" +
    "COPY *.csproj .\n" +
    "RUN dotnet restore\n" +
    "COPY . .\n" +
    "RUN dotnet publish -c Release -o /publicado\n" +
    "\n" +
    "FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine\n" +
    "WORKDIR /app\n" +
    "COPY --from=build /publicado .\n" +
    "EXPOSE 8080\n" +
    "USER $APP_UID\n" +
    'ENTRYPOINT ["dotnet", "App.dll"]',
  nota: "Las imágenes de .NET traen la variable APP_UID con un usuario sin privilegios ya preparado."
},

"ruby-rails": {
  nombre: "Ruby + Rails", corto: "Rails", logo: "ruby", color: "#cc0000",
  lenguaje: "Ruby 3.3", gestor: "Bundler",
  deps: "Gemfile",
  puerto: "3000",
  salud: "/up",
  instalar: "bundle install",
  pruebas: "bundle exec rspec",
  construir: "bundle exec rake assets:precompile",
  artefacto: "public/assets",
  ejecutar: "bundle exec puma -C config/puma.rb",
  base: "ruby:3.3-alpine",
  baseBuild: "ruby:3.3-alpine",
  dockerfile:
    "FROM ruby:3.3-alpine AS build\n" +
    "WORKDIR /app\n" +
    "RUN apk add --no-cache build-base\n" +
    "COPY Gemfile Gemfile.lock ./\n" +
    "RUN bundle config set --local without 'development test' && bundle install\n" +
    "COPY . .\n" +
    "\n" +
    "FROM ruby:3.3-alpine\n" +
    "WORKDIR /app\n" +
    "RUN adduser -D app\n" +
    "COPY --from=build /usr/local/bundle /usr/local/bundle\n" +
    "COPY --from=build /app /app\n" +
    "EXPOSE 3000\n" +
    "USER app\n" +
    'CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]',
  nota: "Las gemas con extensiones nativas necesitan build-base para compilar, pero solo en la etapa de construcción: por eso no aparece en la imagen final."
}

};

/* cursos donde tiene sentido elegir stack (el resto ya tiene lenguaje propio) */
window.CURSOS_CON_STACK = ["docker", "kubernetes", "jenkins", "devops", "terraform", "ansible", "observabilidad", "aws", "seguridad"];
