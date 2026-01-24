/**
 * @swagger
 * components:
 *   schemas:
 *     AdminStatsItem:
 *       type: object
 *       properties:
 *         estado:
 *           type: string
 *           example: "Activa"
 *         total:
 *           type: integer
 *           example: 12
 *         ingresos:
 *           type: number
 *           format: float
 *           example: 540000
 *
 *     AdminStatsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Estadísticas obtenidas correctamente"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AdminStatsItem'
 */

/**
 * @swagger
 * tags:
 *   name: AdminStats
 *   description: Estadísticas administrativas del sistema (Solo Admin y Super Admin)
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Obtener estadísticas administrativas
 *     description: |
 *       Retorna estadísticas agregadas de reservas.
 *
 *       **Permisos:**
 *       - Administrador: puede consultar estadísticas de su centro comercial
 *       - Super Admin: puede consultar estadísticas globales o por centro
 *
 *       **Filtros opcionales:**
 *       - Centro comercial
 *       - Rango de fechas
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mallId
 *         schema:
 *           type: integer
 *         description: ID del centro comercial (opcional)
 *         example: 2
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicio del rango (YYYY-MM-DD)
 *         example: "2024-11-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha fin del rango (YYYY-MM-DD)
 *         example: "2024-11-30"
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStatsResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos para acceder a estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No tienes permisos para acceder a este recurso"
 *       500:
 *         description: Error del servidor
 */

import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getAdminStats } from "../controllers/adminStats.js";

const router = express.Router();

router.get("/", authenticateToken, getAdminStats);

export default router;