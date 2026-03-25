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
 *           example: Fútbol
 *         descripcion:
 *           type: string
 *           description: Descripción del deporte
 *           example: Deporte de equipo jugado con balón
 *         cantidad:
 *           type: integer
 *           description: Cantidad de jugadores permitidos
 *           example: 11
 *         activo:
 *           type: boolean
 *           description: Indica si el deporte está activo (para eliminación lógica)
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
 *           description: Nombre del deporte (único)
 *           example: Baloncesto
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del deporte
 *           example: Deporte jugado con balón y canastas
 *         cantidad:
 *           type: integer
 *           description: Cantidad de jugadores por equipo
 *           example: 5
 *         activo:
 *           type: boolean
 *           description: Estado del deporte (opcional, por defecto true)
 *           example: true
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
 *           example: Deporte desactivado correctamente
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error message
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
 *       - El campo 'activo' es opcional (por defecto true)
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
 *             deporteCompleto:
 *               value:
 *                 nombre: Tenis
 *                 descripcion: Deporte individual o en parejas
 *                 cantidad: 2
 *                 activo: true
 *             deporteBasico:
 *               value:
 *                 nombre: Natación
 *                 cantidad: 1
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
 *                   message: "El deporte 'Tenis' ya existe"
 *               campoObligatorio:
 *                 value:
 *                   message: "El nombre del deporte es obligatorio"
 *               cantidadRequerida:
 *                 value:
 *                   message: "La cantidad de jugadores es obligatoria"
 *       401:
 *         description: No autorizado - Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Token no proporcionado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Error interno del servidor"
 */

/**
 * @swagger
 * /api/sports:
 *   get:
 *     summary: Obtener todos los deportes activos
 *     description: Retorna la lista completa de deportes con activo = true
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/sports/{id}:
 *   get:
 *     summary: Obtener un deporte específico por ID
 *     description: Retorna un deporte específico incluyendo su estado activo/inactivo
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
 *             example:
 *               message: "Deporte con ID 1 no encontrado"
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/sports/{id}:
 *   put:
 *     summary: Actualizar un deporte existente
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Todos los campos son opcionales en la actualización
 *       - El nombre no puede duplicarse si se modifica
 *       - Se puede modificar el estado 'activo' para reactivar deportes
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
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SportInput'
 *           examples:
 *             actualizacionParcial:
 *               value:
 *                 nombre: Fútbol Sala
 *                 cantidad: 5
 *             reactivar:
 *               value:
 *                 activo: true
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
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Deporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/sports/{id}:
 *   delete:
 *     summary: Eliminar físicamente un deporte
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Elimina permanentemente el deporte de la base de datos
 *       - **Solo funciona si el deporte NO tiene canchas asociadas**
 *       - Si tiene canchas, devuelve error 400 con instrucciones
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deporte eliminado permanentemente
 *                 action:
 *                   type: string
 *                   example: deleted
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
 *                 endpoint:
 *                   type: string
 *       404:
 *         description: Deporte no encontrado
 */

/**
 * @swagger
 * /api/sports/{id}/deactivate:
 *   put:
 *     summary: Desactivar un deporte (eliminación lógica)
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Desactiva el deporte (cambia activo a false)
 *       - El deporte no se elimina físicamente
 *       - No estará disponible para nuevas canchas
 *       - Las canchas existentes siguen funcionando
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del deporte a desactivar
 *     responses:
 *       200:
 *         description: Deporte desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deporte desactivado correctamente
 *                 sport:
 *                   $ref: '#/components/schemas/Sport'
 *                 action:
 *                   type: string
 *                   example: deactivated
 *       400:
 *         description: El deporte ya está desactivado
 *       404:
 *         description: Deporte no encontrado
 */

/**
 * @swagger
 * /api/sports/inactive/all:
 *   get:
 *     summary: Obtener todos los deportes inactivos
 *     description: Retorna la lista de deportes que han sido desactivados
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de deportes inactivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sport'
 */

/**
 * @swagger
 * /api/sports/{id}/status:
 *   patch:
 *     summary: Activar o desactivar un deporte
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Permite activar o desactivar un deporte en un solo endpoint
 *       - Envía `activo: true` para activar, `activo: false` para desactivar
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
 *             type: object
 *             required:
 *               - activo
 *             properties:
 *               activo:
 *                 type: boolean
 *                 description: true para activar, false para desactivar
 *                 example: false
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 sport:
 *                   $ref: '#/components/schemas/Sport'
 *                 action:
 *                   type: string
 *                   enum: [activated, deactivated]
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
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
 */

import express from "express";
import {
  createSport,
  getSports,
  getSportById,
  updateSport,
  getInactiveSports,
  getInactiveSportById,
  updateSportStatus,
  deleteSportPermanently
} from "../controllers/sport.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createSport);
router.get("/", authenticateToken, getSports);
router.get("/:id", authenticateToken, getSportById);
router.put("/:id", authenticateToken, updateSport);
router.get("/inactive/all", authenticateToken, getInactiveSports);
router.get("/inactive/:id", authenticateToken, getInactiveSportById);
router.patch("/:id/status", authenticateToken, updateSportStatus);
router.delete("/:id", authenticateToken, deleteSportPermanently);

export default router;

