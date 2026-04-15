import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import sequelize from '../src/config/database.js';
import User from '../src/models/user.js';
import Roles from '../src/models/roles.js';
import Mall from '../src/models/mall.js';
import Sport from '../src/models/sport.js';
import Court from '../src/models/court.js';

describe('Courts Module Tests', () => {
  let superAdminToken;
  let adminToken;
  let userToken;
  let testMallId;
  let testSportId;
  let testCourtId;
  let adminUserId;

  beforeAll(async () => {
    await Roles.bulkCreate([
      { nombre: 'superAdmin' },
      { nombre: 'admin' },
      { nombre: 'usuario' }
    ]);

    const superAdmin = await User.create({
      tipoDocumento: 'CC',
      numeroDocumento: '1111111111',
      primerNombre: 'Super',
      primerApellido: 'Admin',
      correo: 'superadmin@courts.com',
      celular: '3000000001',
      direccion: 'Test Address',
      password: 'password123',
      idRol: 1,
      activo: true
    });

    const admin = await User.create({
      tipoDocumento: 'CC',
      numeroDocumento: '2222222222',
      primerNombre: 'Admin',
      primerApellido: 'Mall',
      correo: 'admin@courts.com',
      celular: '3000000002',
      direccion: 'Test Address',
      password: 'password123',
      idRol: 2,
      activo: true
    });

    const user = await User.create({
      tipoDocumento: 'CC',
      numeroDocumento: '3333333333',
      primerNombre: 'Normal',
      primerApellido: 'User',
      correo: 'user@courts.com',
      celular: '3000000003',
      direccion: 'Test Address',
      password: 'password123',
      idRol: 3,
      activo: true
    });

    adminUserId = admin.id;

    const mall = await Mall.create({
      nombreCentro: 'Test Mall',
      direccion: 'Mall Address',
      telefono: '1234567890',
      ciudad: 'Test City',
      adminId: admin.id,
      activo: true
    });

    testMallId = mall.id;

    await admin.update({ idMall: mall.id });

    const sport = await Sport.create({
      nombre: 'Fútbol 7',
      descripcion: 'Fútbol 7 jugadores',
      cantidad: 14,
      activo: true
    });

    testSportId = sport.id;

    superAdminToken = jwt.sign(
      { id: superAdmin.id, correo: superAdmin.correo, idRol: 1, mallId: null },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { id: admin.id, correo: admin.correo, idRol: 2, mallId: testMallId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    userToken = jwt.sign(
      { id: user.id, correo: user.correo, idRol: 3, mallId: null },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/courts', () => {
    it('Debería crear cancha exitosamente como admin', async () => {
      const response = await request(app)
        .post('/api/courts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombreCancha: 'Cancha A',
          horarioInicio: '06:00',
          horarioFin: '22:00',
          diasDisponibles: 'Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo',
          valorHora: 50000,
          telefono: '3000000001',
          direccion: 'Cancha Address',
          responsable: 'Juan Pérez',
          mallId: testMallId,
          sportId: testSportId
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('exitosamente');
      expect(response.body.court).toHaveProperty('id');
      expect(response.body.court.nombreCancha).toBe('Cancha A');

      testCourtId = response.body.court.id;
    });

    it('No debería crear cancha sin campos obligatorios', async () => {
      const response = await request(app)
        .post('/api/courts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombreCancha: 'Cancha B',
          horarioInicio: '06:00'
        });

      expect(response.status).toBe(400);
    });

    it('No debería crear cancha con valor por hora inválido', async () => {
      const response = await request(app)
        .post('/api/courts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombreCancha: 'Cancha C',
          horarioInicio: '06:00',
          horarioFin: '22:00',
          diasDisponibles: 'Lunes, Martes',
          valorHora: -1000,
          telefono: '3000000002',
          direccion: 'Address',
          responsable: 'responsable',
          mallId: testMallId,
          sportId: testSportId
        });

      expect(response.status).toBe(400);
    });

    it('No debería crear cancha con teléfono inválido', async () => {
      const response = await request(app)
        .post('/api/courts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombreCancha: 'Cancha D',
          horarioInicio: '06:00',
          horarioFin: '22:00',
          diasDisponibles: 'Lunes',
          valorHora: 50000,
          telefono: '123',
          direccion: 'Address',
          responsable: 'responsable',
          mallId: testMallId,
          sportId: testSportId
        });

      expect(response.status).toBe(400);
    });

    it('No debería crear cancha con nombre duplicado', async () => {
      const response = await request(app)
        .post('/api/courts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombreCancha: 'Cancha A',
          horarioInicio: '06:00',
          horarioFin: '22:00',
          diasDisponibles: 'Lunes',
          valorHora: 50000,
          telefono: '3000000003',
          direccion: 'Address',
          responsable: 'responsable',
          mallId: testMallId,
          sportId: testSportId
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('ya existe');
    });

    it('No debería permitir usuario normal crear cancha', async () => {
      const response = await request(app)
        .post('/api/courts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          nombreCancha: 'Cancha No Auth',
          horarioInicio: '06:00',
          horarioFin: '22:00',
          diasDisponibles: 'Lunes',
          valorHora: 50000,
          telefono: '3000000004',
          direccion: 'Address',
          responsable: 'responsable',
          mallId: testMallId,
          sportId: testSportId
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/courts', () => {
    it('Debería obtener canchas como usuario', async () => {
      const response = await request(app)
        .get('/api/courts')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Debería obtener canchas del admin como admin', async () => {
      const response = await request(app)
        .get('/api/courts')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('No debería obtener canchas sin autenticación', async () => {
      const response = await request(app)
        .get('/api/courts');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/courts/:id', () => {
    it('Debería obtener cancha por ID', async () => {
      const response = await request(app)
        .get(`/api/courts/${testCourtId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testCourtId);
    });

    it('Debería retornar error para cancha inexistente', async () => {
      const response = await request(app)
        .get('/api/courts/99999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('no encontrada');
    });
  });

  describe('PUT /api/courts/:id', () => {
    it('Debería actualizar cancha exitosamente', async () => {
      const response = await request(app)
        .put(`/api/courts/${testCourtId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombreCancha: 'Cancha A Actualizada',
          valorHora: 60000
        });

      expect(response.status).toBe(200);
      expect(response.body.court.nombreCancha).toBe('Cancha A Actualizada');
      expect(response.body.court.valorHora).toBe(60000);
    });

    it('No debería actualizar con valor hora negativo', async () => {
      const response = await request(app)
        .put(`/api/courts/${testCourtId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          valorHora: -5000
        });

      expect(response.status).toBe(400);
    });

    it('Debería retornar error para cancha inexistente en actualización', async () => {
      const response = await request(app)
        .put('/api/courts/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombreCancha: 'No Existe'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/courts/:id/status', () => {
    it('Debería desactivar cancha', async () => {
      const response = await request(app)
        .patch(`/api/courts/${testCourtId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activo: false });

      expect(response.status).toBe(200);
      expect(response.body.court.activo).toBe(false);
    });

    it('Debería activar cancha', async () => {
      const response = await request(app)
        .patch(`/api/courts/${testCourtId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activo: true });

      expect(response.status).toBe(200);
      expect(response.body.court.activo).toBe(true);
    });

    it('No debería cambiar estado sin campos requeridos', async () => {
      const response = await request(app)
        .patch(`/api/courts/${testCourtId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/courts/mall/:mallId', () => {
    it('Debería obtener canchas por ID del mall', async () => {
      const response = await request(app)
        .get(`/api/courts/mall/${testMallId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.courts)).toBe(true);
    });

    it('Debería retornar error para mall inexistente', async () => {
      const response = await request(app)
        .get('/api/courts/mall/99999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/courts/:id', () => {
    it('Debería eliminar cancha sin reservas', async () => {
      const tempCourt = await Court.create({
        nombreCancha: 'Cancha Temporal',
        horarioInicio: '06:00',
        horarioFin: '22:00',
        diasDisponibles: 'Lunes',
        valorHora: 50000,
        telefono: '3000000099',
        direccion: 'Address',
        responsable: 'responsable',
        mallId: testMallId,
        sportId: testSportId
      });

      const response = await request(app)
        .delete(`/api/courts/${tempCourt.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('Debería retornar error para cancha inexistente en eliminación', async () => {
      const response = await request(app)
        .delete('/api/courts/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it('No debería permitir usuario normal eliminar cancha', async () => {
      const response = await request(app)
        .delete(`/api/courts/${testCourtId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});
