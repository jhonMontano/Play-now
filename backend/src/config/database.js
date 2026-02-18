import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction && process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres",
      logging: false,
    }
  );
}

try {
  await sequelize.authenticate();
  console.log("Conexión exitosa con la base de datos PostgreSQL");
} catch (error) {
  console.error("Error al conectar con la base de datos:", error.message);
  console.error("Detalles completos:", error);
}

export default sequelize;