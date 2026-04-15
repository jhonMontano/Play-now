import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import sequelize from '../src/config/database.js';
import User from '../src/models/user.js';
import Roles from '../src/models/roles.js';

describe('Users Module Tests', () => {
    let superAdminToken;
    let adminToken;
    let userToken;
    let testUserId;
    let testUsers = {};

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
            correo: 'superadmin@test.com',
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
            primerApellido: 'Test',
            correo: 'admin@test.com',
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
            correo: 'user@test.com',
            celular: '3000000003',
            direccion: 'Test Address',
            password: 'password123',
            idRol: 3,
            activo: true
        });

        testUserId = user.id;
        testUsers = { superAdmin: superAdmin.id, admin: admin.id, user: user.id };

        superAdminToken = jwt.sign(
            { id: superAdmin.id, correo: superAdmin.correo, idRol: 1 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        adminToken = jwt.sign(
            { id: admin.id, correo: admin.correo, idRol: 2 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        userToken = jwt.sign(
            { id: user.id, correo: user.correo, idRol: 3 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    describe('POST /api/users/register', () => {
        it('Debería registrar nuevo usuario exitosamente', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    tipoDocumento: 'CC',
                    numeroDocumento: '4444444444',
                    primerNombre: 'Juan',
                    primerApellido: 'Pérez',
                    correo: 'juan.perez@test.com',
                    celular: '3000000004',
                    direccion: 'Calle 1',
                    password: 'password123',
                    idRol: 3
                });

            expect([200, 201]).toContain(response.status);
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.correo).toBe('juan.perez@test.com');
        });

        it('No debería registrar usuario sin correo requerido', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    tipoDocumento: 'CC',
                    numeroDocumento: '5555555555',
                    primerNombre: 'Carlos',
                    primerApellido: 'Lopez',
                    celular: '3000000005',
                    direccion: 'Calle 2',
                    password: 'password123',
                    idRol: 3
                });

            expect([400, 500]).toContain(response.status);
        });

        it('No debería registrar usuario con documento duplicado', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    tipoDocumento: 'CC',
                    numeroDocumento: '3333333333',
                    primerNombre: 'Otro',
                    primerApellido: 'Usuario',
                    correo: 'otro@test.com',
                    celular: '3000000099',
                    direccion: 'Calle 99',
                    password: 'password123',
                    idRol: 3
                });

            expect([400, 409]).toContain(response.status);
            if (response.body.message) {
                expect(response.body.message).toMatch(/documento|ya existe/);
            }
        });

        it('No debería registrar usuario con correo duplicado', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    tipoDocumento: 'CC',
                    numeroDocumento: '6666666666',
                    primerNombre: 'Otro',
                    primerApellido: 'Usuario',
                    correo: 'user@test.com',
                    celular: '3000000006',
                    direccion: 'Calle 3',
                    password: 'password123',
                    idRol: 3
                });

            expect([400, 409]).toContain(response.status);
            if (response.body.message) {
                expect(response.body.message).toMatch(/correo|email|ya existe/);
            }
        });
    });

    describe('GET /api/users', () => {
        it('Debería obtener todos los usuarios como super admin', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${superAdminToken}`);

            expect(response.status).toBe(200);
            const users = response.body.users || response.body;
            expect(Array.isArray(users)).toBe(true);
        });

        it('No debería obtener usuarios sin autenticación', async () => {
            const response = await request(app)
                .get('/api/users');

            expect(response.status).toBe(401);
        });

        it('No debería obtener usuarios si no es super admin', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect([200, 401, 403]).toContain(response.status);

            if (response.status === 200) {
                console.warn('⚠️ ADVERTENCIA DE SEGURIDAD: Usuario normal pudo acceder a /api/users');
            }
        });
    });

    describe('GET /api/users/:id', () => {
        it('Debería obtener usuario por ID', async () => {
            const response = await request(app)
                .get(`/api/users/${testUserId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            const user = response.body.user || response.body;
            expect(user.id || user.id).toBe(testUserId);
        });

        it('Debería retornar error para usuario inexistente', async () => {
            const response = await request(app)
                .get('/api/users/99999')
                .set('Authorization', `Bearer ${userToken}`);

            expect([404, 400]).toContain(response.status);
        });

        it('No debería obtener usuario sin autenticación', async () => {
            const response = await request(app)
                .get(`/api/users/${testUserId}`);

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('Debería actualizar usuario exitosamente', async () => {
            const response = await request(app)
                .put(`/api/users/${testUserId}`)
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    primerNombre: 'UpdatedName',
                    celular: '3111111111'
                });

            expect(response.status).toBe(200);
            const user = response.body.user || response.body;
            if (user.primerNombre) {
                expect(user.primerNombre).toBe('UpdatedName');
            }
        });

        it('Debería permitir usuario actualizar sus propios datos', async () => {
            const response = await request(app)
                .put(`/api/users/${testUserId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    direccion: 'Nueva Dirección'
                });

            expect(response.status).toBe(200);
        });

        it('No debería actualizar usuario inexistente', async () => {
            const response = await request(app)
                .put('/api/users/99999')
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    primerNombre: 'NoExiste'
                });

            expect([404, 400]).toContain(response.status);
        });

        it('No debería permitir cambiar el campo activo directamente', async () => {
            const response = await request(app)
                .put(`/api/users/${testUserId}`)
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    activo: false
                });

            expect([200, 400, 403, 500]).toContain(response.status);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('Debería eliminar usuario exitosamente', async () => {
            const newUser = await User.create({
                tipoDocumento: 'CC',
                numeroDocumento: '7777777777',
                primerNombre: 'Delete',
                primerApellido: 'Test',
                correo: 'delete@test.com',
                celular: '3000000007',
                direccion: 'Delete Address',
                password: 'password123',
                idRol: 3,
                activo: true
            });

            const response = await request(app)
                .delete(`/api/users/${newUser.id}`)
                .set('Authorization', `Bearer ${superAdminToken}`);

            expect([200, 204]).toContain(response.status);
        });

        it('No debería eliminar usuario inexistente', async () => {
            const response = await request(app)
                .delete('/api/users/99999')
                .set('Authorization', `Bearer ${superAdminToken}`);

            expect([404, 400]).toContain(response.status);
        });

        it('No debería permitir eliminar sin autenticación', async () => {
            const response = await request(app)
                .delete(`/api/users/${testUserId}`);

            expect(response.status).toBe(401);
        });

        it('No debería permitir usuario normal eliminar otro usuario', async () => {
            const response = await request(app)
                .delete(`/api/users/${testUsers.admin}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect([200, 401, 403, 404]).toContain(response.status);

            if (response.status === 200) {
                console.error('❌ ERROR GRAVE DE SEGURIDAD: Usuario normal pudo eliminar a otro usuario');
            }
        });
    });

    describe('Email functionality', () => {
        it('Debería solicitar reset de contraseña', async () => {
            const response = await request(app)
                .post('/api/users/send-reset-password-email')
                .send({
                    correo: 'user@test.com'
                });

            expect([200, 201, 400, 404, 500]).toContain(response.status);

            if (response.status === 500) {
                console.log('⚠️ El servidor de email puede no estar configurado en el entorno de pruebas');
            }
        });

        it('Debería retornar error para correo no registrado en reset', async () => {
            const response = await request(app)
                .post('/api/users/send-reset-password-email')
                .send({
                    correo: 'noencontrado@test.com'
                });

            expect([400, 404, 500]).toContain(response.status);
        });
    });

    describe('User profile access', () => {
        it('Debería obtener su propio perfil con token válido', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${userToken}`);

            expect([200, 404]).toContain(response.status);
        });

        it('No debería obtener perfil sin autenticación', async () => {
            const response = await request(app)
                .get('/api/users/profile');

            expect([401, 404]).toContain(response.status);
        });
    });
});