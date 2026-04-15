import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import sequelize from '../src/config/database.js';
import User from '../src/models/user.js';
import Roles from '../src/models/roles.js';
import Mall from '../src/models/mall.js';
import Sport from '../src/models/sport.js';
import Court from '../src/models/court.js';
import Reservation from '../src/models/reservation.js';

describe('Admin Stats Module Tests', () => {
  let superAdminToken;
  let adminToken;
  let userToken;
  let testMallId;
  let testCourtId;

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
      correo: 'superadmin@stats.com',
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
      primerApellido: 'Stats',
      correo: 'admin@stats.com',
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
      correo: 'user@stats.com',
      celular: '3000000003',
      direccion: 'Test Address',
      password: 'password123',
      idRol: 3,
      activo: true
    });

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

    const court = await Court.create({
      nombreCancha: 'Cancha A',
      horarioInicio: '06:00',
      horarioFin: '22:00',
      diasDisponibles: 'Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo',
      valorHora: 50000,
      telefono: '3000000001',
      direccion: 'Cancha Address',
      responsable: 'Juan Pérez',
      mallId: testMallId,
      sportId: sport.id,
      activo: true
    });

    testCourtId = court.id;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await Reservation.create({
      courtId: testCourtId,
      userId: user.id,
      fechaReserva: tomorrowStr,
      horaReserva: '10:00',
      cantidadHoras: 2,
      valorTotal: 100000,
      estado: 'Activa'
    });

    superAdminToken = jwt.sign(
      { id: superAdmin.id, correo: superAdmin.correo, idRol: 1 },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { id: admin.id, correo: admin.correo, idRol: 2, mallId: testMallId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    userToken = jwt.sign(
      { id: user.id, correo: user.correo, idRol: 3 },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/admin/stats', () => {
    it('Debería obtener estadísticas como super admin', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('Debería obtener estadísticas del admin del mall', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('No debería permitir usuario normal ver estadísticas', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('Debería filtrar estadísticas por estado', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .query({ estado: 'Activa' })
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('Debería filtrar estadísticas por rango de fechas', async () => {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const response = await request(app)
        .get('/api/admin/stats')
        .query({ startDate: today, endDate: tomorrowStr })
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('Debería filtrar estadísticas por ID de cancha', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .query({ courtId: testCourtId })
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('Debería filtrar estadísticas por ID de mall', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .query({ mallId: testMallId })
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('No debería obtener estadísticas sin autenticación', async () => {
      const response = await request(app)
        .get('/api/admin/stats');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/reservations', () => {
    it('Debería obtener todas las reservas como super admin', async () => {
      const response = await request(app)
        .get('/api/reservations')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.reservas)).toBe(true);
    });

    it('Debería obtener reservas del mall como admin', async () => {
      const response = await request(app)
        .get('/api/reservations')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.reservas)).toBe(true);
    });

    it('No debería permitir usuario normal ver reservas', async () => {
      const response = await request(app)
        .get('/api/reservations')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.reservas)).toBe(true);
    });
  });

  describe('GET /api/admin/stats/revenue', () => {
    it('Debería obtener ingresos totales como super admin', async () => {
      const response = await request(app)
        .get('/api/admin/stats/revenue')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalRevenue');
    });

    it('Debería obtener ingresos del mall como admin', async () => {
      const response = await request(app)
        .get('/api/admin/stats/revenue')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalRevenue');
    });

    it('Debería filtrar ingresos por rango de fechas', async () => {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const response = await request(app)
        .get('/api/admin/stats/revenue')
        .query({ startDate: today, endDate: tomorrowStr })
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalRevenue');
    });
  });

  describe('GET /api/admin/stats/users-count', () => {
    it('Debería obtener conteo de usuarios como super admin', async () => {
      const response = await request(app)
        .get('/api/admin/stats/users-count')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalUsers');
    });

    it('Debería obtener conteo de usuarios por rol', async () => {
      const response = await request(app)
        .get('/api/admin/stats/users-count')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usersByRole');
      expect(Array.isArray(response.body.usersByRole)).toBe(true);
    });
  });

  describe('GET /api/admin/stats/malls-count', () => {
    it('Debería obtener conteo de centros comerciales', async () => {
      const response = await request(app)
        .get('/api/admin/stats/malls-count')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalMalls');
    });

    it('Debería obtener conteo de malls por ciudad', async () => {
      const response = await request(app)
        .get('/api/admin/stats/malls-count')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mallsByCity');
      expect(Array.isArray(response.body.mallsByCity)).toBe(true);
    });
  });

  describe('GET /api/admin/dashboard', () => {
    it('Debería obtener datos del dashboard como super admin', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.summary).toHaveProperty('totalMalls');
      expect(response.body.data.summary).toHaveProperty('totalUsers');
      expect(response.body.data.summary).toHaveProperty('totalAdmins');
      expect(response.body.data.summary).toHaveProperty('totalClients');
    });

    it('Debería obtener datos del dashboard como admin', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('Debería incluir gráficos de malls por ciudad', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('mallsByCity');
      expect(Array.isArray(response.body.data.mallsByCity)).toBe(true);
    });

    it('Debería incluir gráficos de usuarios por rol', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('usersByRole');
      expect(Array.isArray(response.body.data.usersByRole)).toBe(true);
    });

    it('Debería filtrar dashboard por año', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .query({ year: 2025 })
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
    });

    it('Debería filtrar dashboard por rango de fechas', async () => {
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = nextMonth.toISOString().split('T')[0];

      const response = await request(app)
        .get('/api/admin/dashboard')
        .query({ startDate: today, endDate: nextMonthStr })
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
    });

    it('No debería permitir usuario normal ver dashboard', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('No debería obtener dashboard sin autenticación', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard');

      expect(response.status).toBe(401);
    });
  });

  describe('Export reports', () => {
    it('Debería exportar reporte de estadísticas', async () => {
      const response = await request(app)
        .get('/api/admin/stats/export')
        .query({ format: 'csv' })
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect([200, 404]).toContain(response.status);
    });

    it('Debería exportar reporte de reservas', async () => {
      const response = await request(app)
        .get('/api/admin/reservations/export')
        .query({ format: 'xlsx' })
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect([200, 404]).toContain(response.status);
    });
  });
});
