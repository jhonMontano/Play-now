/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - correo
 *         - password
 *       properties:
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "usuario@ejemplo.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *           example: "miContraseña123"
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Inicio de sesión exitoso"
 *         token:
 *           type: string
 *           description: JWT token para autenticación
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             correo:
 *               type: string
 *               example: "usuario@ejemplo.com"
 *             numeroDocumento:
 *               type: string
 *               example: "123456789"
 *             idRol:
 *               type: integer
 *               example: 2
 *             mallId:
 *               type: integer
 *               nullable: true
 *               example: 1
 * 
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *           description: Contraseña actual
 *           example: "contraseñaActual123"
 *         newPassword:
 *           type: string
 *           format: password
 *           description: Nueva contraseña
 *           minLength: 6
 *           example: "nuevaContraseña456"
 * 
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
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
 *   name: Authentication
 *   description: Endpoints para autenticación y gestión de sesiones
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas o usuario bloqueado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               correoNoRegistrado:
 *                 value:
 *                   message: "Correo no registrado"
 *               contraseñaIncorrecta:
 *                 value:
 *                   message: "Contraseña incorrecta"
 *               usuarioBloqueado:
 *                 value:
 *                   message: "Usuario bloqueado. Intenta de nuevo en 10 minutos. Debe recuperar la contraseña."
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               success:
 *                 value:
 *                   message: "Sesión cerrada correctamente"
 *       401:
 *         description: No autorizado - Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tokenNoProvisto:
 *                 value:
 *                   message: "Token no proporcionado"
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Cambiar contraseña del usuario autenticado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               success:
 *                 value:
 *                   message: "Contraseña actualizada exitosamente"
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               camposObligatorios:
 *                 value:
 *                   message: "Los campos son obligatorios"
 *               contraseñaActualIncorrecta:
 *                 value:
 *                   message: "La contraseña actual es incorrecta"
 *               mismaContraseña:
 *                 value:
 *                   message: "La nueva contraseña no puede ser igual a la actual"
 *       401:
 *         description: No autorizado - Token inválido
 *       500:
 *         description: Error del servidor
 */

import express from "express";
import { login, logout, changePassword } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/logout", authenticateToken, logout);

router.put("/change-password", authenticateToken, changePassword);

export default router;
