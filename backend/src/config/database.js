import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize;

if (process.env.NODE_ENV === "production") {
  console.log("🚀 Usando DATABASE_URL (producción)");

  if (!process.env.DATABASE_URL) {
    throw new Error("❌ DATABASE_URL no está definida en producción");
  }

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

} else {
  console.log("💻 Usando configuración LOCAL");

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

export default sequelize;