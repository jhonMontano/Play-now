/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del rol
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del rol
 *           example: ADMIN
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *
 *     RoleInput:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del rol (debe ser único)
 *           example: ADMIN
 *
 *     RoleResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Rol creado exitosamente
 *         role:
 *           $ref: '#/components/schemas/Role'
 *
 *     RoleUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Rol actualizado exitosamente
 *         role:
 *           $ref: '#/components/schemas/Role'
 *
 *     RoleDeleteResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Rol eliminado correctamente
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error message
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
 *   name: Roles
 *   description: Gestión de roles de usuario (requiere autenticación JWT)
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear un nuevo rol
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - El nombre del rol es obligatorio
 *       - Se recomienda usar nombres en mayúsculas (ADMIN, USER, etc.)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *           examples:
 *             rolAdmin:
 *               value:
 *                 nombre: ADMIN
 *             rolUser:
 *               value:
 *                 nombre: USER
 *             rolModerator:
 *               value:
 *                 nombre: MODERATOR
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               campoObligatorio:
 *                 value:
 *                   message: "El nombre del rol es obligatorio"
 *               nombreDuplicado:
 *                 value:
 *                   message: "El rol ADMIN ya existe"
 *       401:
 *         description: No autorizado - Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Token no proporcionado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Error interno del servidor"
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     description: Retorna la lista completa de roles disponibles en el sistema
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *             examples:
 *               rolesEjemplo:
 *                 value:
 *                   - id: 1
 *                     nombre: ADMIN
 *                     createdAt: "2024-01-01T00:00:00.000Z"
 *                     updatedAt: "2024-01-01T00:00:00.000Z"
 *                   - id: 2
 *                     nombre: USER
 *                     createdAt: "2024-01-01T00:00:00.000Z"
 *                     updatedAt: "2024-01-01T00:00:00.000Z"
 *                   - id: 3
 *                     nombre: MODERATOR
 *                     createdAt: "2024-01-01T00:00:00.000Z"
 *                     updatedAt: "2024-01-01T00:00:00.000Z"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener un rol específico por ID
 *     description: Retorna los detalles de un rol específico
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del rol
 *         example: 1
 *     responses:
 *       200:
 *         description: Rol encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Rol no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Rol con ID 10 no encontrado"
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar un rol existente
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Permite modificar el nombre del rol
 *       - El nuevo nombre no debe estar duplicado
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del rol a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *           examples:
 *             actualizacionNombre:
 *               value:
 *                 nombre: SUPER_ADMIN
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleUpdateResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Rol no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Rol con ID 1 no encontrado"
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar un rol
 *     description: |
 *       **Requiere autenticación**
 *       
 *       - Elimina permanentemente el rol de la base de datos
 *       - **Importante**: Verificar que ningún usuario tenga asignado este rol antes de eliminar
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del rol a eliminar
 *         example: 3
 *     responses:
 *       200:
 *         description: Rol eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleDeleteResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Rol no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Rol con ID 3 no encontrado"
 *       500:
 *         description: Error del servidor
 */

import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js"
import {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole
} from "../controllers/roles.js"

const router = express.Router();

router.post("/", authenticateToken, createRole);
router.get("/", authenticateToken, getRoles);
router.get("/:id", authenticateToken, getRoleById);
router.put("/:id", authenticateToken, updateRole);
router.delete("/:id", authenticateToken, deleteRole);

export default router;