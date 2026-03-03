/**
 * @swagger
 * components:
 *   schemas:
 *
 *     DashboardSummary:
 *       type: object
 *       properties:
 *         totalMalls:
 *           type: integer
 *           example: 5
 *         totalUsers:
 *           type: integer
 *           example: 120
 *
 *     UsersByRoleItem:
 *       type: object
 *       properties:
 *         rol:
 *           type: string
 *           example: "Administrador"
 *         total:
 *           type: integer
 *           example: 4
 *
 *     NewUsersByMonthItem:
 *       type: object
 *       properties:
 *         month:
 *           type: integer
 *           example: 3
 *         total:
 *           type: integer
 *           example: 15
 *
 *     ReservationStatsItem:
 *       type: object
 *       properties:
 *         estado:
 *           type: string
 *           example: "Activa"
 *         total reservas:
 *           type: integer
 *           example: 12
 *         ingresos:
 *           type: number
 *           format: float
 *           example: 540000
 *
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Dashboard obtenido correctamente"
 *         data:
 *           type: object
 *           properties:
 *             reservations:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReservationStatsItem'
 *             summary:
 *               $ref: '#/components/schemas/DashboardSummary'
 *             usersByRole:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UsersByRoleItem'
 *             newUsers:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewUsersByMonthItem'
 */

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Información consolidada para el panel administrativo (Admin y Super Admin)
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Obtener datos completos del dashboard administrativo
 *     description: |
 *       Retorna información consolidada para el dashboard:
 *
 *       - Estadísticas de reservas
 *       - Totales generales del sistema
 *       - Distribución de usuarios por rol
 *       - Nuevos usuarios por mes
 *
 *       **Permisos:**
 *       - Administrador: solo datos de su centro comercial
 *       - Super Admin: datos globales o filtrados por centro
 *
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: mallId
 *         schema:
 *           type: integer
 *         description: ID del centro comercial (solo para Super Admin)
 *         example: 2
 *
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicio del rango (YYYY-MM-DD)
 *         example: "2024-11-01"
 *
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha fin del rango (YYYY-MM-DD)
 *         example: "2024-11-30"
 *
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado de la reserva (opcional)
 *         example: "Activa"
 *
 *       - in: query
 *         name: courtId
 *         schema:
 *           type: integer
 *         description: ID de la cancha (opcional)
 *         example: 5
 *
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Año para calcular nuevos usuarios por mes
 *         example: 2024
 *
 *     responses:
 *       200:
 *         description: Dashboard obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *
 *       401:
 *         description: No autorizado
 *
 *       403:
 *         description: Sin permisos para acceder al dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No tienes permisos para acceder a este recurso"
 *
 *       500:
 *         description: Error interno del servidor
 */

import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getDashboard } from "../controllers/dashboard.js";

const router = express.Router();

router.get("/", authenticateToken, getDashboard);

export default router;