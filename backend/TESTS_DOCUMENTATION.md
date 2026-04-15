# Documentación de Pruebas Unitarias e Integración - PlayNow

## Resumen de Pruebas Creadas

El backend de PlayNow cuenta con una suite de pruebas automatizadas que cubren los principales servicios y rutas. Actualmente hay **8 archivos de prueba** con un total de **178 tests**.

### Archivos de Prueba Creados

#### 1. **auth.test.js** - Módulo de Autenticación
**Funcionalidades Probadas:**
- Login de usuarios
- Logout
- Cambio de contraseña
- Validación de credenciales
- Acceso y bloqueo por intentos fallidos
- Manejo de errores y respuestas HTTP

**Total de tests: 22**

#### 2. **users.test.js** - Módulo de Usuarios
**Funcionalidades Probadas:**
- Registro de usuarios
- Obtención de usuarios
- Obtención de usuario por ID
- Actualización de usuario
- Eliminación de usuario
- Validación de correo y documento único
- Control de acceso por roles

**Total de tests: 22**

#### 3. **courts.test.js** - Módulo de Canchas
**Funcionalidades Probadas:**
- Creación de cancha
- Lectura de canchas
- Lectura de cancha por ID
- Actualización de cancha
- Eliminación de cancha
- Validaciones de horario y datos
- Control de permisos por rol

**Total de tests: 22**

#### 4. **reservations.test.js** - Módulo de Reservas
**Funcionalidades Probadas:**
- Creación de reservas
- Validación de disponibilidad
- Validación de horarios y solapamientos
- Lectura de reservas
- Lectura de reserva por ID
- Actualización de reserva
- Cancelación de reserva
- Control de acceso por usuario

**Total de tests: 22**

#### 5. **malls.test.js** - Módulo de Centros Comerciales
**Funcionalidades Probadas:**
- Creación de mall y administrador asociado
- Lectura de malls
- Lectura de mall por ID
- Actualización de mall
- Eliminación de mall
- Obtención de canchas por mall
- Validaciones de datos obligatorios
- Control de acceso por rol

**Total de tests: 25**

#### 6. **roles.test.js** - Módulo de Roles
**Funcionalidades Probadas:**
- Creación de roles
- Lectura de roles
- Lectura de rol por ID
- Actualización de rol
- Eliminación de rol
- Validación de roles duplicados
- Control de permisos

**Total de tests: 23**

#### 7. **adminStats.test.js** - Módulo de Estadísticas y Dashboard
**Funcionalidades Probadas:**
- Obtención de estadísticas generales
- Conteo de usuarios y malls
- Reportes de ingresos
- Filtros por fechas, estado, cancha y mall
- Dashboard y métricas de negocio
- Control de acceso por roles administrativos

**Total de tests: 28**

#### 8. **sports.test.js** - Módulo de Deportes
**Funcionalidades Probadas:**
- Creación de deporte
- Lectura de deportes
- Lectura de deporte por ID
- Actualización de deporte
- Eliminación de deporte
- Validaciones de datos básicos

**Total de tests: 14**

---

## Estadísticas de la Suite de Pruebas

| Módulo | Tests | Comentarios |
|--------|-------|-------------|
| Auth | 22 | Pruebas de autenticación y sesiones |
| Users | 22 | Gestión de usuarios y validaciones |
| Courts | 22 | CRUD de canchas y permisos |
| Reservations | 22 | Reservas, disponibilidad y solapamientos |
| Malls | 25 | CRUD de malls, admins y relaciones |
| Roles | 23 | Gestión de roles y permisos |
| Admin Stats | 28 | Dashboard, métricas y filtros |
| Sports | 14 | CRUD de deportes |

**Total de Tests: 178**

---

## Cómo Ejecutar las Pruebas

### Ejecutar todas las pruebas:
```bash
npm test
```

### Ejecutar pruebas con modo watch:
```bash
npm run test:watch
```

### Ejecutar pruebas con cobertura:
```bash
npm run test:coverage
```

### Ejecutar un archivo específico:
```bash
npm test -- auth.test.js
npm test -- users.test.js
npm test -- courts.test.js
```

### Ejecutar un patrón de archivos:
```bash
npm test -- --testPathPattern="auth|users"
```

---

## Estructura de las Pruebas

Los archivos de prueba mantienen una estructura consistente con setup, ejecución y limpieza:

```javascript
describe('Nombre del Módulo', () => {
  beforeAll(async () => {
    // Inicialización de datos y tokens
  });

  afterEach(async () => {
    // Limpieza de datos entre pruebas
  });

  describe('Endpoint o Funcionalidad', () => {
    it('Debería ejecutar el caso exitoso', async () => {
      // ...
    });

    it('Debería manejar el caso de error / validación', async () => {
      // ...
    });
  });
});
```

---

## Configuración de Autenticación en las Pruebas

Las pruebas consideran distintos tipos de usuario y permisos:
- **superAdmin**: permisos completos
- **admin**: permisos sobre su mall y recursos asociados
- **usuario**: acceso a funcionalidades básicas como reservas y perfil

También validan:
- Tokens JWT válidos
- Respuestas 401 cuando falta autenticación
- Respuestas 403 cuando falta autorización

---

## Características Cubiertas

- Casos exitosos y caminos felices
- Validaciones de campos obligatorios
- Validaciones de formatos y datos duplicados
- Control de acceso por roles
- Manejo de errores HTTP (400, 401, 403, 404)
- Limpieza de datos entre pruebas
- Integridad de relaciones entre modelos

---

## Tecnologías Utilizadas

- **Jest**
- **Supertest**
- **Express**
- **Sequelize**
- **JWT**

---

## Requisitos Previos

- Node.js 16+
- PostgreSQL en ejecución
- `.env` con la configuración de la base de datos
- Dependencias instaladas via `npm install`

---

## Ajustes de Configuración

La suite de pruebas utiliza `tests/setup.js` para inicializar y limpiar la base de datos antes y después de los casos.

---

## Solución de Problemas

- **ECONNREFUSED**: PostgreSQL no está disponible.
- **Timeout**: Aumentar el timeout de Jest o revisar la base de datos.
- **Relaciones inexistentes**: Asegurar `.env` y sincronización de la base de datos.

---

## Próximos pasos

1. Ejecutar `npm test` antes de cada commit.
2. Añadir pruebas nuevas para cualquier funcionalidad añadida.
3. Actualizar los tests cuando cambie la lógica de negocio.
4. Revisar cobertura con `npm run test:coverage`.


### Error: "Base de datos de prueba no conectada"
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`

### Error: "Token expirado"
- Los tokens en setup.js expiran en 1 hora
- Esto es normal para tests de autenticación

### Error: "Tabla no encontrada"
- Asegúrate de que `setup.js` ejecute los hooks `beforeAll`
- Verifica la sincronización de modelos en Sequelize

---

## Soporte

Para preguntas o problemas con las pruebas, consulta:
- La documentación de Jest: https://jestjs.io/
- La documentación de Supertest: https://github.com/visionmedia/supertest
- El archivo setup.js para configuración de pruebas

---

**Última actualización**: 2026-04-11
**Total de tests escribidos**: 178
