/**
 * @swagger
 * components:
 *   schemas:
 *     Sport:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del deporte
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del deporte
 *           example: Fútbol 7
 *         descripcion:
 *           type: string
 *           description: Descripción del deporte
 *           example: Fútbol 7, 7 jugadores por equipo
 *         cantidad:
 *           type: integer
 *           description: Cantidad de jugadores permitidos (ambos equipos)
 *           example: 14
 *         activo:
 *           type: boolean
 *           description: Estado del deporte (true=activo, false=inactivo)
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *
 *     SportInput:
 *       type: object
 *       required:
 *         - nombre
 *         - cantidad
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del deporte (debe ser único)
 *           example: Fútbol 7
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del deporte
 *           example: Fútbol 7, 7 jugadores por equipo
 *         cantidad:
 *           type: integer
 *           description: Cantidad total de jugadores (ambos equipos)
 *           example: 14
 *
 *     SportUpdateRequest:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del deporte (debe ser único)
 *           example: Fútbol Sala
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del deporte
 *           example: Fútbol sala profesional
 *         cantidad:
 *           type: integer
 *           description: Cantidad total de jugadores (ambos equipos)
 *           example: 10
 *
 *     SportStatusUpdateRequest:
 *       type: object
 *       required:
 *         - activo
 *       properties:
 *         activo:
 *           type: boolean
 *           description: true para activar, false para desactivar
 *           example: false
 *
 *     SportStatusUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Deporte desactivado correctamente. No estará disponible para nuevas canchas.
 *         sport:
 *           $ref: '#/components/schemas/Sport'
 *         action:
 *           type: string
 *           enum: [activated, deactivated]
 *           example: deactivated
 *
 *     SportResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Deporte creado exitosamente
 *         sport:
 *           $ref: '#/components/schemas/Sport'
 *
 *     SportUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Deporte actualizado exitosamente
 *         sport:
 *           $ref: '#/components/schemas/Sport'
 *
 *     SportDeleteResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Deporte eliminado permanentemente
 *         action:
 *           type: string
 *           example: deleted
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error message
 *         allowed_endpoints:
 *           type: object
 *           properties:
 *             activate:
 *               type: string
 *             deactivate:
 *               type: string
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
 *   name: Sports
 *   description: Gestión de deportes (requiere autenticación JWT)
 */

/**
 * @swagger
 * /api/sports:
 *   post:
 *     summary: Crear un nuevo deporte
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - El nombre del deporte es obligatorio y debe ser único
 *       - La cantidad de jugadores es obligatoria
 *       - El deporte se crea con activo=true por defecto
 *       - No se puede enviar el campo 'activo' en la creación (se asigna automáticamente)
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SportInput'
 *           examples:
 *             deporteFutbol7:
 *               value:
 *                 nombre: Fútbol 7
 *                 descripcion: Fútbol 7, 7 jugadores por equipo
 *                 cantidad: 14
 *             deportePadel:
 *               value:
 *                 nombre: Pádel
 *                 descripcion: Pádel, 2 o 4 jugadores
 *                 cantidad: 4
 *     responses:
 *       201:
 *         description: Deporte creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SportResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               nombreDuplicado:
 *                 value:
 *                   message: "El nombre del deporte ya existe"
 *               campoObligatorio:
 *                 value:
 *                   message: "El nombre del deporte es obligatorio"
 *               cantidadRequerida:
 *                 value:
 *                   message: "La cantidad de jugadores es obligatoria"
 *       401:
 *         description: No autorizado - Token no proporcionado o inválido
 *       500:
 *         description: Error del servidor
 *
 *   get:
 *     summary: Obtener todos los deportes activos
 *     description: Retorna la lista completa de deportes con activo = true. Este es el endpoint principal para el frontend.
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de deportes activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sport'
 *             examples:
 *               deportesActivos:
 *                 value:
 *                   - id: 1
 *                     nombre: Fútbol 5
 *                     descripcion: Fútbol sala, 5 jugadores por equipo
 *                     cantidad: 10
 *                     activo: true
 *                   - id: 2
 *                     nombre: Fútbol 7
 *                     descripcion: Fútbol 7, 7 jugadores por equipo
 *                     cantidad: 14
 *                     activo: true
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/sports/active/all:
 *   get:
 *     summary: Obtener todos los deportes activos
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Retorna la lista de deportes que están activos (activo = true)
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de deportes activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sport'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/sports/inactive/{id}:
 *   get:
 *     summary: Obtener un deporte inactivo por ID
 *     description: Retorna los detalles de un deporte inactivo específico
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del deporte inactivo
 *     responses:
 *       200:
 *         description: Deporte inactivo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sport'
 *       404:
 *         description: Deporte inactivo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/sports/{id}:
 *   get:
 *     summary: Obtener un deporte específico por ID
 *     description: Retorna un deporte específico, incluyendo su estado activo/inactivo
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del deporte
 *         example: 1
 *     responses:
 *       200:
 *         description: Deporte encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sport'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Deporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Actualizar un deporte existente
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Permite actualizar nombre, descripción y cantidad de jugadores
 *       - **NO permite modificar el campo 'activo' directamente**
 *       - Para activar/desactivar use el endpoint PATCH /api/sports/{id}/status
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del deporte a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SportUpdateRequest'
 *           examples:
 *             actualizarNombre:
 *               value:
 *                 nombre: Fútbol Sala
 *             actualizarTodo:
 *               value:
 *                 nombre: Fútbol Sala
 *                 descripcion: Fútbol sala profesional
 *                 cantidad: 10
 *     responses:
 *       200:
 *         description: Deporte actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SportUpdateResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               campoActivo:
 *                 value:
 *                   message: "No se puede modificar el estado del deporte. Use los endpoints /activate o /deactivate"
 *                   allowed_endpoints:
 *                     activate: "/api/sports/1/activate"
 *                     deactivate: "/api/sports/1/deactivate"
 *               nombreDuplicado:
 *                 value:
 *                   message: "El nombre del deporte ya existe"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Deporte no encontrado
 *
 *   delete:
 *     summary: Eliminar físicamente un deporte
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Elimina permanentemente el deporte de la base de datos
 *       - **Solo funciona si el deporte NO tiene canchas asociadas**
 *       - Si tiene canchas asociadas, devuelve error 400 con instrucciones
 *       - Para deportes con canchas, use PATCH /api/sports/{id}/status con activo=false
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del deporte a eliminar
 *     responses:
 *       200:
 *         description: Deporte eliminado permanentemente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SportDeleteResponse'
 *       400:
 *         description: No se puede eliminar porque tiene canchas asociadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 action:
 *                   type: string
 *                 options:
 *                   type: object
 *                   properties:
 *                     deactivate:
 *                       type: string
 *                     view_courts:
 *                       type: string
 *       404:
 *         description: Deporte no encontrado
 */

/**
 * @swagger
 * /api/sports/{id}/status:
 *   patch:
 *     summary: Activar o desactivar un deporte (endpoint unificado)
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Endpoint único para activar o desactivar deportes
 *       - Envía `activo: true` para activar, `activo: false` para desactivar
 *       - Esta es la forma correcta de cambiar el estado de un deporte
 *       - Los deportes inactivos no aparecen en el listado principal
 *       - Las canchas existentes con deportes inactivos siguen funcionando
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del deporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SportStatusUpdateRequest'
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
 *               $ref: '#/components/schemas/SportStatusUpdateResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               campoFaltante:
 *                 value:
 *                   message: "El campo 'activo' es requerido. Use true para activar o false para desactivar."
 *               tipoIncorrecto:
 *                 value:
 *                   message: "El campo 'activo' debe ser un valor booleano (true/false)"
 *               yaActivo:
 *                 value:
 *                   message: "El deporte ya está activo"
 *               yaInactivo:
 *                 value:
 *                   message: "El deporte ya está inactivo"
 *       404:
 *         description: Deporte no encontrado
 *       401:
 *         description: No autorizado
 */

import express from "express";
import {
  createSport,
  getSports,
  getSportById,
  updateSport,
  getActiveSports,
  getInactiveSportById,
  updateSportStatus,
  deleteSportPermanently
} from "../controllers/sport.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createSport);
router.get("/", authenticateToken, getSports);
router.get("/active/all", authenticateToken, getActiveSports);
router.get("/inactive/:id", authenticateToken, getInactiveSportById);
router.get("/:id", authenticateToken, getSportById);
router.put("/:id", authenticateToken, updateSport);
router.patch("/:id/status", authenticateToken, updateSportStatus);
router.delete("/:id", authenticateToken, deleteSportPermanently);

export default router;

