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

describe('Reservations Module Tests', () => {
    let adminToken;
    let userToken;
    let anotherUserToken;
    let testMallId;
    let testSportId;
    let testCourtId;
    let testReservationId;
    let userId;
    let anotherUserId;
    let tomorrow;
    let futureDate;

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
            correo: 'superadmin@res.com',
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
            correo: 'admin@res.com',
            celular: '3000000002',
            direccion: 'Test Address',
            password: 'password123',
            idRol: 2,
            activo: true
        });

        const user = await User.create({
            tipoDocumento: 'CC',
            numeroDocumento: '3333333333',
            primerNombre: 'User',
            primerApellido: 'One',
            correo: 'user1@res.com',
            celular: '3000000003',
            direccion: 'Test Address',
            password: 'password123',
            idRol: 3,
            activo: true
        });

        const anotherUser = await User.create({
            tipoDocumento: 'CC',
            numeroDocumento: '4444444444',
            primerNombre: 'User',
            primerApellido: 'Two',
            correo: 'user2@res.com',
            celular: '3000000004',
            direccion: 'Test Address',
            password: 'password123',
            idRol: 3,
            activo: true
        });

        userId = user.id;
        anotherUserId = anotherUser.id;

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
            sportId: testSportId,
            activo: true
        });

        testCourtId = court.id;

        tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = tomorrow.toISOString().split('T')[0];

        futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        futureDate = futureDate.toISOString().split('T')[0];

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

        anotherUserToken = jwt.sign(
            { id: anotherUser.id, correo: anotherUser.correo, idRol: 3 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    describe('POST /api/reservations', () => {
        it('Debería crear reserva exitosamente', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '10:00',
                    cantidadHoras: 2
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('reserva');
            expect(response.body.reserva).toHaveProperty('id');
            expect(response.body.reserva.cantidadHoras).toBe(2);
            expect(response.body.reserva.valorTotal).toBe('100000.00'); // 50000 * 2

            testReservationId = response.body.reserva.id;
        });

        it('No debería crear reserva sin campos obligatorios', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('obligatorios');
        });

        it('No debería permitir usuario normal crear reserva', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '14:00',
                    cantidadHoras: 1
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Solo los usuarios');
        });

        it('Debería rechazar formato de hora inválido', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '25:00',
                    cantidadHoras: 1
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('inválido');
        });

        it('Debería rechazar cantidad de horas fuera de rango', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '10:00',
                    cantidadHoras: 10
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('entre 1 y 8');
        });

        it('Debería rechazar reserva para cancha inexistente', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: 99999,
                    fechaReserva: tomorrow,
                    horaReserva: '10:00',
                    cantidadHoras: 1
                });

            expect(response.status).toBe(400);
        });

        it('Debería rechazar reserva fuera del horario de la cancha', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '23:00',
                    cantidadHoras: 1
                });

            expect(response.status).toBe(400);
        });

        it('Debería rechazar reserva solapada', async () => {
            const baseResponse = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '10:00',
                    cantidadHoras: 2
                });

            expect(baseResponse.status).toBe(201);

            const response = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${anotherUserToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '11:00',
                    cantidadHoras: 1
                });

            expect(response.status).toBe(400);
        });

        it('Debería permitir reserva en horario diferente', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${anotherUserToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '14:00',
                    cantidadHoras: 2
                });

            expect(response.status).toBe(201);
            expect(response.body.reserva.horaReserva).toBe('14:00');
        });

        it('No debería crear reserva sin autenticación', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '18:00',
                    cantidadHoras: 1
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/reservations', () => {
        it('Debería obtener reservas del usuario autenticado', async () => {
            const response = await request(app)
                .get('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.reservas)).toBe(true);
        });

        it('No debería obtener reservas sin autenticación', async () => {
            const response = await request(app)
                .get('/api/reservations');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/reservations/:id', () => {
        it('Debería obtener reserva por ID', async () => {
            const createResponse = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '12:00',
                    cantidadHoras: 1
                });

            expect(createResponse.status).toBe(201);
            const reservationId = createResponse.body.reserva.id;

            const response = await request(app)
                .get(`/api/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('reserva');
            expect(response.body.reserva.id).toBe(reservationId);
        });

        it('Debería retornar error para reserva inexistente', async () => {
            const response = await request(app)
                .get('/api/reservations/99999')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(404);
        });

        it('No debería permite a otro usuario ver reserva ajena', async () => {
            const createResponse = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '13:00',
                    cantidadHoras: 1
                });

            expect(createResponse.status).toBe(201);
            const reservationId = createResponse.body.reserva.id;

            const response = await request(app)
                .get(`/api/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${anotherUserToken}`);

            expect(response.status).toBe(403);
        });
    });

    describe('PUT /api/reservations/cancel/:id', () => {
        it('Debería cancelar reserva', async () => {
            const createResponse = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    courtId: testCourtId,
                    fechaReserva: tomorrow,
                    horaReserva: '18:00',
                    cantidadHoras: 1
                });

            if (createResponse.status !== 201) {
                console.log('Error creating reservation for cancel:', createResponse.body);
            }

            const reservaId = createResponse.body.reserva?.id;

            const response = await request(app)
                .put(`/api/reservations/cancel/${reservaId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({});

            if (response.status !== 200) {
                console.log('Error in cancel reservation:', response.status, response.body);
            }
            expect(response.status).toBe(200);
            if (response.body.reserva) {
                expect(response.body.reserva.estado).toBe('Cancelada');
            }
        });

        it('Debería retornar error para reserva inexistente', async () => {
            const response = await request(app)
                .put('/api/reservations/cancel/99999')
                .set('Authorization', `Bearer ${userToken}`)
                .send({});

            expect(response.status).toBe(400);
        });

        it('No debería permitir a otro usuario cancelar reserva ajena', async () => {
            const newRes = await Reservation.create({
                courtId: testCourtId,
                userId: userId,
                fechaReserva: futureDate,
                horaReserva: '10:00',
                cantidadHoras: 1,
                valorTotal: 50000
            });

            const response = await request(app)
                .put(`/api/reservations/cancel/${newRes.id}`)
                .set('Authorization', `Bearer ${anotherUserToken}`)
                .send({});

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/reservations/court/:courtId', () => {
        it('Debería obtener reservas de una cancha específica', async () => {
            const response = await request(app)
                .get(`/api/reservations/court/${testCourtId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.reservas)).toBe(true);
        });

        it('Debería retornar lista vacía para cancha sin reservas', async () => {
            const sport = await Sport.findByPk(testSportId);
            const mall = await Mall.findByPk(testMallId);

            const newCourt = await Court.create({
                nombreCancha: 'Cancha Vacía',
                horarioInicio: '06:00',
                horarioFin: '22:00',
                diasDisponibles: 'Lunes',
                valorHora: 50000,
                telefono: '3000000099',
                direccion: 'Address',
                responsable: 'responsable',
                mallId: testMallId,
                sportId: testSportId,
                activo: true
            });

            const response = await request(app)
                .get(`/api/reservations/court/${newCourt.id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.reservas)).toBe(true);
            expect(response.body.reservas.length).toBe(0);
        });
    });

    describe('PUT /api/reservations/:id', () => {
        it('Debería actualizar reserva existente', async () => {
            const newRes = await Reservation.create({
                courtId: testCourtId,
                userId: userId,
                fechaReserva: futureDate,
                horaReserva: '16:00',
                cantidadHoras: 1,
                valorTotal: 50000
            });

            const response = await request(app)
                .put(`/api/reservations/${newRes.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    fechaReserva: futureDate,
                    horaReserva: '17:00',
                    cantidadHoras: 2
                });

            expect(response.status).toBe(200);
            expect(response.body.reserva.horaReserva).toBe('17:00');
        });

        it('Debería retornar error para reserva inexistente en actualización', async () => {
            const response = await request(app)
                .put('/api/reservations/99999')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    cantidadHoras: 1
                });

            expect(response.status).toBe(404);
        });
    });
});
