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
import {
    getSuperAdminKPIsController,
    getRegisteredMallsController,
    getMallActivityController,
    getCreatedSportsController,
    getMallAdministratorsController,
    getMallAdminKPIsController,
    getMallCourtsController,
    getRecentReservationsController,
    getTopCourtsController,
    getDayReservationStatusController
} from "../controllers/dashboardEndpointsController.js";

const router = express.Router();

/**
 * ================== ENDPOINT ORIGINAL (compatible hacia atrás) ==================
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Obtener dashboard completo del usuario
 *     description: Retorna el dashboard completo según el rol del usuario
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard obtenido correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permiso denegado
 */
router.get("/", authenticateToken, getDashboard);

/**
 * ================== ENDPOINTS SEPARADOS - SUPER ADMINISTRADOR ==================
 */

/**
 * @swagger
 * /dashboard/kpis:
 *   get:
 *     summary: KPIs del Super Administrador
 *     description: Obtiene las métricas principales del sistema
 *     tags: [Dashboard - Super Admin KPIs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: KPIs obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMalls: { type: integer }
 *                 totalSports: { type: integer }
 *                 totalActiveCourts: { type: integer }
 *                 monthReservations: { type: integer }
 */
router.get("/kpis", authenticateToken, getSuperAdminKPIsController);

/**
 * @swagger
 * /dashboard/malls:
 *   get:
 *     summary: Centros Comerciales Registrados
 *     description: Lista de todos los centros comerciales registrados en el sistema
 *     tags: [Dashboard - Super Admin Tables]
 *     security:
 *       - BearerAuth: []
 */
router.get("/malls", authenticateToken, getRegisteredMallsController);

/**
 * @swagger
 * /dashboard/activity:
 *   get:
 *     summary: Resumen de Actividad por Centro
 *     description: Información de actividad y desempeño de cada centro
 *     tags: [Dashboard - Super Admin Tables]
 *     security:
 *       - BearerAuth: []
 */
router.get("/activity", authenticateToken, getMallActivityController);

/**
 * @swagger
 * /dashboard/sports:
 *   get:
 *     summary: Deportes Creados
 *     description: Lista de todos los deportes registrados en el sistema
 *     tags: [Dashboard - Super Admin Tables]
 *     security:
 *       - BearerAuth: []
 */
router.get("/sports", authenticateToken, getCreatedSportsController);

/**
 * @swagger
 * /dashboard/admins:
 *   get:
 *     summary: Administradores de Centros
 *     description: Lista de administradores de centros comerciales
 *     tags: [Dashboard - Super Admin Tables]
 *     security:
 *       - BearerAuth: []
 */
router.get("/admins", authenticateToken, getMallAdministratorsController);

/**
 * ================== ENDPOINTS SEPARADOS - ADMIN CENTRO COMERCIAL ==================
 */

/**
 * @swagger
 * /dashboard/mall-kpis:
 *   get:
 *     summary: KPIs del Centro Comercial
 *     description: Obtiene las métricas principales del centro asignado
 *     tags: [Dashboard - Mall Admin KPIs]
 *     security:
 *       - BearerAuth: []
 */
router.get("/mall-kpis", authenticateToken, getMallAdminKPIsController);

/**
 * @swagger
 * /dashboard/my-courts:
 *   get:
 *     summary: Mis Canchas
 *     description: Lista de canchas del centro comercial asignado
 *     tags: [Dashboard - Mall Admin Tables]
 *     security:
 *       - BearerAuth: []
 */
router.get("/my-courts", authenticateToken, getMallCourtsController);

/**
 * @swagger
 * /dashboard/recent-reservations:
 *   get:
 *     summary: Reservas Recientes
 *     description: Lista de las reservas recientes del centro
 *     tags: [Dashboard - Mall Admin Tables]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de registros a retornar
 */
router.get("/recent-reservations", authenticateToken, getRecentReservationsController);

/**
 * @swagger
 * /dashboard/top-courts:
 *   get:
 *     summary: Top 5 Canchas Más Reservadas
 *     description: Las 5 canchas con más reservas del mes actual
 *     tags: [Dashboard - Mall Admin Tables]
 *     security:
 *       - BearerAuth: []
 */
router.get("/top-courts", authenticateToken, getTopCourtsController);

/**
 * @swagger
 * /dashboard/day-status:
 *   get:
 *     summary: Estado de Reservas del Día
 *     description: Estado de todas las reservas del día actual
 *     tags: [Dashboard - Mall Admin Tables]
 *     security:
 *       - BearerAuth: []
 */
router.get("/day-status", authenticateToken, getDayReservationStatusController);

export default router;