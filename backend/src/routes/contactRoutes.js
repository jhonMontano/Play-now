/**
 * @swagger
 * components:
 *   schemas:
 *     ContactForm:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - tipo
 *         - mensaje
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del remitente
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del remitente
 *         tipo:
 *           type: string
 *           description: Tipo de consulta o perfil del remitente
 *         mensaje:
 *           type: string
 *           description: Mensaje enviado desde el formulario de contacto
 */

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Envío de mensajes desde el formulario de contacto
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Enviar mensaje de contacto al administrador
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactForm'
 *     responses:
 *       200:
 *         description: Mensaje enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mensaje enviado correctamente"
 *       400:
 *         description: Datos inválidos o incompletos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todos los campos son obligatorios"
 *       500:
 *         description: Error del servidor al enviar el correo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al enviar el mensaje"
 */

import express from "express";
import { submitContactForm } from "../controllers/contact.js";

const router = express.Router();

router.post("/", submitContactForm);

export default router;
