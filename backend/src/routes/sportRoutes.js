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
 *         activo:
 *           type: boolean
 *           description: Indica si el deporte está activo
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     SportInput:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           example: Baloncesto
 *         descripcion:
 *           type: string
 *           example: Deporte jugado con balón y canastas
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
 *   description: Gestión de deportes
 */

/**
 * @swagger
 * /api/sports:
 *   post:
 *     summary: Crear un nuevo deporte
 *     description: |
 *       **Solo usuarios autenticados**
 *       
 *       - El nombre del deporte es obligatorio
 *       - No se permiten nombres duplicados
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
 *             ejemplo:
 *               value:
 *                 nombre: Tenis
 *                 descripcion: Deporte individual o en parejas
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
 *             examples:
 *               nombreDuplicado:
 *                 value:
 *                   message: "El deporte ya existe"
 *               campoObligatorio:
 *                 value:
 *                   message: "El nombre del deporte es obligatorio"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/sports:
 *   get:
 *     summary: Obtener todos los deportes
 *     description: Retorna la lista de deportes activos
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de deportes
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
 * /api/sports/{id}:
 *   get:
 *     summary: Obtener un deporte por ID
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Deporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sport'
 *       404:
 *         description: Deporte no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/sports/{id}:
 *   put:
 *     summary: Actualizar un deporte
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SportInput'
 *     responses:
 *       200:
 *         description: Deporte actualizado correctamente
 *       404:
 *         description: Deporte no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/sports/{id}:
 *   delete:
 *     summary: Eliminar un deporte (desactivación lógica)
 *     tags: [Sports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deporte desactivado correctamente
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
  deleteSport,
} from "../controllers/sport.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createSport);
router.get("/", authenticateToken, getSports);
router.get("/:id", authenticateToken, getSportById);
router.put("/:id", authenticateToken, updateSport);
router.delete("/:id", authenticateToken, deleteSport);

export default router;
