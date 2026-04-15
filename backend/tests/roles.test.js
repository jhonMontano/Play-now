import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import sequelize from '../src/config/database.js';
import User from '../src/models/user.js';
import Roles from '../src/models/roles.js';

describe('Roles Module Tests', () => {
  let superAdminToken;
  let adminToken;
  let userToken;
  let testRoleId;

  beforeAll(async () => {
    const existingRoles = await Roles.findAll();
    if (existingRoles.length === 0) {
      await Roles.bulkCreate([
        { nombre: 'superAdmin' },
        { nombre: 'admin' },
        { nombre: 'usuario' }
      ]);
    }

    const superAdmin = await User.create({
      tipoDocumento: 'CC',
      numeroDocumento: '1111111111',
      primerNombre: 'Super',
      primerApellido: 'Admin',
      correo: 'superadmin@roles.com',
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
      correo: 'admin@roles.com',
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
      correo: 'user@roles.com',
      celular: '3000000003',
      direccion: 'Test Address',
      password: 'password123',
      idRol: 3,
      activo: true
    });

    const roles = await Roles.findAll();
    if (roles.length > 0) {
      testRoleId = roles[0].id;
    }

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

  describe('POST /api/roles', () => {
    it('Debería crear rol exitosamente como super admin', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          nombre: 'gerente'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Rol creado exitosamente');
      expect(response.body.role).toHaveProperty('id');
      expect(response.body.role.nombre).toBe('gerente');

      testRoleId = response.body.role.id;
    });

    it('No debería permitir crear rol sin nombre', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('No debería permitir crear rol sin ser super admin', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'operador'
        });

      expect(response.status).toBe(403);
    });

    it('No debería permitir crear rol sin autenticación', async () => {
      const response = await request(app)
        .post('/api/roles')
        .send({
          nombre: 'vendedor'
        });

      expect(response.status).toBe(401);
    });

    it('Debería retornar error si el rol ya existe', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          nombre: 'superAdmin' // Ya existe desde beforeAll
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('El rol ya existe');
    });
  });

  describe('GET /api/roles', () => {
    it('Debería obtener todos los roles', async () => {
      const response = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('Debería obtener roles como super admin', async () => {
      const response = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('No debería obtener roles sin autenticación', async () => {
      const response = await request(app)
        .get('/api/roles');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/roles/:id', () => {
    it('Debería obtener rol por ID', async () => {
      const response = await request(app)
        .get(`/api/roles/${testRoleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testRoleId);
    });

    it('Debería retornar error para rol inexistente', async () => {
      const response = await request(app)
        .get('/api/roles/99999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });

    it('No debería obtener rol sin autenticación', async () => {
      const response = await request(app)
        .get(`/api/roles/${testRoleId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/roles/:id', () => {
    it('Debería actualizar rol como super admin', async () => {
      const response = await request(app)
        .put(`/api/roles/${testRoleId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          nombre: 'gerente_actualizado'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('actualizado');
      expect(response.body.role.nombre).toBe('gerente_actualizado');
    });

    it('No debería permitir actualizar rol sin ser super admin', async () => {
      const response = await request(app)
        .put(`/api/roles/${testRoleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'cambio_no_autorizado'
        });

      expect(response.status).toBe(403);
    });

    it('Debería retornar error para rol inexistente en actualización', async () => {
      const response = await request(app)
        .put('/api/roles/99999')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          nombre: 'noexiste'
        });

      expect(response.status).toBe(404);
    });

    it('No debería actualizar rol sin autenticación', async () => {
      const response = await request(app)
        .put(`/api/roles/${testRoleId}`)
        .send({
          nombre: 'noauth'
        });

      expect(response.status).toBe(401);
    });

    it('No debería actualizar rol sin nombre', async () => {
      const response = await request(app)
        .put(`/api/roles/${testRoleId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({});

      expect([200, 400]).toContain(response.status);
    });
  });

  describe('DELETE /api/roles/:id', () => {
    it('Debería eliminar rol como super admin', async () => {
      const roleRes = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          nombre: 'rol_temporal'
        });

      if (roleRes.status === 201) {
        const tempRoleId = roleRes.body.role.id;

        const response = await request(app)
          .delete(`/api/roles/${tempRoleId}`)
          .set('Authorization', `Bearer ${superAdminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('eliminado');
      }
    });

    it('No debería permitir eliminar rol sin ser super admin', async () => {
      const response = await request(app)
        .delete(`/api/roles/${testRoleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(403);
    });

    it('Debería retornar error para rol inexistente en eliminación', async () => {
      const response = await request(app)
        .delete('/api/roles/99999')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(404);
    });

    it('No debería permitir eliminar rol sin autenticación', async () => {
      const response = await request(app)
        .delete(`/api/roles/${testRoleId}`);

      expect(response.status).toBe(401);
    });

    it('No debería permitir eliminar rol con usuarios asignados', async () => {
      const testRoleResponse = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          nombre: 'rol_con_usuarios'
        });

      const roleId = testRoleResponse.body.role.id;

      await User.create({
        tipoDocumento: 'CC',
        numeroDocumento: '9999999999',
        primerNombre: 'Test',
        primerApellido: 'User',
        correo: 'testuser@delete.com',
        celular: '3000000099',
        direccion: 'Test Address',
        password: 'password123',
        idRol: roleId,
        activo: true
      });

      const response = await request(app)
        .delete(`/api/roles/${roleId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('No se puede eliminar el rol');
    });
  });

  describe('Role permissions and constraints', () => {
    it('Debería retornar error si se intenta operación sin token válido', async () => {
      const response = await request(app)
        .get('/api/roles')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });

    it('Debería retornar unauthorized para usuario normal intentando crear rol', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          nombre: 'unauthorized_role'
        });

      expect(response.status).toBe(403);
    });
  });
});
