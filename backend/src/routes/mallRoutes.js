/**
 * @swagger
 * components:
 *   schemas:
 *     Mall:
 *       type: object
 *       required:
 *         - nombreCentro
 *         - direccion
 *         - telefono
 *         - ciudad
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del centro comercial
 *         nombreCentro:
 *           type: string
 *           description: Nombre del centro comercial
 *           example: "Centro Mayor"
 *         direccion:
 *           type: string
 *           description: Dirección física del centro comercial
 *           example: "Calle 123 #45-67"
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto
 *           example: "+57 601 1234567"
 *         ciudad:
 *           type: string
 *           description: Ciudad donde se encuentra el centro comercial
 *           example: "Bogotá"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de actualización
 *         administrador:
 *           $ref: '#/components/schemas/User'
 * 
 *     MallInput:
 *       type: object
 *       required:
 *         - nombreCentro
 *         - direccion
 *         - telefono
 *         - ciudad
 *       properties:
 *         nombreCentro:
 *           type: string
 *           example: "Plaza Central"
 *         direccion:
 *           type: string
 *           example: "Avenida Principal 123"
 *         telefono:
 *           type: string
 *           example: "+57 601 7654321"
 *         ciudad:
 *           type: string
 *           example: "Medellín"
 * 
 *     AdminInput:
 *       type: object
 *       required:
 *         - tipoDocumento
 *         - numeroDocumento
 *         - correo
 *         - celular
 *         - direccion
 *         - primerNombre
 *         - primerApellido
 *       properties:
 *         tipoDocumento:
 *           type: string
 *           enum: [CC, NIT]
 *           example: "CC"
 *         numeroDocumento:
 *           type: string
 *           example: "123456789"
 *         primerNombre:
 *           type: string
 *           example: "Carlos"
 *         segundoNombre:
 *           type: string
 *           example: "Andrés"
 *         primerApellido:
 *           type: string
 *           example: "Gómez"
 *         segundoApellido:
 *           type: string
 *           example: "López"
 *         razonSocial:
 *           type: string
 *           example: "Empresa XYZ SAS"
 *         correo:
 *           type: string
 *           format: email
 *           example: "admin@plazacentral.com"
 *         celular:
 *           type: string
 *           example: "3001234567"
 *         direccion:
 *           type: string
 *           example: "Carrera 45 #26-89"
 * 
 *     CreateMallRequest:
 *       type: object
 *       required:
 *         - mall
 *         - admin
 *       properties:
 *         mall:
 *           $ref: '#/components/schemas/MallInput'
 *         admin:
 *           $ref: '#/components/schemas/AdminInput'
 * 
 *     UpdateMallRequest:
 *       type: object
 *       properties:
 *         mall:
 *           $ref: '#/components/schemas/MallInput'
 *         admin:
 *           $ref: '#/components/schemas/AdminInput'
 * 
 *     MallWithAdminResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         mall:
 *           $ref: '#/components/schemas/Mall'
 *         administrador:
 *           $ref: '#/components/schemas/User'
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
 *   name: Malls
 *   description: Gestión de centros comerciales y sus administradores
 */

/**
 * @swagger
 * /api/malls:
 *   post:
 *     summary: Crear un nuevo centro comercial y su administrador
 *     description: Solo accesible para super administradores (idRol = 1)
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMallRequest'
 *           examples:
 *             ejemploCompleto:
 *               value:
 *                 mall:
 *                   nombreCentro: "Centro Comercial Andino"
 *                   direccion: "Carrera 11 #82-71"
 *                   telefono: "+57 601 3456789"
 *                   ciudad: "Bogotá"
 *                 admin:
 *                   tipoDocumento: "CC"
 *                   numeroDocumento: "987654321"
 *                   primerNombre: "Ana"
 *                   segundoNombre: "María"
 *                   primerApellido: "Rodríguez"
 *                   segundoApellido: "Pérez"
 *                   correo: "ana.rodriguez@andino.com"
 *                   celular: "3109876543"
 *                   direccion: "Calle 82 #11-45"
 *     responses:
 *       201:
 *         description: Centro comercial y administrador creados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MallWithAdminResponse'
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
 *               accesoDenegado:
 *                 value:
 *                   message: "Acceso denegado. Solo el super administrador puede crear centros comerciales."
 *               campoObligatorio:
 *                 value:
 *                   message: "El campo 'nombreCentro' del centro comercial es obligatorio."
 *               mallExistente:
 *                 value:
 *                   message: "Ya existe un centro comercial con el nombre 'Centro Mayor'."
 *               adminExistente:
 *                 value:
 *                   message: "El usuario admin@ejemplo.com ya es administrador del centro comercial 'Plaza Central'"
 *       401:
 *         description: No autorizado - Token inválido
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/malls:
 *   get:
 *     summary: Obtener lista de todos los centros comerciales
 *     description: Incluye la información del administrador de cada centro
 *     tags: [Malls]
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
 *         description: Lista de centros comerciales obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mall'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/malls/{id}:
 *   get:
 *     summary: Obtener un centro comercial por ID
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del centro comercial
 *     responses:
 *       200:
 *         description: Centro comercial encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mall'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Centro comercial no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Centro comercial no encontrado"
 */

/**
 * @swagger
 * /api/malls/{id}:
 *   put:
 *     summary: Actualizar un centro comercial y su administrador
 *     description: Solo accesible para super administradores (idRol = 1)
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del centro comercial a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMallRequest'
 *           examples:
 *             actualizarMall:
 *               value:
 *                 mall:
 *                   nombreCentro: "Nuevo Nombre Centro"
 *                   telefono: "+57 601 9998888"
 *             actualizarAdmin:
 *               value:
 *                 admin:
 *                   correo: "nuevo.email@centro.com"
 *                   celular: "3112223344"
 *     responses:
 *       200:
 *         description: Centro comercial y administrador actualizados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MallWithAdminResponse'
 *       400:
 *         description: Error en la actualización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               accesoDenegado:
 *                 value:
 *                   message: "Acceso denegado. Solo el super administrador puede actualizar centros comerciales"
 *               noEncontrado:
 *                 value:
 *                   message: "Centro comercial no encontrado"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Centro comercial no encontrado
 */

/**
 * @swagger
 * /api/malls/{id}:
 *   delete:
 *     summary: Eliminar un centro comercial y su administrador
 *     description: Solo accesible para super administradores (idRol = 1). Elimina tanto el centro comercial como el usuario administrador asociado.
 *     tags: [Malls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del centro comercial a eliminar
 *     responses:
 *       200:
 *         description: Centro comercial y administrador eliminados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Centro comercial y su administrador eliminados correctamente"
 *       400:
 *         description: Error en la eliminación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               accesoDenegado:
 *                 value:
 *                   message: "Acceso denegado. Solo el super administrador puede eliminar centros comerciales"
 *               noEncontrado:
 *                 value:
 *                   message: "Centro comercial no encontrado"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Centro comercial no encontrado
 */

import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createMallAndAdmin,
  getAllMalls,
  getMallById,
  updateMall,
  deleteMall,
} from "../controllers/mallController.js";

const router = express.Router();

router.post("/", authenticateToken, createMallAndAdmin);
router.get("/", authenticateToken, getAllMalls);
router.get("/:id", authenticateToken, getMallById);
router.put("/:id", authenticateToken, updateMall);
router.delete("/:id", authenticateToken, deleteMall);

export default router;
