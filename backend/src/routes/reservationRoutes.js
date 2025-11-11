/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - courtId
 *         - horaReserva
 *         - cantidadHoras
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado de la reserva
 *         horaReserva:
 *           type: string
 *           description: Hora de la reserva en formato de cadena
 *           example: "14:00"
 *         cantidadHoras:
 *           type: integer
 *           description: Número de horas reservadas
 *           minimum: 1
 *           example: 2
 *         valorTotal:
 *           type: number
 *           format: float
 *           description: Valor total de la reserva
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
 *             nombreCancha:
 *               type: string
 *             direccion:
 *               type: string
 *             valorHora:
 *               type: integer
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
 *         horaReserva:
 *           type: string
 *           description: Hora de inicio de la reserva
 *           example: "16:00"
 *         cantidadHoras:
 *           type: integer
 *           description: Cantidad de horas a reservar
 *           minimum: 1
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
 *         cancha:
 *           type: string
 *           example: "Cancha Principal Fútbol 5"
 * 
 *     ReservationWithCourt:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         horaReserva:
 *           type: string
 *         cantidadHoras:
 *           type: integer
 *         valorTotal:
 *           type: number
 *         estado:
 *           type: string
 *         cancha:
 *           type: object
 *           properties:
 *             nombreCancha:
 *               type: string
 *             direccion:
 *               type: string
 *             valorHora:
 *               type: integer
 * 
 *     CancelResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Reserva cancelada correctamente"
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
 *   description: Gestión de reservas de canchas
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Crear una nueva reserva
 *     description: Los usuarios pueden reservar canchas disponibles
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
 *               value:
 *                 courtId: 5
 *                 horaReserva: "18:00"
 *                 cantidadHoras: 2
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
 *               camposObligatorios:
 *                 value:
 *                   message: "Los campos 'courtId', 'horaReserva' y 'cantidadHoras' son obligatorios"
 *               canchaNoExiste:
 *                 value:
 *                   message: "La cancha seleccionada no existe"
 *               canchaOcupada:
 *                 value:
 *                   message: "La cancha ya está reservada para esa hora"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Obtener las reservas del usuario autenticado
 *     description: Los usuarios pueden ver su historial de reservas
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados por página
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Activa, Cancelada, Completada]
 *         description: Filtrar por estado de reserva
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReservationWithCourt'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reservations/mall/{mallId}:
 *   get:
 *     summary: Obtener reservas por centro comercial (Solo administradores)
 *     description: Los administradores pueden ver todas las reservas de su centro comercial
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
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar reservas por fecha específica
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Activa, Cancelada, Completada]
 *         description: Filtrar por estado de reserva
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
 *               soloAdministrador:
 *                 value:
 *                   message: "Solo el administrador puede ver las reservas de su centro comercial"
 *               permisosCentro:
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
 *     description: Los usuarios pueden cancelar sus propias reservas, los administradores pueden cancelar cualquier reserva de su centro comercial
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
