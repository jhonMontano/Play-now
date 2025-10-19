import app from "./src/app.js";
import sequelize from "./src/config/database.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  try {
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados con la base de datos PostgreSQL listo");
  } catch (error) {
    console.error("Error al sincronizar modelos:", error);
  }
});
