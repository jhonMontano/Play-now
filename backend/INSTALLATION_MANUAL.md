# Manual de Instalación - PlayNow Backend

## Descripción General
PlayNow es una aplicación backend desarrollada con Node.js, Express y PostgreSQL que gestiona reservas de canchas deportivas. Este manual te guiará a través del proceso de instalación y configuración.

---

## Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación sin Docker](#instalación-sin-docker)
3. [Instalación con Docker](#instalación-con-docker)
4. [Variables de Entorno](#variables-de-entorno)
5. [Verificación de la Instalación](#verificación-de-la-instalación)
6. [Scripts Disponibles](#scripts-disponibles)
7. [Solución de Problemas](#solución-de-problemas)

---

## Requisitos Previos

Antes de instalar PlayNow, asegúrate de tener instalado:

### Opción 1: Instalación Local Tradicional
- **Node.js**: v18.x o superior ([Descargar](https://nodejs.org/))
- **npm**: v8.x o superior (incluido con Node.js)
- **PostgreSQL**: v12.x o superior ([Descargar](https://www.postgresql.org/download/))
- **Git**: v2.x o superior ([Descargar](https://git-scm.com/))

### Opción 2: Instalación con Docker
- **Docker**: v20.x o superior ([Descargar](https://www.docker.com/products/docker-desktop))
- **Docker Compose**: v1.29 o superior (incluido con Docker Desktop)

### Verificar instalación

```bash
# Node.js y npm
node --version
npm --version

# PostgreSQL (solo si instalas localmente)
psql --version

# Docker (si usas Docker)
docker --version
docker-compose --version
```

---

## Instalación sin Docker

### Paso 1: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd PlayNow/backend
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Base de Datos PostgreSQL

#### Windows:
1. Abre pgAdmin 4 (interfaz gráfica de PostgreSQL)
2. Crea una nueva base de datos llamada `playnow`
3. Anota el usuario y contraseña (por defecto: postgres/postgres)

#### MacOS y Linux:
```bash
# Inicia PostgreSQL
sudo systemctl start postgresql

# Conecta a PostgreSQL
sudo -u postgres psql

# Dentro de la consola psql:
CREATE DATABASE playnow;
\q
```

### Paso 4: Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/`:

```bash
# Configuración del Servidor
PORT=4000
NODE_ENV=development

# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=admin123
DB_NAME=playnow
DB_PORT=5432

# Configuración de JWT
JWT_SECRET=supersecreto123

# Configuración de Email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_app
MAIL_FROM=tu_email@gmail.com
```

### Paso 5: Iniciar la Aplicación

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:4000`

---

## Instalación con Docker

### Paso 1: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd PlayNow/backend
```

### Paso 2: Asegurar que Docker Compose está Actualizado

```bash
# Opcional: actualizar Docker composition
docker-compose --version
```

### Paso 3: Construir y Levantar los Contenedores

```bash
# Construir las imágenes y crear los contenedores
docker-compose up --build

# O en modo background (sin ver los logs)
docker-compose up -d --build
```

### Paso 4: Verificar que Todo Funciona

```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs del backend
docker-compose logs backend

# Ver logs de la base de datos
docker-compose logs db
```

### Paso 5: Acceder a la Aplicación

El servidor estará disponible en: `http://localhost:4000`

Para ver la documentación de Swagger:
```
http://localhost:4000/api-docs
```

### Detener los Contenedores

```bash
# Parar los contenedores
docker-compose stop

# Parar y eliminar los contenedores
docker-compose down

# Parar y eliminar todo incluyendo volúmenes (CUIDADO: borra la BD)
docker-compose down -v
```

---

## 🔐 Variables de Entorno

### Descripción de Cada Variable

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto donde corre el servidor | `4000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `DB_HOST` | Host del servidor PostgreSQL | `localhost` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `admin123` |
| `DB_NAME` | Nombre de la base de datos | `playnow` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `JWT_SECRET` | Clave secreta para tokens JWT | `supersecreto123` |

### Archivo .env Completo (con Docker)

```env
# Configuración del Servidor
PORT=4000
NODE_ENV=development

# Configuración de Base de Datos (usar 'db' como host en Docker)
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=admin123
DB_NAME=playnow
DB_PORT=5432

# Configuración de JWT
JWT_SECRET=supersecreto123

# Configuración de Email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_app
MAIL_FROM=tu_email@gmail.com
```

---

## Verificación de la Instalación

### 1. Verificar que el Servidor está Corriendo

```bash
# Usando curl
curl http://localhost:4000

# Usando PowerShell (Windows)
Invoke-WebRequest -Uri http://localhost:4000
```

### 2. Verificar Documentación Swagger

Abre en tu navegador:
```
http://localhost:4000/api-docs
```

### 3. Verificar Conexión a Base de Datos

```bash
# Con Docker
docker-compose exec db psql -U postgres -d playnow -c "SELECT * FROM \"Roles\";"

# Sin Docker (desde la máquina local)
psql -h localhost -U postgres -d playnow -c "SELECT * FROM \"Roles\";"
```

### 4. Revisar Logs de la Aplicación

```bash
# Con Docker
docker-compose logs -f backend

# Sin Docker (verás los logs en la terminal donde ejecutaste npm run dev)
```

---

## Scripts Disponibles

Los siguientes comandos están disponibles en `package.json`:

```bash
# Iniciar servidor en modo desarrollo
npm run dev

# Iniciar servidor en modo producción
npm start

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo observación (watch)
npm run test:watch

# Generar reporte de cobertura de pruebas
npm run test:coverage
```

---

## Solución de Problemas

### Error: "Cannot find module '...'"

**Solución:**
```bash
# Eliminar carpeta node_modules y reinstalar dependencias
rm -r node_modules package-lock.json
npm install
```

### Error: "Port 4000 is already in use"

**Solución:**
```bash
# Opción 1: Use un puerto diferente
PORT=5000 npm run dev

# Opción 2: Matar el proceso que usa el puerto 4000
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :4000
kill -9 <PID>
```

### Error: "Connection refused to PostgreSQL"

**Verificar:**
1. PostgreSQL está corriendo:
   ```bash
   # En Docker
   docker-compose ps db
   
   # Sin Docker
   psql -h localhost -U postgres
   ```

2. Credenciales en `.env` son correctas
3. Base de datos `playnow` existe:
   ```bash
   psql -U postgres -l | grep playnow
   ```

### Error: "Database does not exist"

**Solución:**
```bash
# Con Docker
docker-compose exec db psql -U postgres -c "CREATE DATABASE playnow;"

# Sin Docker
psql -U postgres -c "CREATE DATABASE playnow;"
```

### Docker build falló

**Solución:**
```bash
# Eliminar imágenes viejas y reconstruir
docker-compose down
docker system prune -a
docker-compose up --build
```

### Permiso denegado en carpeta uploads/

**Solución:**
```bash
# Asignar permisos correctos
chmod -R 755 uploads/

# En Docker
docker-compose exec backend chmod -R 755 uploads/
```

---

## Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de Sequelize](https://sequelize.org/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [Docker Documentation](https://docs.docker.com/)

---

## Próximos Pasos

1. **Con Docker**: Ejecuta `docker-compose up --build` y accede a `http://localhost:4000/api-docs`
2. **Sin Docker**: Configura tu `.env`, instala dependencias y corre `npm run dev`
3. **Testing**: Ejecuta `npm test` para validar que todo funciona correctamente
4. **Deployment**: Consulta la documentación de deployments en el repositorio

---

## Soporte

Si tienes problemas durante la instalación:

1. Verifica que todos los requisitos previos están instalados
2. Revisa la sección [Solución de Problemas](#solución-de-problemas)
3. Consulta los logs (logs/error.log)
4. Contacta al equipo de desarrollo

---

**Última actualización**: Abril 2026  
**Versión**: 1.0
