
/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - courtId
 *         - fechaReserva
 *         - horaReserva
 *         - cantidadHoras
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado de la reserva
 *         fechaReserva:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva (YYYY-MM-DD)
 *           example: "2024-11-15"
 *         horaReserva:
 *           type: string
 *           description: Hora de inicio de la reserva (HH:MM formato 24h)
 *           pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           example: "14:00"
 *         cantidadHoras:
 *           type: integer
 *           description: Número de horas reservadas (1-8)
 *           minimum: 1
 *           maximum: 8
 *           example: 2
 *         valorTotal:
 *           type: number
 *           format: float
 *           description: Valor total de la reserva calculado automáticamente
 *           example: 90000.00
 *         estado:
 *           type: string
 *           enum: [Activa, Cancelada, Completada]
 *           description: Estado actual de la reserva
 *           example: "Activa"
 *         courtId:
 *           type: integer
 *           description: ID de la cancha reservada
 *           example: 1
 *         userId:
 *           type: integer
 *           description: ID del usuario que hizo la reserva
 *           example: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         cancha:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             nombreCancha:
 *               type: string
 *             direccion:
 *               type: string
 *             valorHora:
 *               type: integer
 *             horarioInicio:
 *               type: string
 *             horarioFin:
 *               type: string
 *             diasDisponibles:
 *               type: string
 *             mall:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombreCentro:
 *                   type: string
 *         cliente:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             primerNombre:
 *               type: string
 *             primerApellido:
 *               type: string
 *             correo:
 *               type: string
 *             celular:
 *               type: string
 * 
 *     ReservationInput:
 *       type: object
 *       required:
 *         - courtId
 *         - horaReserva
 *         - cantidadHoras
 *       properties:
 *         courtId:
 *           type: integer
 *           description: ID de la cancha a reservar
 *           example: 3
 *         fechaReserva:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva (opcional, por defecto fecha actual)
 *           example: "2024-11-20"
 *         horaReserva:
 *           type: string
 *           description: Hora de inicio de la reserva (HH:MM)
 *           example: "16:00"
 *         cantidadHoras:
 *           type: integer
 *           description: Cantidad de horas a reservar (1-8)
 *           minimum: 1
 *           maximum: 8
 *           example: 1
 * 
 *     ReservationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Reserva creada exitosamente"
 *         reserva:
 *           $ref: '#/components/schemas/Reservation'
 * 
 *     CancelReservationInput:
 *       type: object
 *       properties:
 *         motivo:
 *           type: string
 *           description: Motivo opcional de la cancelación
 *           example: "Cambio de planes"
 * 
 *     CancelResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Reserva cancelada correctamente"
 *         reserva:
 *           $ref: '#/components/schemas/Reservation'
 * 
 *     ReservationStats:
 *       type: object
 *       properties:
 *         estado:
 *           type: string
 *           example: "Activa"
 *         total:
 *           type: integer
 *           example: 5
 *         ingresosTotales:
 *           type: number
 *           format: float
 *           example: 225000.00
 * 
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         paginaActual:
 *           type: integer
 *           example: 1
 *         totalPaginas:
 *           type: integer
 *           example: 3
 *         totalReservas:
 *           type: integer
 *           example: 25
 *         hasNext:
 *           type: boolean
 *           example: true
 *         hasPrev:
 *           type: boolean
 *           example: false
 * 
 *     ReservationsPaginatedResponse:
 *       type: object
 *       properties:
 *         reservas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reservation'
 *         paginacion:
 *           $ref: '#/components/schemas/PaginationInfo'
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
 *   name: Reservations
 *   description: Gestión de reservas de canchas (Solo usuarios con idRol = 3 pueden crear reservas)
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Crear una nueva reserva
 *     description: |
 *       **Solo usuarios con idRol = 3 pueden crear reservas**
 *       
 *       **Validaciones:**
 *       - La reserva debe estar dentro del horario de la cancha
 *       - La fecha debe ser un día que opere la cancha
 *       - No se permiten reservas en el pasado
 *       - No se permiten solapamientos de horarios
 *       - Cantidad de horas entre 1 y 8
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *           examples:
 *             reservaEjemplo:
 *               summary: Reserva básica
 *               value:
 *                 courtId: 5
 *                 fechaReserva: "2024-11-15"
 *                 horaReserva: "18:00"
 *                 cantidadHoras: 2
 *             reservaHoy:
 *               summary: Reserva para hoy (fecha opcional)
 *               value:
 *                 courtId: 3
 *                 horaReserva: "20:00"
 *                 cantidadHoras: 1
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
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
 *               soloUsuarios:
 *                 value:
 *                   message: "Solo los usuarios pueden realizar reservas"
 *               camposObligatorios:
 *                 value:
 *                   message: "Los campos 'courtId', 'horaReserva' y 'cantidadHoras' son obligatorios"
 *               formatoHora:
 *                 value:
 *                   message: "Formato de hora inválido. Use HH:MM (24 horas)"
 *               horasInvalidas:
 *                 value:
 *                   message: "La cantidad de horas debe estar entre 1 y 8"
 *               canchaNoExiste:
 *                 value:
 *                   message: "La cancha seleccionada no existe"
 *               horarioNoDisponible:
 *                 value:
 *                   message: "La cancha solo está disponible de 08:00 a 22:00"
 *               diaNoOpera:
 *                 value:
 *                   message: "La cancha no opera los Domingo. Días disponibles: Lunes a Sábado"
 *               reservaPasada:
 *                 value:
 *                   message: "No se pueden hacer reservas en fechas/horas pasadas"
 *               canchaOcupada:
 *                 value:
 *                   message: "La cancha ya está reservada para esa fecha y hora"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Obtener reservas según el rol del usuario
 *     description: |
 *       **Comportamiento por rol:**
 *       - **Usuario (idRol=3)**: Ve solo sus propias reservas
 *       - **Administrador (idRol=2)**: Ve todas las reservas de su centro comercial
 *       - **Super Admin (idRol=1)**: Ve todas las reservas de todos los centros
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Activa, Cancelada, Completada]
 *         description: Filtrar por estado de reserva
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha específica (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Límite de resultados por página
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationsPaginatedResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No tienes permisos para ver las reservas"
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reservations/mall/{mallId}:
 *   get:
 *     summary: Obtener reservas por centro comercial
 *     description: |
 *       **Solo para administradores y super admin**
 *       - Los administradores solo pueden ver reservas de su propio centro comercial
 *       - Los super admin pueden ver reservas de cualquier centro comercial
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mallId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del centro comercial
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Activa, Cancelada, Completada]
 *         description: Filtrar por estado de reserva
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha específica
 *     responses:
 *       200:
 *         description: Lista de reservas del centro comercial
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               sinPermisos:
 *                 value:
 *                   message: "No tienes permisos para acceder a este recurso"
 *               centroNoPermitido:
 *                 value:
 *                   message: "No tienes permisos para acceder a este centro comercial"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Centro comercial no encontrado
 */

/**
 * @swagger
 * /api/reservations/cancel/{id}:
 *   put:
 *     summary: Cancelar una reserva
 *     description: |
 *       **Permisos para cancelar:**
 *       - **Usuario**: Puede cancelar solo SUS reservas
 *       - **Administrador**: Puede cancelar cualquier reserva de SU centro comercial
 *       - **Super Admin**: Puede cancelar cualquier reserva
 *       
 *       **No se pueden cancelar reservas pasadas**
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a cancelar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelReservationInput'
 *     responses:
 *       200:
 *         description: Reserva cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CancelResponse'
 *       400:
 *         description: Error en la cancelación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               reservaNoEncontrada:
 *                 value:
 *                   message: "Reserva no encontrada"
 *               sinPermisos:
 *                 value:
 *                   message: "No tienes permisos para cancelar esta reserva"
 *               reservaPasada:
 *                 value:
 *                   message: "No se pueden cancelar reservas pasadas"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 */

import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createReservation,
  getReservations,
  getReservationsByMall,
  cancelReservation,
} from "../controllers/reservation.js";

const router = Router();

router.post("/", authenticateToken, createReservation);
router.get("/", authenticateToken, getReservations);
router.get("/mall/:mallId", authenticateToken, getReservationsByMall);
router.put("/cancel/:id", authenticateToken, cancelReservation);

export default router;