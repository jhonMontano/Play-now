/**
 * @swagger
 * components:
 *   schemas:
 *     Court:
 *       type: object
 *       required:
 *         - nombreCancha
 *         - horarioInicio
 *         - horarioFin
 *         - diasDisponibles
 *         - valorHora
 *         - telefono
 *         - direccion
 *         - responsable
 *         - capacidad
 *         - mallId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado de la cancha
 *         nombreCancha:
 *           type: string
 *           description: Nombre de la cancha
 *           example: "Cancha Principal Fútbol 5"
 *         horarioInicio:
 *           type: string
 *           format: time
 *           description: Hora de inicio de operación
 *           example: "08:00:00"
 *         horarioFin:
 *           type: string
 *           format: time
 *           description: Hora de cierre de operación
 *           example: "22:00:00"
 *         diasDisponibles:
 *           type: string
 *           description: Días de la semana disponibles separados por comas
 *           example: "Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo"
 *         valorHora:
 *           type: integer
 *           description: Valor por hora de alquiler en pesos
 *           minimum: 1
 *           example: 45000
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto (10 dígitos)
 *           pattern: '^\d{10}$'
 *           example: "3114567890"
 *         direccion:
 *           type: string
 *           description: Dirección específica de la cancha
 *           example: "Zona deportiva, piso 2"
 *         responsable:
 *           type: string
 *           description: Nombre del responsable de la cancha
 *           example: "Juan Pérez"
 *         detalles:
 *           type: string
 *           description: Detalles adicionales de la cancha
 *           example: "Cancha sintética, iluminación LED, vestieres incluidos"
 *         capacidad:
 *           type: integer
 *           description: Capacidad máxima de jugadores
 *           example: 10
 *         imagen:
 *           type: string
 *           description: Nombre del archivo de imagen
 *           nullable: true
 *           example: "1234567890-cancha.jpg"
 *         mallId:
 *           type: integer
 *           description: ID del centro comercial al que pertenece
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         mall:
 *           type: object
 *           properties:
 *             nombreCentro:
 *               type: string
 *             ciudad:
 *               type: string
 * 
 *     CourtInput:
 *       type: object
 *       required:
 *         - nombreCancha
 *         - horarioInicio
 *         - horarioFin
 *         - diasDisponibles
 *         - valorHora
 *         - telefono
 *         - direccion
 *         - responsable
 *         - capacidad
 *         - mallId
 *       properties:
 *         nombreCancha:
 *           type: string
 *           example: "Cancha Básquetbol"
 *         horarioInicio:
 *           type: string
 *           example: "07:00"
 *         horarioFin:
 *           type: string
 *           example: "23:00"
 *         diasDisponibles:
 *           type: string
 *           example: "Lunes a Viernes"
 *         valorHora:
 *           type: integer
 *           example: 35000
 *         telefono:
 *           type: string
 *           example: "3123456789"
 *         direccion:
 *           type: string
 *           example: "Ala norte, nivel 3"
 *         responsable:
 *           type: string
 *           example: "María García"
 *         detalles:
 *           type: string
 *           example: "Piso de madera, aro regulable"
 *         capacidad:
 *           type: integer
 *           example: 14
 *         mallId:
 *           type: integer
 *           example: 2
 * 
 *     CourtUpdate:
 *       type: object
 *       properties:
 *         nombreCancha:
 *           type: string
 *         horarioInicio:
 *           type: string
 *         horarioFin:
 *           type: string
 *         diasDisponibles:
 *           type: string
 *         valorHora:
 *           type: integer
 *         telefono:
 *           type: string
 *         direccion:
 *           type: string
 *         responsable:
 *           type: string
 *         detalles:
 *           type: string
 *         capacidad:
 *           type: integer
 *         mallId:
 *           type: integer
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
 *   name: Courts
 *   description: Gestión de canchas deportivas
 */

/**
 * @swagger
 * /api/courts:
 *   post:
 *     summary: Registrar una nueva cancha
 *     description: Solo administradores (idRol = 2) pueden registrar canchas. Soporta upload de imagen.
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombreCancha
 *               - horarioInicio
 *               - horarioFin
 *               - diasDisponibles
 *               - valorHora
 *               - telefono
 *               - direccion
 *               - responsable
 *               - capacidad
 *               - mallId
 *             properties:
 *               nombreCancha:
 *                 type: string
 *               horarioInicio:
 *                 type: string
 *               horarioFin:
 *                 type: string
 *               diasDisponibles:
 *                 type: string
 *               valorHora:
 *                 type: integer
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               responsable:
 *                 type: string
 *               detalles:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               mallId:
 *                 type: integer
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (jpg, png, pdf)
 *     responses:
 *       201:
 *         description: Cancha registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cancha registrada correctamente"
 *                 cancha:
 *                   $ref: '#/components/schemas/Court'
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
 *               permisos:
 *                 value:
 *                   message: "Solo el administrador puede registrar canchas"
 *               camposObligatorios:
 *                 value:
 *                   message: "El campo nombreCancha es obligatorio"
 *               formatoTelefono:
 *                 value:
 *                   message: "El teléfono debe tener 10 dígitos numéricos"
 *               formatoImagen:
 *                 value:
 *                   message: "Formato no permitido. Solo .jpg, .png y .pdf"
 *               mallNoExiste:
 *                 value:
 *                   message: "El centro comercial especificado no existe"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/courts:
 *   get:
 *     summary: Obtener lista de todas las canchas
 *     description: Accesible para super administradores y administradores
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados
 *     responses:
 *       200:
 *         description: Lista de canchas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Court'
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
 *                   example: "No tienes permisos para ver las canchas"
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/courts/mall/{mallId}:
 *   get:
 *     summary: Obtener canchas por centro comercial
 *     description: Los administradores solo pueden ver canchas de su propio centro comercial
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mallId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del centro comercial
 *     responses:
 *       200:
 *         description: Lista de canchas del centro comercial
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Court'
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
 *               idRequerido:
 *                 value:
 *                   message: "Debe proporcionar el ID del centro comercial"
 *               mallNoEncontrado:
 *                 value:
 *                   message: "Centro comercial no encontrado"
 *               permisos:
 *                 value:
 *                   message: "No tienes permisos para ver las canchas de este centro comercial"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Centro comercial no encontrado
 */

/**
 * @swagger
 * /api/courts/{id}:
 *   get:
 *     summary: Obtener una cancha por ID
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cancha
 *     responses:
 *       200:
 *         description: Cancha encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Court'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cancha no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cancha no encontrada"
 */

/**
 * @swagger
 * /api/courts/{id}:
 *   put:
 *     summary: Actualizar una cancha existente
 *     description: Soporta actualización de imagen
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cancha a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCancha:
 *                 type: string
 *               horarioInicio:
 *                 type: string
 *               horarioFin:
 *                 type: string
 *               diasDisponibles:
 *                 type: string
 *               valorHora:
 *                 type: integer
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               responsable:
 *                 type: string
 *               detalles:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               mallId:
 *                 type: integer
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cancha actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cancha actualizada correctamente"
 *                 cancha:
 *                   $ref: '#/components/schemas/Court'
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
 *               noEncontrada:
 *                 value:
 *                   message: "Cancha no encontrada"
 *               formatoTelefono:
 *                 value:
 *                   message: "El teléfono debe tener 10 dígitos numéricos"
 *               mallNoExiste:
 *                 value:
 *                   message: "El centro comercial especificado no existe"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cancha no encontrada
 */

/**
 * @swagger
 * /api/courts/{id}:
 *   delete:
 *     summary: Eliminar una cancha
 *     description: Elimina la cancha y su archivo de imagen si existe
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cancha a eliminar
 *     responses:
 *       200:
 *         description: Cancha eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cancha eliminada correctamente"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cancha no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cancha no encontrada"
 */

import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createCourt, 
  getCourts, 
  getCourtById, 
  updateCourt, 
  deleteCourt,
  getCourtsByMallId
} from "../controllers/court.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Formato no permitido. Solo .jpg, .png y .pdf"));
    }
    cb(null, true);
  }
});

router.post("/", authenticateToken, upload.single("imagen"), createCourt);
router.get("/", authenticateToken, getCourts);
router.get("/mall/:mallId", authenticateToken, getCourtsByMallId); 
router.get("/:id", authenticateToken, getCourtById);
router.put("/:id", authenticateToken, upload.single("imagen"), updateCourt);
router.delete("/:id", authenticateToken, deleteCourt);

export default router;
