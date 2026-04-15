# GUÍA RÁPIDA DE PRUEBAS - PlayNow Backend

## Pruebas Creadas

Se han creado **8 archivos de prueba completos** con un total de **178 tests** que cubren los servicios principales del backend.

### Archivos de Prueba:

```
auth.test.js           - Autenticación y sesiones (22 tests)
users.test.js          - Gestión de usuarios (22 tests)
courts.test.js         - Gestión de canchas (22 tests)
reservations.test.js   - Gestión de reservas (22 tests)
malls.test.js          - Gestión de centros comerciales (25 tests)
roles.test.js          - Gestión de roles (23 tests)
adminStats.test.js     - Estadísticas y dashboard (28 tests)
sports.test.js         - Gestión de deportes (14 tests)
```

---

## Cómo Ejecutar

### Instalar dependencias: 
```bash
npm install
```

### Ejecutar TODAS las pruebas:
```bash
npm test
```

### Otras opciones útiles:

**Ejecutar pruebas en modo watch (se actualiza con cambios):**
```bash
npm run test:watch
```

**Ver cobertura de pruebas:**
```bash
npm run test:coverage
```

**Ejecutar un archivo específico:**
```bash
npm test -- auth.test.js
npm test -- users.test.js
npm test -- courts.test.js
```

**Ejecutar con patrón:**
```bash
npm test -- --testPathPattern="auth|users"
```

---

## Cobertura de Pruebas

| Módulo | Servicios Probados | Tests |
|--------|-------------------|-------|
| **Auth** | login, logout, cambio de contraseña, validaciones | 22 |
| **Users** | registros, actualización, eliminación, validaciones | 22 |
| **Courts** | CRUD de canchas, validaciones y permisos | 22 |
| **Reservations** | reservas, disponibilidad, cancelación, actualización | 22 |
| **Malls** | CRUD de malls, usuarios admin y relaciones | 25 |
| **Roles** | CRUD de roles, permisos y duplicados | 23 |
| **Admin Stats** | estadísticas, métricas, filtros y reportes | 28 |
| **Sports** | CRUD de deportes y validaciones básicas | 14 |

**TOTAL: 178 tests**

---

## Qué Prueban los Tests

### Funcionalidades Clave:
- **Autenticación**: login, logout, cambio de contraseña
- **Autorización**: control de accesos por roles (superAdmin, admin, usuario)
- **CRUD Completo**: creación, lectura, actualización y eliminación de entidades
- **Validaciones**: campos requeridos, formatos y datos duplicados
- **Lógica de Negocio**: disponibilidad de canchas, solapamiento de reservas
- **Manejo de Errores**: códigos HTTP 400, 401, 403, 404 y mensajes de error
- **Integridad de Datos**: relaciones entre entidades y limpieza de datos

---

## Estructura de las Pruebas

Cada archivo de prueba incluye:

1. **Setup**: creación de datos de prueba, roles y tokens
2. **Casos exitosos**: validación de la funcionalidad esperada
3. **Casos de error**: validaciones y respuestas inválidas
4. **Pruebas de seguridad**: autenticación y autorización
5. **Limpieza**: borrado o reseteo de datos después de cada prueba

Ejemplo:
```javascript
describe('Module Tests', () => {
  beforeAll(async () => {
    // Inicialización de datos y tokens
  });

  afterEach(async () => {
    // Limpieza de datos entre pruebas
  });

  it('Debería crear el recurso correctamente', async () => {
    // ...
  });

  it('Debería rechazar la petición sin autorización', async () => {
    // ...
  });
});
```

---

## Roles Probados

Los tests incluyen pruebas con varios tipos de usuario:

- **superAdmin**: acceso completo
- **admin**: permisos acotados a su mall
- **usuario**: acceso a funcionalidades de usuario final

---

## Requisitos

- Node.js 16+
- PostgreSQL en ejecución
- Archivo `.env` con configuración de la base de datos
- Dependencias instaladas en `node_modules`

---

## Configuración

La suite de pruebas utiliza `tests/setup.js` para preparar el entorno de test:

```javascript
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await clearTables();
});
```

---

## Solución de Problemas

### Error: "ECONNREFUSED"
**Solución**: PostgreSQL no está corriendo o la conexión es incorrecta.

### Error: "Relations do not exist"
**Solución**: revisa la configuración de `.env` y la sincronización de la base de datos.

### Error: "Timeout"
**Solución**: ajusta el timeout de Jest en `jest.config.js` o revisa la base de datos.

---

## Documentación Detallada

Para más detalles de los archivos de prueba y la estructura de los tests, consulta:
**`TESTS_DOCUMENTATION.md`**

---

## Próximos Pasos

1. Ejecuta `npm test` antes de cada commit.
2. Ejecuta `npm run test:coverage` para revisar cobertura.
3. Agrega tests para nuevas funcionalidades.
4. Mantén actualizada la suite al cambiar la lógica del backend.

---

**¡Listo!** Usa `npm test` para verificar la suite.
