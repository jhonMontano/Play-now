/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - tipoDocumento
 *         - numeroDocumento
 *         - correo
 *         - celular
 *         - direccion
 *         - idRol
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del usuario
 *         tipoDocumento:
 *           type: string
 *           enum: [CC, NIT]
 *           description: Tipo de documento de identificación
 *         numeroDocumento:
 *           type: string
 *           description: Número de documento único
 *         primerNombre:
 *           type: string
 *           description: Primer nombre del usuario
 *         segundoNombre:
 *           type: string
 *           description: Segundo nombre del usuario
 *         primerApellido:
 *           type: string
 *           description: Primer apellido del usuario
 *         segundoApellido:
 *           type: string
 *           description: Segundo apellido del usuario
 *         razonSocial:
 *           type: string
 *           description: Razón social (para NIT)
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico único
 *         celular:
 *           type: string
 *           description: Número de celular
 *         direccion:
 *           type: string
 *           description: Dirección de residencia
 *         idRol:
 *           type: integer
 *           description: ID del rol del usuario
 *         idMall:
 *           type: integer
 *           description: ID del centro comercial asignado
 *         activo:
 *           type: boolean
 *           description: Estado del usuario
 *         intentosFallidos:
 *           type: integer
 *           description: Número de intentos fallidos de login
 *         bloqueadoHasta:
 *           type: string
 *           format: date-time
 *           description: Fecha hasta la cual está bloqueado
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de actualización
 * 
 *     UserInput:
 *       type: object
 *       required:
 *         - tipoDocumento
 *         - numeroDocumento
 *         - correo
 *         - celular
 *         - direccion
 *         - idRol
 *       properties:
 *         tipoDocumento:
 *           type: string
 *           enum: [CC, NIT]
 *         numeroDocumento:
 *           type: string
 *         primerNombre:
 *           type: string
 *         segundoNombre:
 *           type: string
 *         primerApellido:
 *           type: string
 *         segundoApellido:
 *           type: string
 *         razonSocial:
 *           type: string
 *         correo:
 *           type: string
 *           format: email
 *         celular:
 *           type: string
 *         direccion:
 *           type: string
 *         idRol:
 *           type: integer
 *         idMall:
 *           type: integer
 *         activo:
 *           type: boolean
 * 
 *     UserUpdate:
 *       type: object
 *       properties:
 *         primerNombre:
 *           type: string
 *         segundoNombre:
 *           type: string
 *         primerApellido:
 *           type: string
 *         segundoApellido:
 *           type: string
 *         razonSocial:
 *           type: string
 *         correo:
 *           type: string
 *           format: email
 *         celular:
 *           type: string
 *         direccion:
 *           type: string
 *         idRol:
 *           type: integer
 *         idMall:
 *           type: integer
 *         activo:
 *           type: boolean
 * 
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 * 
 *     ResetPasswordConfirm:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           description: Token de recuperación
 *         newPassword:
 *           type: string
 *           format: password
 *           description: Nueva contraseña
 *           minLength: 6
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
 *   name: Users
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado exitosamente"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El documento ya está registrado"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener lista de todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Límite de resultados por página
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado - Token inválido o faltante
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado exitosamente"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Error en la actualización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se puede modificar el estado 'activo' de un usuario con centro comercial asignado"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado exitosamente"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Correo de recuperación enviado"
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 */

/**
 * @swagger
 * /api/users/reset-password/confirm:
 *   post:
 *     summary: Confirmar restablecimiento de contraseña
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordConfirm'
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       400:
 *         description: Error en la confirmación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido o expirado"
 */

import express from "express";
import {
  register,
  listUsers,
  getUser,
  editUser,
  removeUser,
  resetPassword,
  resetPasswordConfirm,
} from "../controllers/user.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.get("/", authenticateToken, listUsers);
router.get("/:id", authenticateToken, getUser);
router.put("/:id", authenticateToken, editUser);
router.delete("/:id", authenticateToken, removeUser);
router.post("/reset-password", resetPassword);
router.post("/reset-password/confirm", resetPasswordConfirm);

export default router;
