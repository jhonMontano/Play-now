/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentRequest:
 *       type: object
 *       required:
 *         - amount
 *         - currency
 *         - customerEmail
 *         - reference
 *         - userType
 *         - userLegalId
 *         - userLegalIdType
 *       properties:
 *         amount:
 *           type: number
 *           description: Monto del pago en pesos colombianos
 *           example: 50000
 *         currency:
 *           type: string
 *           description: Moneda de la transacción
 *           example: COP
 *         customerEmail:
 *           type: string
 *           format: email
 *           description: Correo electrónico del cliente
 *           example: usuario@example.com
 *         reference:
 *           type: string
 *           description: Referencia única de la reserva o transacción
 *           example: reserva-123
 *         userType:
 *           type: integer
 *           description: Tipo de usuario (0 natural, 1 jurídica)
 *           example: 0
 *         userLegalId:
 *           type: string
 *           description: Documento de identidad del usuario
 *           example: 123456789
 *         userLegalIdType:
 *           type: string
 *           description: Tipo de documento legal
 *           example: CC
 *         financialInstitutionCode:
 *           type: string
 *           description: Código de la entidad financiera para PSE
 *           example: 1001
 *
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         transaction:
 *           type: object
 *           description: Datos de la transacción generada por Wompi
 *
 *     WebhookResponse:
 *       type: object
 *       properties:
 *         received:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Pagos con PSE y Bancolombia a través de Wompi
 */

/**
 * @swagger
 * /api/payments/pse:
 *   post:
 *     summary: Crear pago con PSE
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       200:
 *         description: Pago PSE creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       500:
 *         description: Error al crear el pago PSE
 */

/**
 * @swagger
 * /api/payments/bancolombia:
 *   post:
 *     summary: Crear pago con Bancolombia
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       200:
 *         description: Pago Bancolombia creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       500:
 *         description: Error al crear el pago Bancolombia
 */

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Recibir notificaciones de webhook de Wompi
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Evento enviado por Wompi
 *     responses:
 *       200:
 *         description: Webhook recibido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WebhookResponse'
 *       500:
 *         description: Error en el webhook
 */

import express from 'express';
import { createPSEPayment, createBancolombiaPayment, handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/pse', createPSEPayment);
router.post('/bancolombia', createBancolombiaPayment);
router.post('/webhook', handleWebhook);

export default router;