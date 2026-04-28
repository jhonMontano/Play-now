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
 *       - Estado de reserva
 *       - ID de cancha
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
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado de la reserva (Activa, Cancelada, Completada)
 *         example: "Activa"
 *       - in: query
 *         name: courtId
 *         schema:
 *           type: integer
 *         description: ID de la cancha (opcional)
 *         example: 5
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

/**
 * @swagger
 * /api/admin/stats/revenue:
 *   get:
 *     summary: Obtener ingresos totales
 *     description: |
 *       Retorna el total de ingresos generados por las reservas.
 *
 *       **Permisos:**
 *       - Administrador: ingresos de su centro comercial
 *       - Super Admin: ingresos globales o por centro comercial
 *
 *       **Filtros opcionales:**
 *       - Rango de fechas
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mallId
 *         schema:
 *           type: integer
 *         description: ID del centro comercial (solo Super Admin)
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
 *         description: Ingresos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ingresos obtenidos correctamente"
 *                 totalIngreso:
 *                   type: number
 *                   format: float
 *                   example: 1250000.50
 *                 cantidad:
 *                   type: integer
 *                   example: 25
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/admin/stats/users-count:
 *   get:
 *     summary: Obtener conteo de usuarios (Solo Super Admin)
 *     description: |
 *       Retorna el total de usuarios registrados en el sistema, desglosados por rol.
 *
 *       **Restricción:** Solo accesible para Super Admin (idRol = 1)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conteo de usuarios obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conteo de usuarios obtenido correctamente"
 *                 usersByRole:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rol:
 *                         type: string
 *                         example: "Administrador"
 *                       total:
 *                         type: integer
 *                         example: 5
 *                 totalUsers:
 *                   type: integer
 *                   example: 125
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo el super administrador puede acceder a esta información
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/admin/stats/malls-count:
 *   get:
 *     summary: Obtener conteo de centros comerciales (Solo Super Admin)
 *     description: |
 *       Retorna el total de centros comerciales registrados en el sistema, desglosados por ciudad.
 *
 *       **Restricción:** Solo accesible para Super Admin (idRol = 1)
 *     tags: [AdminStats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conteo de centros comerciales obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conteo de centros comerciales obtenido correctamente"
 *                 mallsByCity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ciudad:
 *                         type: string
 *                         example: "Medellín"
 *                       total:
 *                         type: integer
 *                         example: 5
 *                 totalMalls:
 *                   type: integer
 *                   example: 15
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo el super administrador puede acceder a esta información
 *       500:
 *         description: Error del servidor
 */

import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
    getAdminStats,
    getRevenue,
    getUsersCount,
    getMallsCount
} from "../controllers/adminStats.js";

const router = express.Router();

router.get("/", authenticateToken, getAdminStats);
router.get("/revenue", authenticateToken, getRevenue);
router.get("/users-count", authenticateToken, getUsersCount);
router.get("/malls-count", authenticateToken, getMallsCount);

export default router;