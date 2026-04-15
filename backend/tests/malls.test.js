import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import sequelize from '../src/config/database.js';
import User from '../src/models/user.js';
import Roles from '../src/models/roles.js';
import Mall from '../src/models/mall.js';

describe('Malls Module Tests', () => {
    let superAdminToken;
    let adminToken;
    let userToken;
    let testMallId;
    let testAdminId;

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
            correo: 'superadmin@malls.com',
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
            correo: 'admin@malls.com',
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
            correo: 'user@malls.com',
            celular: '3000000003',
            direccion: 'Test Address',
            password: 'password123',
            idRol: 3,
            activo: true
        });

        testAdminId = admin.id;

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

    describe('POST /api/malls', () => {
        it('Debería crear centro comercial y admin exitosamente como super admin', async () => {
            const response = await request(app)
                .post('/api/malls')
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    mall: {
                        nombreCentro: 'New Mall',
                        direccion: 'New Address',
                        telefono: '9876543210',
                        ciudad: 'New City'
                    },
                    admin: {
                        tipoDocumento: 'CC',
                        numeroDocumento: '5555555555',
                        primerNombre: 'NewAdmin',
                        primerApellido: 'Admin',
                        correo: 'newadmin@mall.com',
                        celular: '3000000004',
                        direccion: 'Admin Address'
                    }
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toContain('correctamente');
            expect(response.body.mall).toHaveProperty('id');
            expect(response.body.administrador).toHaveProperty('id');
        });

        it('No debería permitir crear mall sin ser super admin', async () => {
            const response = await request(app)
                .post('/api/malls')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    mall: {
                        nombreCentro: 'Unauthorized Mall',
                        direccion: 'Address',
                        telefono: '1111111111',
                        ciudad: 'City'
                    },
                    admin: {
                        tipoDocumento: 'CC',
                        numeroDocumento: '6666666666',
                        primerNombre: 'Admin',
                        primerApellido: 'Fail',
                        correo: 'fail@mall.com',
                        celular: '3000000005',
                        direccion: 'Address'
                    }
                });

            expect(response.status).toBe(403);
        });

        it('No debería crear mall sin campos requeridos', async () => {
            const response = await request(app)
                .post('/api/malls')
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    mall: {
                        nombreCentro: 'Incomplete Mall',
                    },
                    admin: {
                        tipoDocumento: 'CC',
                        numeroDocumento: '7777777777',
                        primerNombre: 'Admin',
                        primerApellido: 'Inc',
                        correo: 'inc@mall.com',
                        celular: '3000000006',
                        direccion: 'Address'
                    }
                });

            expect(response.status).toBe(400);
        });

        it('No debería crear mall con nombre duplicado', async () => {
            const response = await request(app)
                .post('/api/malls')
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    mall: {
                        nombreCentro: 'Test Mall',
                        direccion: 'Another Address',
                        telefono: '2222222222',
                        ciudad: 'Another City'
                    },
                    admin: {
                        tipoDocumento: 'CC',
                        numeroDocumento: '8888888888',
                        primerNombre: 'Admin',
                        primerApellido: 'Dup',
                        correo: 'dup@mall.com',
                        celular: '3000000007',
                        direccion: 'Address'
                    }
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Ya existe');
        });

        it('No debería crear mall con admin que ya existe', async () => {
            const response = await request(app)
                .post('/api/malls')
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    mall: {
                        nombreCentro: 'Another Mall',
                        direccion: 'Address',
                        telefono: '3333333333',
                        ciudad: 'City'
                    },
                    admin: {
                        tipoDocumento: 'CC',
                        numeroDocumento: '2222222222',
                        primerNombre: 'Existing',
                        primerApellido: 'Admin',
                        correo: 'existing@mall.com',
                        celular: '3000000008',
                        direccion: 'Address'
                    }
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('documento');
        });

        it('No debería crear mall sin autenticación', async () => {
            const response = await request(app)
                .post('/api/malls')
                .send({
                    mall: {
                        nombreCentro: 'Noauth Mall',
                        direccion: 'Address',
                        telefono: '4444444444',
                        ciudad: 'City'
                    },
                    admin: {
                        tipoDocumento: 'CC',
                        numeroDocumento: '9999999999',
                        primerNombre: 'Admin',
                        primerApellido: 'No',
                        correo: 'noauth@mall.com',
                        celular: '3000000009',
                        direccion: 'Address'
                    }
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/malls', () => {
        it('Debería obtener todos los centros comerciales', async () => {
            const response = await request(app)
                .get('/api/malls')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.malls)).toBe(true);
            expect(response.body.malls.length).toBeGreaterThan(0);
        });

        it('No debería obtener malls sin autenticación', async () => {
            const response = await request(app)
                .get('/api/malls');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/malls/:id', () => {
        it('Debería obtener centro comercial por ID', async () => {
            const response = await request(app)
                .get(`/api/malls/${testMallId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(testMallId);
            expect(response.body.nombreCentro).toBe('Test Mall');
        });

        it('Debería retornar error para mall inexistente', async () => {
            const response = await request(app)
                .get('/api/malls/99999')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toContain('no encontrado');
        });

        it('No debería obtener mall sin autenticación', async () => {
            const response = await request(app)
                .get(`/api/malls/${testMallId}`);

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/malls/:id', () => {
        it('Debería actualizar centro comercial como super admin', async () => {
            const response = await request(app)
                .put(`/api/malls/${testMallId}`)
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    mall: {
                        nombreCentro: 'Test Mall Updated'
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body.mall.nombreCentro).toBe('Test Mall Updated');
        });

        it('No debería permitir actualizar mall sin ser super admin', async () => {
            const response = await request(app)
                .put(`/api/malls/${testMallId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    mall: {
                        nombreCentro: 'Unauthorized Update'
                    }
                });

            expect(response.status).toBe(403);
        });

        it('Debería retornar error para mall inexistente en actualización', async () => {
            const response = await request(app)
                .put('/api/malls/99999')
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    mall: {
                        nombreCentro: 'Nonexistent'
                    }
                });

            expect(response.status).toBe(404);
        });

        it('No debería permitir actualizar mall sin autenticación', async () => {
            const response = await request(app)
                .put(`/api/malls/${testMallId}`)
                .send({
                    mall: {
                        nombreCentro: 'No Auth Update'
                    }
                });

            expect(response.status).toBe(401);
        });
    });

    describe('PATCH /api/malls/:id/status', () => {
        it('Debería desactivar centro comercial', async () => {
            const response = await request(app)
                .patch(`/api/malls/${testMallId}/status`)
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({ activo: false });

            expect(response.status).toBe(200);
            expect(response.body.mall.activo).toBe(false);
        });

        it('Debería activar centro comercial', async () => {
            const response = await request(app)
                .patch(`/api/malls/${testMallId}/status`)
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({ activo: true });

            expect(response.status).toBe(200);
            expect(response.body.mall.activo).toBe(true);
        });

        it('No debería cambiar estado sin ser super admin', async () => {
            const response = await request(app)
                .patch(`/api/malls/${testMallId}/status`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ activo: false });

            expect(response.status).toBe(403);
        });

        it('Debería retornar error para mall inexistente', async () => {
            const response = await request(app)
                .patch('/api/malls/99999/status')
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({ activo: false });

            expect(response.status).toBe(404);
        });
    });

    describe('GET /api/malls/:id/courts', () => {
        it('Debería obtener canchas de un mall', async () => {
            const response = await request(app)
                .get(`/api/malls/${testMallId}/courts`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.courts)).toBe(true);
        });

        it('Debería retornar lista vacía para mall sin canchas', async () => {
            // Crear nuevo mall
            const newMall = await Mall.create({
                nombreCentro: 'Empty Mall',
                direccion: 'Address',
                telefono: '5555555555',
                ciudad: 'City',
                activo: true
            });

            const response = await request(app)
                .get(`/api/malls/${newMall.id}/courts`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.courts)).toBe(true);
            expect(response.body.courts.length).toBe(0);
        });
    });

    describe('DELETE /api/malls/:id', () => {
        it('Debería eliminar centro comercial como super admin', async () => {
            const tempMall = await Mall.create({
                nombreCentro: 'Temp Mall for Delete',
                direccion: 'Address',
                telefono: '6666666666',
                ciudad: 'City',
                activo: true
            });

            const response = await request(app)
                .delete(`/api/malls/${tempMall.id}`)
                .set('Authorization', `Bearer ${superAdminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toContain('eliminado');
        });

        it('No debería permitir eliminar mall sin ser super admin', async () => {
            const response = await request(app)
                .delete(`/api/malls/${testMallId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(403);
        });

        it('Debería retornar error para mall inexistente en eliminación', async () => {
            const response = await request(app)
                .delete('/api/malls/99999')
                .set('Authorization', `Bearer ${superAdminToken}`);

            expect(response.status).toBe(404);
        });

        it('No debería permitir eliminar mall sin autenticación', async () => {
            const response = await request(app)
                .delete(`/api/malls/${testMallId}`);

            expect(response.status).toBe(401);
        });
    });
});
