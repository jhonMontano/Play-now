import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from '../src/config/database.js';
import '../src/models/associations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

const clearTables = async () => {
  const tables = ['Reservations', 'Courts', 'Malls', 'Sports', 'Users'];
  for (const table of tables) {
    try {
      await sequelize.query(`DELETE FROM "${table}"`);
    } catch (error) {
    }
  }
};

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Base de datos de prueba conectada');
    await sequelize.sync({ force: true });
    console.log('Modelos sincronizados');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }
});

afterEach(async () => {
  try {
    await sequelize.query(`DELETE FROM "Reservations" CASCADE`, { raw: true });
  } catch (error) {
  }
});

afterAll(async () => {
  await sequelize.close();
  console.log('Conexión cerrada');
});