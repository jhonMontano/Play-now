/**
 * @swagger
 * components:
 *   schemas:
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error al procesar la solicitud
 *         error:
 *           type: string
 *           example: Internal Server Error
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
 *           example: Administrador
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
 *           example: Activa
 *         totalReservas:
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
 *           example: Dashboard obtenido correctamente
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
 *
 *     SuperAdminKPIs:
 *       type: object
 *       properties:
 *         totalMalls:
 *           type: integer
 *           example: 12
 *         totalSports:
 *           type: integer
 *           example: 8
 *         totalActiveCourts:
 *           type: integer
 *           example: 45
 *         monthReservations:
 *           type: integer
 *           example: 210
 *
 *     MallAdminKPIs:
 *       type: object
 *       properties:
 *         totalCourts:
 *           type: integer
 *           example: 15
 *         todayReservations:
 *           type: integer
 *           example: 8
 *         monthReservations:
 *           type: integer
 *           example: 120
 *         availableCourtNow:
 *           type: integer
 *           example: 5
 *
 *     MallCourt:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         cancha:
 *           type: string
 *           example: Cancha Sintética Norte
 *         deporte:
 *           type: string
 *           example: Fútbol
 *         cantidad:
 *           type: integer
 *           example: 10
 *         valorHora:
 *           type: number
 *           example: 85000
 *         estado:
 *           type: string
 *           example: activo
 *         disponibilidad:
 *           type: string
 *           example: Disponible
 *
 *     RecentReservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         usuario:
 *           type: string
 *           example: Juan Pérez
 *         cancha:
 *           type: string
 *           example: Cancha Central
 *         deporte:
 *           type: string
 *           example: Tenis
 *         fecha:
 *           type: string
 *           format: date
 *           example: 2026-05-01
 *         hora:
 *           type: string
 *           example: 18:00
 *         duracion:
 *           type: string
 *           example: 2 horas
 *         estado:
 *           type: string
 *           example: Activa
 *
 *     TopCourt:
 *       type: object
 *       properties:
 *         cancha:
 *           type: string
 *           example: Cancha Elite
 *         deporte:
 *           type: string
 *           example: Pádel
 *         reservas:
 *           type: integer
 *           example: 30
 *         mes:
 *           type: string
 *           example: mayo 2026
 *         horasOcupadas:
 *           type: integer
 *           example: 120
 *         porcentajeOcupacion:
 *           type: string
 *           example: 65%
 *
 *     DayReservationStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 15
 *         hora:
 *           type: string
 *           example: 14:00
 *         cancha:
 *           type: string
 *           example: Cancha VIP
 *         usuario:
 *           type: string
 *           example: Carlos Ramírez
 *         duracion:
 *           type: string
 *           example: 3 horas
 *         fecha:
 *           type: string
 *           format: date
 *         estado:
 *           type: string
 *           example: Activa
 */

/**
 * @swagger
 * tags:
 *   - name: Dashboard - Super Admin
 *     description: |
 *       Endpoints exclusivos para Super Administradores (idRol = 1)
 *       Información global del sistema, estadísticas generales y gestión de administradores
 *   - name: Dashboard - Admin
 *     description: |
 *       Endpoints para Administradores de Centros (idRol = 2)
 *       Información del centro comercial asignado, canchas y reservas
 */


/**
 * @swagger
 * /api/admin/dashboard/kpis:
 *   get:
 *     summary: Obtener KPIs del Super Admin
 *     description: |
 *       **[SUPER ADMIN ONLY]** Retorna indicadores clave de desempeño globales
 *       
 *       Métricas incluidas:
 *       - Total de centros comerciales
 *       - Total de deportes activos
 *       - Total de canchas activas
 *       - Reservas del mes actual
 *       
 *       Permisos:
 *       - Requerido: idRol = 1 (Super Admin)
 *     tags: [Dashboard - Super Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: KPIs obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: KPIs del Super Administrador obtenidos correctamente
 *                 data:
 *                   $ref: '#/components/schemas/SuperAdminKPIs'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Usuario sin permisos (solo Super Admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/dashboard/mall-kpis:
 *   get:
 *     summary: Obtener KPIs del centro comercial
 *     description: |
 *       **[ADMIN ONLY]** Retorna indicadores clave de desempeño del centro comercial del administrador
 *       
 *       Métricas incluidas:
 *       - Total de canchas del mall
 *       - Reservas de hoy
 *       - Reservas del mes actual
 *       - Canchas disponibles ahora
 *       
 *       Permisos:
 *       - Requerido: idRol = 2 (Admin)
 *     tags: [Dashboard - Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: KPIs del centro obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: KPIs del centro obtenidos correctamente
 *                 data:
 *                   $ref: '#/components/schemas/MallAdminKPIs'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Usuario sin permisos (solo Admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/dashboard/my-courts:
 *   get:
 *     summary: Obtener mis canchas del centro
 *     description: |
 *       **[ADMIN ONLY]** Retorna lista completa de canchas del centro comercial del administrador
 *       
 *       Información incluida:
 *       - ID y nombre de la cancha
 *       - Deporte que se juega
 *       - Valor por hora
 *       - Estado (activo/inactivo)
 *       - Disponibilidad actual
 *       
 *       Permisos:
 *       - Requerido: idRol = 2 (Admin)
 *       - Solo ve sus propias canchas
 *     tags: [Dashboard - Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Canchas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Canchas del centro obtenidas correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MallCourt'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Usuario sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/dashboard/recent-reservations:
 *   get:
 *     summary: Obtener reservas recientes
 *     description: |
 *       **[ADMIN ONLY]** Retorna las reservas más recientes del centro comercial
 *       
 *       Información incluida:
 *       - Usuario que realizó la reserva
 *       - Cancha reservada
 *       - Deporte
 *       - Fecha, hora y duración
 *       - Estado (Activa, Cancelada, Completada)
 *       
 *       Permisos:
 *       - Requerido: idRol = 2 (Admin)
 *       - Solo ve reservas de su mall
 *     tags: [Dashboard - Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad máxima de registros (máximo 50)
 *
 *     responses:
 *       200:
 *         description: Reservas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reservas recientes obtenidas correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecentReservation'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Usuario sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/dashboard/top-courts:
 *   get:
 *     summary: Obtener top 5 canchas más reservadas
 *     description: |
 *       **[ADMIN ONLY]** Retorna las canchas más populares del mes actual
 *       
 *       Información incluida:
 *       - Nombre y deporte de la cancha
 *       - Total de reservas en el mes
 *       - Horas ocupadas
 *       - Porcentaje de ocupación
 *       
 *       Permisos:
 *       - Requerido: idRol = 2 (Admin)
 *       - Solo ve sus propias canchas
 *     tags: [Dashboard - Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Top canchas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Top 5 canchas obtenidas correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TopCourt'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Usuario sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/dashboard/day-status:
 *   get:
 *     summary: Obtener estado de reservas del día
 *     description: |
 *       **[ADMIN ONLY]** Retorna todas las reservas programadas para hoy
 *       
 *       Información incluida:
 *       - Hora de la reserva
 *       - Cancha
 *       - Usuario
 *       - Duración
 *       - Estado
 *       
 *       Permisos:
 *       - Requerido: idRol = 2 (Admin)
 *       - Solo ve reservas de su mall
 *     tags: [Dashboard - Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Estado del día obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado del día obtenido correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DayReservationStatus'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Usuario sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MallItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombreCentro:
 *           type: string
 *           example: Plaza Central
 *         ciudad:
 *           type: string
 *           example: Medellín
 *         totalCanchas:
 *           type: integer
 *           example: 15
 *         activo:
 *           type: boolean
 *           example: true
 *
 *     ActivityItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombreCentro:
 *           type: string
 *           example: Plaza Central
 *         ciudad:
 *           type: string
 *           example: Medellín
 *         reservasEstaSemanA:
 *           type: integer
 *           example: 24
 *         ingresos:
 *           type: number
 *           format: float
 *           example: 540000
 *         administrador:
 *           type: string
 *           example: Carlos Gómez
 *
 *     SportItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         deporte:
 *           type: string
 *           example: Fútbol
 *         totalCanchas:
 *           type: integer
 *           example: 5
 *         malls:
 *           type: integer
 *           example: 3
 *         activo:
 *           type: boolean
 *           example: true
 *
 *     AdminItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 52
 *         nombre:
 *           type: string
 *           example: Carlos Gómez López
 *         correo:
 *           type: string
 *           format: email
 *           example: admin@plaza.com
 *         mall:
 *           type: string
 *           example: Plaza Central
 *         ciudad:
 *           type: string
 *           example: Medellín
 *         celular:
 *           type: string
 *           example: 3001234567
 *         activo:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/admin/dashboard/malls:
 *   get:
 *     summary: Obtener centros comerciales registrados
 *     description: |
 *       **[SUPER ADMIN ONLY]** Retorna lista de todos los centros comerciales registrados en el sistema
 *       
 *       Permisos:
 *       - Requerido: idRol = 1 (Super Admin)
 *     tags: [Dashboard - Super Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Centros comerciales obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Centros comerciales obtenidos correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MallItem'
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acceso denegado - Solo Super Administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/dashboard/activity:
 *   get:
 *     summary: Obtener actividad de centros comerciales
 *     description: |
 *       **[SUPER ADMIN ONLY]** Retorna estadísticas de actividad (reservas e ingresos) de todos los centros
 *       
 *       Información incluida:
 *       - Reservas de esta semana
 *       - Ingresos totales
 *       - Administrador responsable
 *       
 *       Permisos:
 *       - Requerido: idRol = 1 (Super Admin)
 *     tags: [Dashboard - Super Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Actividad de centros obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Actividad de centros comerciales obtenida correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityItem'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acceso denegado - Solo Super Administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/dashboard/sports:
 *   get:
 *     summary: Obtener deportes registrados en el sistema
 *     description: |
 *       **[SUPER ADMIN ONLY]** Retorna lista de todos los deportes registrados y estadísticas
 *       
 *       Información incluida:
 *       - Total de canchas por deporte
 *       - Cantidad de malls que ofrecen el deporte
 *       - Estado (activo/inactivo)
 *       
 *       Permisos:
 *       - Requerido: idRol = 1 (Super Admin)
 *     tags: [Dashboard - Super Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Deportes obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deportes obtenidos correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SportItem'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acceso denegado - Solo Super Administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/dashboard/admins:
 *   get:
 *     summary: Obtener administradores de centros comerciales
 *     description: |
 *       **[SUPER ADMIN ONLY]** Retorna lista de todos los administradores de centros comerciales
 *       
 *       Información incluida:
 *       - Datos personales del administrador
 *       - Centro comercial asignado
 *       - Información de contacto
 *       - Estado (activo/inactivo)
 *       
 *       Permisos:
 *       - Requerido: idRol = 1 (Super Admin)
 *     tags: [Dashboard - Super Admin]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Administradores obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Administradores de centros obtenidos correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminItem'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acceso denegado - Solo Super Administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permisos para acceder a este recurso
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
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

router.get("/kpis", authenticateToken, getSuperAdminKPIsController);
router.get("/malls", authenticateToken, getRegisteredMallsController);
router.get("/activity", authenticateToken, getMallActivityController);
router.get("/sports", authenticateToken, getCreatedSportsController);
router.get("/admins", authenticateToken, getMallAdministratorsController);
router.get("/mall-kpis", authenticateToken, getMallAdminKPIsController);
router.get("/my-courts", authenticateToken, getMallCourtsController);
router.get("/recent-reservations", authenticateToken, getRecentReservationsController);
router.get("/top-courts", authenticateToken, getTopCourtsController);
router.get("/day-status", authenticateToken, getDayReservationStatusController);

export default router;