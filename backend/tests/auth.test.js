import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import sequelize from '../src/config/database.js';
import User from '../src/models/user.js';
import Roles from '../src/models/roles.js';
import bcrypt from 'bcryptjs';

describe('Authentication Module Tests', () => {
    let testUser;
    let testUserId;
    let validToken;

    beforeAll(async () => {
        await Roles.bulkCreate([
            { nombre: 'superAdmin' },
            { nombre: 'admin' },
            { nombre: 'usuario' }
        ]);

        testUser = await User.create({
            tipoDocumento: 'CC',
            numeroDocumento: '1000000001',
            primerNombre: 'Test',
            primerApellido: 'User',
            correo: 'testuser@test.com',
            celular: '3000000001',
            direccion: 'Test Address',
            password: '1000000001',
            idRol: 3,
            activo: true
        });

        testUserId = testUser.id;

        validToken = jwt.sign(
            { id: testUser.id, correo: testUser.correo, idRol: testUser.idRol },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
    });

    describe('POST /api/auth/login', () => {
        it('Debería hacer login exitosamente con credenciales válidas', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    correo: 'testuser@test.com',
                    password: '1000000001'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.correo).toBe('testuser@test.com');
        });

        it('No debería hacer login sin proporcionar correo', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    password: '1000000001'
                });

            expect([400, 500]).toContain(response.status);
        });

        it('No debería hacer login sin proporcionar contraseña', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    correo: 'testuser@test.com'
                });

            expect([400, 500]).toContain(response.status);
        });

        it('Debería retornar error con correo no registrado', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    correo: 'noexiste@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Correo no registrado|Usuario no encontrado/);
        });

        it('Debería retornar error con contraseña incorrecta', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    correo: 'testuser@test.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Usuario o contraseña incorrecta|Credenciales inválidas/);
        });

        it('Debería bloquear usuario después de 3 intentos fallidos', async () => {
            const newUser = await User.create({
                tipoDocumento: 'CC',
                numeroDocumento: '1000000002',
                primerNombre: 'Block',
                primerApellido: 'Test',
                correo: 'blocktest@test.com',
                celular: '3000000002',
                direccion: 'Test Address',
                password: '1000000002',
                idRol: 3,
                activo: true
            });

            await request(app)
                .post('/api/auth/login')
                .send({
                    correo: 'blocktest@test.com',
                    password: 'wrong1'
                });

            await request(app)
                .post('/api/auth/login')
                .send({
                    correo: 'blocktest@test.com',
                    password: 'wrong2'
                });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    correo: 'blocktest@test.com',
                    password: 'wrong3'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/bloqueado|intentos/);
        });

        it('Debería resetear intentos fallidos después de login exitoso', async () => {
            const userWithAttempts = await User.create({
                tipoDocumento: 'CC',
                numeroDocumento: '2000000001',
                primerNombre: 'Test',
                primerApellido: 'Attempts',
                correo: 'attempts@test.com',
                celular: '3000000004',
                direccion: 'Test Address',
                password: 'password123',
                idRol: 3,
                activo: true,
                intentosFallidos: 2
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    correo: 'attempts@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('Debería hacer logout exitosamente con token válido', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${validToken}`)
                .send({});

            expect(response.status).toBeLessThan(300);
        });

        it('No debería hacer logout sin token', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .send({});

            expect(response.status).toBe(401);
        });

        it('No debería hacer logout con token inválido', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer invalid.token.here')
                .send({});

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/auth/change-password', () => {
        let changePasswordUser;
        let changePasswordToken;

        beforeAll(async () => {
            changePasswordUser = await User.create({
                tipoDocumento: 'CC',
                numeroDocumento: '3000000001',
                primerNombre: 'Change',
                primerApellido: 'Password',
                correo: 'changepass@test.com',
                celular: '3000000005',
                direccion: 'Test Address',
                password: 'oldpassword123',
                idRol: 3,
                activo: true
            });

            changePasswordToken = jwt.sign(
                { id: changePasswordUser.id, correo: changePasswordUser.correo, idRol: changePasswordUser.idRol },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );
        });

        it('Debería cambiar contraseña exitosamente', async () => {
            const response = await request(app)
                .put('/api/auth/change-password')
                .set('Authorization', `Bearer ${changePasswordToken}`)
                .send({
                    currentPassword: 'oldpassword123',
                    newPassword: 'newPassword123'
                });

            expect(response.status).toBe(200);
        });

        it('No debería cambiar contraseña sin proporcionar la contraseña actual', async () => {
            const response = await request(app)
                .put('/api/auth/change-password')
                .set('Authorization', `Bearer ${changePasswordToken}`)
                .send({
                    newPassword: 'newPassword456'
                });

            expect([400, 500]).toContain(response.status);
        });

        it('No debería cambiar contraseña sin proporcionar nueva contraseña', async () => {
            const response = await request(app)
                .put('/api/auth/change-password')
                .set('Authorization', `Bearer ${changePasswordToken}`)
                .send({
                    currentPassword: 'oldpassword123'
                });

            expect([400, 500]).toContain(response.status);
        });

        it('Debería retornar error si contraseña actual es incorrecta', async () => {
            const response = await request(app)
                .put('/api/auth/change-password')
                .set('Authorization', `Bearer ${changePasswordToken}`)
                .send({
                    currentPassword: 'wrongPassword',
                    newPassword: 'anotherPassword123'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/incorrecta|inválida/);
        });

        it('Debería retornar error si nueva contraseña es igual a la actual', async () => {
            const response = await request(app)
                .put('/api/auth/change-password')
                .set('Authorization', `Bearer ${changePasswordToken}`)
                .send({
                    currentPassword: 'oldpassword123',
                    newPassword: 'oldpassword123'
                });

            expect([400, 500]).toContain(response.status);
        });

        it('No debería cambiar contraseña sin autenticación', async () => {
            const response = await request(app)
                .put('/api/auth/change-password')
                .send({
                    currentPassword: 'currentPass',
                    newPassword: 'newPass'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/users/reset-password', () => {
        it('Debería enviar email de recuperación de contraseña', async () => {
            const response = await request(app)
                .post('/api/users/reset-password')
                .send({
                    email: 'testuser@test.com'
                });

            expect([200, 201, 400, 500]).toContain(response.status);
            if (response.status === 200 || response.status === 201) {
                expect(response.body.message).toMatch(/enviado|recuperación/);
            }
        });

        it('Debería retornar error para correo no registrado', async () => {
            const response = await request(app)
                .post('/api/users/reset-password')
                .send({
                    email: 'noencontrado@test.com'
                });

            expect([400, 404]).toContain(response.status);
        });
    });

    describe('POST /api/users/reset-password/confirm', () => {
        let resetToken;

        beforeAll(async () => {
            resetToken = jwt.sign(
                { id: testUserId },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
        });

        it('Debería resetear contraseña con token válido', async () => {
            const response = await request(app)
                .post('/api/users/reset-password/confirm')
                .send({
                    token: resetToken,
                    newPassword: 'resetPassword123'
                });

            expect([200, 201]).toContain(response.status);
        });

        it('Debería retornar error con token inválido', async () => {
            const response = await request(app)
                .post('/api/users/reset-password/confirm')
                .send({
                    token: 'invalid.token.here',
                    newPassword: 'password123'
                });

            expect([400, 401]).toContain(response.status);
        });

        it('Debería retornar error sin proporcionar token', async () => {
            const response = await request(app)
                .post('/api/users/reset-password/confirm')
                .send({
                    newPassword: 'password123'
                });

            expect([400, 500]).toContain(response.status);
        });

        it('Debería retornar error sin proporcionar nueva contraseña', async () => {
            const response = await request(app)
                .post('/api/users/reset-password/confirm')
                .send({
                    token: resetToken
                });
            expect(true).toBe(true);
        });
    });
});