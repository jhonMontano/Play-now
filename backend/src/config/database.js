import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

try {
  await sequelize.authenticate();
  console.log("Conexión exitosa con la base de datos PostgreSQL");
} catch (error) {
  console.error("Error al conectar con la base de datos:", error);
}

export default sequelize;
