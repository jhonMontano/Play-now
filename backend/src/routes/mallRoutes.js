/**
 * @swagger
 * components:
 *   schemas:
 *     Mall:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del centro comercial
 *           example: 110
 *         nombreCentro:
 *           type: string
 *           description: Nombre del centro comercial
 *           example: "Florida"
 *         direccion:
 *           type: string
 *           description: Dirección física del centro comercial
 *           example: "Cra 48 #32B-60"
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto
 *           example: "6041234567"
 *         ciudad:
 *           type: string
 *           description: Ciudad donde se encuentra el centro comercial
 *           example: "Medellín"
 *         activo:
 *           type: boolean
 *           description: Estado del centro comercial (true=activo, false=inactivo)
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: "2026-03-14T19:43:27.703Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *           example: "2026-03-14T19:43:27.821Z"
 *         adminId:
 *           type: integer
 *           description: ID del administrador del centro
 *           example: 52
 *         administrador:
 *           $ref: '#/components/schemas/User'
 * 
 *     MallInput:
 *       type: object
 *       required:
 *         - nombreCentro
 *         - direccion
 *         - telefono
 *         - ciudad
 *       properties:
 *         nombreCentro:
 *           type: string
 *           description: Nombre del centro comercial
 *           example: "Plaza Central"
 *         direccion:
 *           type: string
 *           description: Dirección física
 *           example: "Avenida Principal 123"
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto
 *           example: "+57 601 7654321"
 *         ciudad:
 *           type: string
 *           description: Ciudad
 *           example: "Medellín"
 * 
 *     AdminInput:
 *       type: object
 *       required:
 *         - tipoDocumento
 *         - numeroDocumento
 *         - correo
 *         - celular
 *         - direccion
 *         - primerNombre
 *         - primerApellido
 *       properties:
 *         tipoDocumento:
 *           type: string
 *           enum: [CC, NIT]
 *           description: Tipo de documento de identidad
 *           example: "CC"
 *         numeroDocumento:
 *           type: string
 *           description: Número de documento
 *           example: "123456789"
 *         primerNombre:
 *           type: string
 *           description: Primer nombre
 *           example: "Carlos"
 *         segundoNombre:
 *           type: string
 *           description: Segundo nombre (opcional)
 *           example: "Andrés"
 *         primerApellido:
 *           type: string
 *           description: Primer apellido
 *           example: "Gómez"
 *         segundoApellido:
 *           type: string
 *           description: Segundo apellido (opcional)
 *           example: "López"
 *         razonSocial:
 *           type: string
 *           description: Razón social (para empresas)
 *           example: "Empresa XYZ SAS"
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico
 *           example: "admin@plazacentral.com"
 *         celular:
 *           type: string
 *           description: Número de celular
 *           example: "3001234567"
 *         direccion:
 *           type: string
 *           description: Dirección de residencia
 *           example: "Carrera 45 #26-89"
 * 
 *     CreateMallRequest:
 *       type: object
 *       required:
 *         - mall
 *         - admin
 *       properties:
 *         mall:
 *           $ref: '#/components/schemas/MallInput'
 *         admin:
 *           $ref: '#/components/schemas/AdminInput'
 * 
 *     UpdateMallRequest:
 *       type: object
 *       properties:
 *         mall:
 *           $ref: '#/components/schemas/MallInput'
 *         admin:
 *           $ref: '#/components/schemas/AdminInput'
 * 
 *     MallWithAdminResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Centro comercial y administrador creados correctamente"
 *         mall:
 *           $ref: '#/components/schemas/Mall'
 *         administrador:
 *           $ref: '#/components/schemas/User'
 * 
 *     MallStatusUpdateRequest:
 *       type: object
 *       required:
 *         - activo
 *       properties:
 *         activo:
 *           type: boolean
 *           description: true para activar, false para desactivar
 *           example: false
 * 
 *     MallStatusUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Centro comercial desactivado correctamente. No estará disponible para nuevas reservas, pero las existentes siguen vigentes."
 *         mall:
 *           $ref: '#/components/schemas/Mall'
 *         action:
 *           type: string
 *           enum: [activated, deactivated]
 *           example: "deactivated"
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Malls
 *   description: Gestión de centros comerciales y sus administradores
 */

/**
 * @swagger
 * /api/malls:
 *   post:
 *     summary: Crear un nuevo centro comercial y su administrador
 *     description: Solo accesible para super administradores (idRol = 1). El centro comercial se crea con activo=true por defecto.
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMallRequest'
 *           examples:
 *             ejemploCompleto:
 *               value:
 *                 mall:
 *                   nombreCentro: "Centro Comercial Andino"
 *                   direccion: "Carrera 11 #82-71"
 *                   telefono: "+57 601 3456789"
 *                   ciudad: "Bogotá"
 *                 admin:
 *                   tipoDocumento: "CC"
 *                   numeroDocumento: "987654321"
 *                   primerNombre: "Ana"
 *                   segundoNombre: "María"
 *                   primerApellido: "Rodríguez"
 *                   segundoApellido: "Pérez"
 *                   correo: "ana.rodriguez@andino.com"
 *                   celular: "3109876543"
 *                   direccion: "Calle 82 #11-45"
 *     responses:
 *       201:
 *         description: Centro comercial y administrador creados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MallWithAdminResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               accesoDenegado:
 *                 value:
 *                   message: "Acceso denegado. Solo el super administrador puede crear centros comerciales."
 *               campoObligatorio:
 *                 value:
 *                   message: "El campo 'nombreCentro' del centro comercial es obligatorio."
 *               mallExistente:
 *                 value:
 *                   message: "Ya existe un centro comercial con el nombre 'Centro Mayor'."
 *               adminExistente:
 *                 value:
 *                   message: "El usuario admin@ejemplo.com ya es administrador del centro comercial 'Plaza Central'"
 *       401:
 *         description: No autorizado - Token inválido
 *       500:
 *         description: Error del servidor
 *
 *   get:
 *     summary: Obtener lista de centros comerciales activos
 *     description: Retorna solo los centros comerciales con activo=true. Incluye la información del administrador.
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Límite de resultados por página
 *     responses:
 *       200:
 *         description: Lista de centros comerciales activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mall'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   - id: 110
 *                     nombreCentro: "Florida"
 *                     direccion: "Cra 48 #32B-60"
 *                     telefono: "6041234567"
 *                     ciudad: "Medellin"
 *                     activo: true
 *                     createdAt: "2026-03-14T19:43:27.703Z"
 *                     updatedAt: "2026-03-14T19:43:27.821Z"
 *                     adminId: 52
 *                     administrador:
 *                       id: 52
 *                       primerNombre: "Carlos"
 *                       primerApellido: "Ramírez"
 *                       correo: "juan.ramirez@viva.com"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/malls/{id}:
 *   get:
 *     summary: Obtener un centro comercial por ID
 *     description: Retorna los detalles de un centro comercial específico
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del centro comercial
 *         example: 110
 *     responses:
 *       200:
 *         description: Centro comercial encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mall'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Centro comercial no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Centro comercial no encontrado"
 *
 *   put:
 *     summary: Actualizar un centro comercial y su administrador
 *     description: Solo accesible para super administradores (idRol = 1). No permite modificar el campo 'activo' directamente.
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del centro comercial a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMallRequest'
 *           examples:
 *             actualizarMall:
 *               value:
 *                 mall:
 *                   nombreCentro: "Nuevo Nombre Centro"
 *                   telefono: "+57 601 9998888"
 *             actualizarAdmin:
 *               value:
 *                 admin:
 *                   correo: "nuevo.email@centro.com"
 *                   celular: "3112223344"
 *     responses:
 *       200:
 *         description: Centro comercial y administrador actualizados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MallWithAdminResponse'
 *       400:
 *         description: Error en la actualización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               accesoDenegado:
 *                 value:
 *                   message: "Acceso denegado. Solo el super administrador puede actualizar centros comerciales"
 *               noEncontrado:
 *                 value:
 *                   message: "Centro comercial no encontrado"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Centro comercial no encontrado
 *
 *   delete:
 *     summary: Eliminar un centro comercial y su administrador
 *     description: Solo accesible para super administradores (idRol = 1). Elimina tanto el centro comercial como el usuario administrador asociado. Solo permite eliminación física si no tiene canchas asociadas.
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del centro comercial a eliminar
 *     responses:
 *       200:
 *         description: Centro comercial y administrador eliminados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Centro comercial y su administrador eliminados correctamente"
 *       400:
 *         description: Error en la eliminación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               accesoDenegado:
 *                 value:
 *                   message: "Acceso denegado. Solo el super administrador puede eliminar centros comerciales"
 *               noEncontrado:
 *                 value:
 *                   message: "Centro comercial no encontrado"
 *               tieneCanchas:
 *                 value:
 *                   message: "No se puede eliminar el centro comercial porque tiene canchas asociadas. Elimina o reasigna las canchas antes de continuar."
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Centro comercial no encontrado
 */

/**
 * @swagger
 * /api/malls/admin/all:
 *   get:
 *     summary: Obtener todos los centros comerciales (incluyendo inactivos)
 *     description: Solo accesible para super administradores. Retorna la lista completa de centros comerciales, tanto activos como inactivos.
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de centros comerciales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mall'
 *       403:
 *         description: Acceso denegado - Solo super administradores
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/malls/admin/inactive:
 *   get:
 *     summary: Obtener solo centros comerciales inactivos
 *     description: Solo accesible para super administradores. Retorna la lista de centros comerciales con activo=false.
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de centros comerciales inactivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mall'
 *       403:
 *         description: Acceso denegado - Solo super administradores
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/malls/{id}/status:
 *   patch:
 *     summary: Activar o desactivar un centro comercial
 *     description: |
 *       **Requiere autenticación y rol de super administrador**
 *       
 *       - Permite activar o desactivar un centro comercial
 *       - Los centros inactivos no aparecen en el listado principal
 *       - Las reservas existentes siguen siendo válidas
 *       - No se pueden crear nuevas reservas en centros inactivos
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del centro comercial
 *         example: 110
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MallStatusUpdateRequest'
 *           examples:
 *             desactivar:
 *               value:
 *                 activo: false
 *             activar:
 *               value:
 *                 activo: true
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MallStatusUpdateResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               campoRequerido:
 *                 value:
 *                   message: "El campo 'activo' es requerido. Use true para activar o false para desactivar."
 *               tipoIncorrecto:
 *                 value:
 *                   message: "El campo 'activo' debe ser un valor booleano (true/false)"
 *               yaActivo:
 *                 value:
 *                   message: "El centro comercial ya está activo"
 *               yaInactivo:
 *                 value:
 *                   message: "El centro comercial ya está inactivo"
 *       403:
 *         description: Acceso denegado - Solo super administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acceso denegado. Solo el super administrador puede modificar el estado de centros comerciales"
 *       404:
 *         description: Centro comercial no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/malls/admin/all:
 *   get:
 *     summary: Obtener todos los centros comerciales (incluyendo inactivos)
 *     description: Solo accesible para super administradores. Retorna la lista completa de centros comerciales, tanto activos como inactivos.
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de centros comerciales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mall'
 *       403:
 *         description: Acceso denegado - Solo super administradores
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/malls/admin/inactive:
 *   get:
 *     summary: Obtener solo centros comerciales inactivos
 *     description: Solo accesible para super administradores. Retorna la lista de centros comerciales con activo=false.
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de centros comerciales inactivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mall'
 *       403:
 *         description: Acceso denegado - Solo super administradores
 *       401:
 *         description: No autorizado
 */

import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createMallAndAdmin,
  getAllMalls,
  getAllMallsIncludingInactive,
  getInactiveMalls,
  getMallById,
  updateMall,
  updateMallStatus,
  deleteMall,
} from "../controllers/mallController.js";

const router = express.Router();

router.get("/", authenticateToken, getAllMalls);
router.get("/:id", authenticateToken, getMallById);
router.post("/", authenticateToken, createMallAndAdmin);
router.get("/admin/all", authenticateToken, getAllMallsIncludingInactive);
router.get("/admin/inactive", authenticateToken, getInactiveMalls);
router.put("/:id", authenticateToken, updateMall);
router.patch("/:id/status", authenticateToken, updateMallStatus);
router.delete("/:id", authenticateToken, deleteMall);

export default router;
